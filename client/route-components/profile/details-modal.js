import React from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import userRedux from "../../redux/user";

export class DetailsModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = Object.assign({}, {
			firstName: "",
			lastName: "",
			email: "",
			bio: "",
			password: ""
		}, this.props.user.profile);

		this.handlers = {};
	}

	// static getDerivedStateFromProps(nextProps, state) {
	// 	if (
	// 		state.firstName !== nextProps.user.profile.firstName ||
	//         state.lastName !== nextProps.user.profile.lastName ||
	//         state.email !== nextProps.user.profile.email ||
	//         state.bio !== nextProps.user.profile.bio
	// 	) return Object.assign({}, state, nextProps.user.profile);
	// 	return null;
	// }

	get closeButtonHandler() {
		return this.handlers.closeButtonHandler || (
			this.handlers.closeButtonHandler = (event) => {
				event.stopPropagation();
				event.preventDefault();
				this.setState(this.props.user.profile);
				this.props.userActions.resetUpdate();
				return typeof this.props.hideButtonHandler === "function" && this.props.hideButtonHandler(event);
			}
		);
	}

	get firstNameChangeHandler() {
		return this.handlers.firstNameChangeHandler || (
			this.handlers.firstNameChangeHandler = (event) => {
				event.stopPropagation();
				this.setState({firstName: event.target.value});
			}
		);
	}

	get lastNameChangeHandler() {
		return this.handlers.lastNameChangeHandler || (
			this.handlers.lastNameChangeHandler = (event) => {
				event.stopPropagation();
				this.setState({lastName: event.target.value});
			}
		);
	}

	get emailChangeHandler() {
		return this.handlers.emailChangeHandler || (
			this.handlers.emailChangeHandler = (event) => {
				event.stopPropagation();
				this.setState({email: event.target.value});
			}
		);
	}

	get bioChangeHandler() {
		return this.handlers.bioChangeHandler || (
			this.handlers.bioChangeHandler = (event) => {
				event.stopPropagation();
				this.setState({bio: event.target.value});
			}
		);
	}

	get passwordChangeHandler() {
		return this.handlers.passwordChangeHandler || (
			this.handlers.passwordChangeHandler = (event) => {
				event.stopPropagation();
				this.setState({password: event.target.value});
			}
		);
	}

	get changeDetailsHandler() {
		return this.handlers.changeDetailsHandler || (
			this.handlers.changeDetailsHandler = (event) => {
				event.stopPropagation();
				event.preventDefault();
				this.props.userActions.changeDetails(this.state.password, {
					firstName: this.state.firstName,
					lastName: this.state.lastName,
					email: this.state.email,
					bio: this.state.bio
				});
				return false;
			}
		);
	}

	render() {
		return (
			<React.Fragment>
				<div className={
					this.props.visible ? "modal show fade" : "modal"
				} id="myModal">
					<div className="modal-dialog">
						<div className="modal-content">

							{/* <!-- Modal Header --> */}
							<div className="modal-header">
								<h4 className="modal-title">Change Details</h4>
								<button
									type="button"
									className="close"
									data-dismiss="modal"
									onClick={this.closeButtonHandler}
								>&times;</button>
							</div>

							<div className={(this.props.user.updatedSuccessfully || this.props.user.error) ? "d-block" : "d-none"}>
								{this.props.user.updatedSuccessfully ? "Your details were successfully updated" : this.props.user.error}
							</div>

							{/* <!-- Modal body --> */}
							<form onSubmit={this.changeDetailsHandler}>
								<div className="modal-body">
									<div className="form-group">
										<input
											type="text"
											className="form-control"
											id="firstName"
											placeholder="First name"
											onChange={this.firstNameChangeHandler}
											value={this.state.firstName}
										/>
									</div>

									<div className="form-group">
										<input
											type="text"
											className="form-control"
											id="lastName"
											placeholder="Last name"
											onChange={this.lastNameChangeHandler}
											value={this.state.lastName}
										/>
									</div>
									<div className="form-group">
										<input
											type="text"
											className="form-control"
											id="email"
											placeholder="Email"
											onChange={this.emailChangeHandler}
											value={this.state.email}
										/>
									</div>
									<div className="form-group">
										<label htmlFor="comment">Bio:</label>
										<textarea
											className="form-control"
											rows="5"
											id="bio"
											name="text"
											placeholder="Write something about yourself"
											onChange={this.bioChangeHandler}
											value={this.state.bio}
										></textarea>
									</div>
									<div className="form-group">
										<input
											type="password"
											className="form-control"
											id="password"
											placeholder="Confirm password"
											onChange={this.passwordChangeHandler}
											value={this.state.password}
										/>
									</div>

								</div>

								{/* <!-- Modal footer --> */}
								<div className="modal-footer">
									<button type="submit" className="btn btn-primary btn-register">Submit</button>
									<button
										type="button"
										className="btn btn-danger"
										data-dismiss="modal"
										onClick={this.closeButtonHandler}
									>Cancel</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

DetailsModal.propTypes = {
	user: PropTypes.object,
	visible: PropTypes.bool,
	hideButtonHandler: PropTypes.func,
	userActions: PropTypes.objectOf(PropTypes.func)
};

DetailsModal.defaultValues = {
	visible: true
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
)(DetailsModal);
