import React from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { Redirect } from "react-router-dom";

import userRedux from "../../redux/user";
import DetailsModal from "./details-modal";
import DeleteAccount from "./delete-account";

export class Profile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isChangeModalVisible: false,
			modalChangePasswordShow: false,
			isDeleteAccountModalVisibile: false
		};
		this.handlers = {};
	}

	get showHideModalButtonHandler() {
		return this.handlers.showHideModalButtonHandler || (
			this.handlers.showHideModalButtonHandler = (event) => {
				event.stopPropagation();
				event.preventDefault();
				this.setState({
					isChangeModalVisible: !this.state.isChangeModalVisible
				});
			}
		);
	}

	get showHideDeleteAccountHandler() {
		return this.handlers.showHideDeleteAccountHandler || (
			this.handlers.showHideDeleteAccountHandler = (event) => {
				event.stopPropagation();
				event.preventDefault();
				this.setState({
					isDeleteAccountModalVisibile: !this.state.isDeleteAccountModalVisibile
				});
			}
		);
	}

	get modalChangePasswordHandler() {
		return this.handlers.modalChangePasswordHandler || (
			this.handlers.modalChangePasswordHandler = (event) => {
				event.stopPropagation();
				event.preventDefault();
				this.setState({
					modalChangePasswordShow: !this.state.modalChangePasswordShow
				});
			}
		);
	}

	render() {
		if (this.props.user.loggedIn) {
			return (
				<React.Fragment>
					<div className="profile-container">
						<h1>{this.props.user.profile.username + "'s profile"}</h1>
						<img src="/assets/jpg/profile_img.jpg" />
						<div><h4>Bio</h4></div>
						<div><p>{this.props.user.profile.bio}</p></div>
						<div className="container-details">
							<h4>Details</h4>
							<div className="row">
								<div className="col-sm-1">
									<b>Name:</b>
								</div>
								<div className="col-sm-2">
									{this.props.user.profile.firstName + " " + this.props.user.profile.lastName}
								</div>
							</div>

							<div className="row">
								<div className="col-sm-1">
									<b>Email:</b>
								</div>
								<div className="col-sm-2" >
									{this.props.user.profile.email}
								</div>
							</div>

							<div className="row">
								<div className="col-sm-1">
									<b>Password:</b>
								</div>
								<div className="col-sm-2" >
									<a href="#">Change password</a>
								</div>
							</div>

						</div>

						<DetailsModal
							visible={this.state.isChangeModalVisible}
							hideButtonHandler={this.showHideModalButtonHandler}
						/>
						<DeleteAccount
							visible={this.state.isDeleteAccountModalVisibile}
							hideButtonHandler={this.showHideDeleteAccountHandler}
						/>
						<button className="btn btn-primary" onClick={this.showHideModalButtonHandler}>Change Details</button>
						<button className="btn btn-danger" onClick={this.showHideDeleteAccountHandler}>Delete Account</button>
					</div>
				</React.Fragment>
			);
		}
		return <Redirect to="/" />;
	}
}

Profile.propTypes = {
	user: PropTypes.object,
	userActions: PropTypes.objectOf(PropTypes.func)
};

export default connect(
	(state, ownProps) => {
		return {
			user: state.user,
			location: state.routing.location
		};
	},
	(dispatch) => {
		return Object.assign({}, {
			userActions: bindActionCreators(userRedux.actions, dispatch)
		});
	}
)(Profile);
