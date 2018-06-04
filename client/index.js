import React from "react";
import {Provider} from "react-redux";
import configureStore from "./redux/configureStore";
import {ConnectedRouter} from "react-router-redux";
import PropTypes from "prop-types";
// import {BrowserRouter} from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import {hydrate} from "react-dom";

import Index from "./route-components/index";

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);
const history = createBrowserHistory();
class DevBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	componentDidCatch(error, info) {
		this.setState({ hasError: true });
		console.info("error in boundary for react... :", error, info);
	}

	render() {
		if (this.state.hasError) {
			return <html>
				<head>
					<title>error boundary ...</title>
				</head>
				<body>
					Check your console.. there might have been an error or something.
				</body>
			</html>;
		}
		return this.props.children;
	}
}

DevBoundary.propTypes = {
	children: PropTypes.any
};

hydrate(
	<DevBoundary>
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Index/>
			</ConnectedRouter>
		</Provider>
	</DevBoundary>
	, document);
