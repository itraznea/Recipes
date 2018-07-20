import React from "react";
import PropTypes from "prop-types";
import {Switch, Route} from "react-router";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Header from "../../components/header";
import Home from "../home/index";
import Register from "../register/index";
import Profile from "../profile/index";
import {alphabeticalOrderedStringify} from "../../../utils/util";

export class Index extends React.Component {
	get preloaded() {
		return {
			__html: `var __PRELOADED_STATE__ = ${alphabeticalOrderedStringify({
				user: this.props.user
			})};`
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
						href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
						integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB"
						crossOrigin="anonymous"
					/>
					<link rel="stylesheet" href="/assets/css/style.css"/>
					<link rel="stylesheet" href="/assets/css/media.css"/>
					<title>{this.props.title}</title>
					<script dangerouslySetInnerHTML={this.preloaded}/>
				</head>
				<body className={this.bgClass}>
					<Header />
					<main className="container">
						<Switch location={this.props.location}>
							<Route path="/register" component={Register} />
							<Route path="/profile" component={Profile} />
							<Route path="/" exact component={Home} />
						</Switch>
					</main>
					{/* <Footer/> */}
					<script src="/assets/js/bundle.js" />
				</body>
			</html>
		);
	}
}
Index.propTypes = {
	title: PropTypes.string,
	location: PropTypes.object,
	user: PropTypes.object,
	actions: PropTypes.objectOf(PropTypes.func)
};

export default connect(
	(state, ownProps) => {
		return {
			user: state.user,
			location: state.routing.location
		};
	},
	(dispatch) => {
		const actions = Object.assign({});
		return {actions: bindActionCreators(actions, dispatch)};
	}
)(Index);
