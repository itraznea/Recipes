import {createStore, applyMiddleware, combineReducers, compose} from "redux";
import CapturePromise from "./middleware/capture-promise";
import {routerReducer, routerMiddleware} from "react-router-redux";

import createBrowserHistory from "history/createBrowserHistory";
import createMemoryHistory from "history/createMemoryHistory";

import userRedux from "./user";

const historyProvider = typeof window !== "undefined" ? createBrowserHistory() : createMemoryHistory();

const composeEnhancers = (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

let configureStore = function(preloadedState) {
	// noinspection JSCheckFunctionSignatures
	return createStore(combineReducers({
		routing: routerReducer,
		user: userRedux.reducer
	}), preloadedState, composeEnhancers(applyMiddleware(routerMiddleware(historyProvider), CapturePromise.middleware)));
};

export default configureStore;
