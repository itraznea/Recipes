require("babel-register")({
	presets: ["react"],
	plugins: ["babel-plugin-transform-es2015-modules-commonjs"]
});
const httpServer = require("./server").httpServer;
httpServer.listen(8080, () => {
	console.info("Listening on 8080...");
});
