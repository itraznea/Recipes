import path from "path";
import http from "http";

import React from "react";
import {renderToString} from "react-dom/server";
import StaticRouter from "react-router-dom/StaticRouter";
import { Provider } from "react-redux";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import mongojs from "mongojs";

import endpoints from "./endpoints";

import CapturePromise from "../client/redux/middleware/capture-promise";
import configureStore from "../client/redux/configureStore";
import Index from "../client/route-components/index";

const app = express();
app.use(cors());
app.use(express.static(path.resolve("./public/")));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoConnection = mongojs("localhost/recipes");

endpoints(app, mongoConnection);

app.use((req, res, next) => {
	try {
		const store = configureStore({
			routing: {
				location: {
					pathname: req.url,
					search: "",
					hash: ""
				}
			}
		});
		const context = {};
		const appRender = (
			<Provider store={store}>
				<StaticRouter context={context} location={req.url}>
					<Index/>
				</StaticRouter>
			</Provider>
		);
		if (context.url) {
			res.redirect(301, context.url);
			return next();
		}
		/**
         * TODO: Come back to the server side rendering once React stabilises the static lifecycle and allows for single pass
         * server side rendering. For now it does two-pass.
         */
		renderToString(appRender);
		const promiseCatcher = () => {
			res.status(200).send("<!doctype html>" + renderToString(appRender));
		};
		Promise.all(CapturePromise.promises).then(promiseCatcher).catch(promiseCatcher);
		return true;
	} catch (err) {
		console.log("ERROR... in server render", err);
		return next();
	}
});

app.use((err, req, res, next) => {
	res.setHeader("x-powered-by", "React");
	console.error("error during loading of URL: ", req.url, ". The error: ", err);
	res.contentType("text/html");
	res.status(500);
	res.end();
});

export const httpServer = http.createServer(app);
