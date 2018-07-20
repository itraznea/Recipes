import React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

export class Home extends React.Component {
	render() {
		return (
			<React.Fragment>
                asta e home-ul pula mea vezi si tu ce plm pui aici ...
				aici s-ar putea sa pui lista de retete si ce plm mai vrei tu.
			</React.Fragment>
		);
	}
}
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
)(Home);
