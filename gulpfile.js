const path = require("path");
const stream = require("stream");
console.log(stream.PassThrough);

const gulp = require("gulp");
const webpack = require("webpack");

const sourcemaps = require("gulp-sourcemaps");
const gulpSass = require("gulp-sass");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");

const onBuild = done => {
	return (err, stats) => {
		if (err) {
			console.error("Webpack Build Error ", err);
			done && done();
		} else {
			Object.keys(stats.compilation.assets).forEach(function(key) {
				console.info("Webpack: output  ", key);
			});
			console.info("Webpack: ", stats.compilation.name);
			done && done();
		}
	};
};

gulp.task("sass-style", () => {
	gulp.src([
		"./client/**/style.scss",
		"./client/**/*.style.scss",
		"./components/**/style.scss",
		"./components/**/*.style.scss"
	])
		.pipe(sourcemaps.init())
		.pipe(gulpSass.sync({outputStyle: "compressed"}).on("error", gulpSass.logError))
		.pipe(concat("style.css"))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("public/assets/css/"));
});

gulp.task("sass-media", () => {
	gulp.src([
		"./client/**/media.scss",
		"./client/**/*.media.scss",
		"./components/**/media.scss",
		"./components/**/*.media.scss"
	])
		.pipe(sourcemaps.init())
		.pipe(gulpSass.sync({outputStyle: "compressed"}).on("error", gulpSass.logError))
		.pipe(concat("media.css"))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest("public/assets/css/"));
});

gulp.task("sass", ["sass-style", "sass-media"]);

gulp.task("webpack-modern-SB", done => {
	webpack({
		module: {
			rules: [
				{
					test: /\.jsx?$/,
					use: [{
						loader: "babel-loader",
						options: {
							presets: ["react"],
							plugins: ["babel-plugin-transform-es2015-modules-commonjs"]
						}
					}]
				},
				{
					test: /\.json$/,
					loader: "json-loader"
				}
			]
		},
		devtool: "source-map",
		entry: "./client/index.js",
		mode: "development",
		output: {
			path: path.resolve(__dirname, "public/assets/js"),
			filename: "bundle.js"
		}
	}).run(onBuild(done));
});

gulp.task("build", ["webpack-modern-SB", "sass"]);

gulp.task("default", ["build"]);
