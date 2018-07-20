import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import userRedux from "../../redux/user";

export class DeleteAccount extends React.Component {
	constructor(props) {
		super(props);
		this.state = Object.assign({}, props.user.profile.password);

		this.handlers = {};
	}

	get passwordChangeHandler() {
		return this.handlers.passwordChangeHandler || (
			this.handlers.passwordChangeHandler = (event) => {
				event.stopPropagation();
				this.setState({password: event.target.value});
			}
		);
	}

	get closeButtonHandler() {
		return this.handlers.closeButtonHandler || (
			this.handlers.closeButtonHandler = (event) => {
				event.stopPropagation();
				event.preventDefault();
				this.setState(this.props.user.profile.password);
				return typeof this.props.hideButtonHandler === "function" && this.props.hideButtonHandler(event);
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
								<h4 className="modal-title">Are you sure you want to delete your account?</h4>
								<button
									type="button"
									className="close"
									data-dismiss="modal"
									onClick={this.closeButtonHandler}
								>&times;</button>
							</div>
							{/* <!-- Modal body --> */}
							<form>
								<div className="modal-body">
									<div className="form-group">
										<input
											type="password"
											className="form-control"
											id="deletePassword"
											placeholder="Confirm password"
											onChange={this.passwordChangeHandler}
											value={this.props.user.profile.password}
										/>
									</div>

								</div>

								{/* <!-- Modal footer --> */}
								<div className="modal-footer">
									<button type="submit" className="btn btn-primary btn-register">Yes, delete</button>
									<button
										type="button"
										className="btn btn-danger"
										data-dismiss="modal"
										onClick={this.props.hideButtonHandler}
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

DeleteAccount.propTypes = {
	user: PropTypes.object,
	visible: PropTypes.bool,
	hideButtonHandler: PropTypes.func,
	userActions: PropTypes.objectOf(PropTypes.func)
};

DeleteAccount.defaultValues = {
	visible: false
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
)(DeleteAccount);
