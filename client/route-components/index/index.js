import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Header from "../../components/header";

export class Index extends React.Component {
	get preloaded() {
		return {
			__html: `var __PRELOADED_STATE__ = {};`
		};
	}

	render() {
		return (
			<html id="html">
				<head>
					<meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
					<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
					<link
						rel="stylesheet"
						href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css"
						integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ"
						crossOrigin="anonymous"
					/>
					<link rel="stylesheet" href="/assets/css/style.css"/>
					<link rel="stylesheet" href="/assets/css/media.css"/>
					<title>{this.props.title}</title>
					<script dangerouslySetInnerHTML={this.preloaded}/>
				</head>
				<body className={this.bgClass}>
					<Header />
					<script src="/assets/js/bundle.js" />
				</body>
			</html>
		);
	}
}
Index.propTypes = {
	title: PropTypes.string,
	location: PropTypes.object,
	actions: PropTypes.objectOf(PropTypes.func)
};

export default connect(
	(state, ownProps) => {
		return {
			title: state.title,
			location: state.routing.location
		};
	},
	(dispatch) => {
		const actions = Object.assign({});
		return {actions: bindActionCreators(actions, dispatch)};
	}
)(Index);
