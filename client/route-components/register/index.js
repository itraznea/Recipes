import React from "react";
import PropTypes from "prop-types";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import userRedux from "../../redux/user";

export class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			password1: "",
			firstName: "",
			lastName: "",
			email: ""
		};
		this.handlers = {};
	}

	get usernameChangeHandler() {
		return this.handlers.usernameChangeHandler || (
			this.handlers.usernameChangeHandler = (event) => {
				event.stopPropagation();
				this.setState({username: event.target.value});
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

	get password1ChangeHandler() {
		return this.handlers.password1ChangeHandler || (
			this.handlers.password1ChangeHandler = (event) => {
				event.stopPropagation();
				this.setState({password1: event.target.value});
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

	get registerSubmitHandler() {
		return this.handlers.registerSubmitHandler || (
			this.handlers.registerSubmitHandler = (event) => {
				event.stopPropagation();
				event.preventDefault();
				this.props.userActions.register(this.state);
				return false;
			}
		);
	}
	get renderedRegisterForm() {
		return (
			<React.Fragment>
				<h3>Welcome</h3>
				<p>Please complete all fields to successfully register</p>
				{!this.props.user.pending && this.props.user.error && (
					<div className="error">
						{this.props.user.error}
					</div>
				)}
				<form onSubmit={this.registerSubmitHandler}>
					<div className="input-group mb-3">
						<input type="text" className="form-control" id="username" placeholder="Username" onChange={this.usernameChangeHandler} value={this.state.username}/>
					</div>

					<div className="input-group mb-3">
						<input type="password" className="form-control" id="password" placeholder="Password" onChange={this.passwordChangeHandler} value={this.state.password}/>
					</div>
					{this.state.password !== "" && (
						<div className={this.state.password !== this.state.password1 ? "input-group mb-3 red-border" : "input-group mb-3"}>
							<input type="password" className="form-control" id="password1" placeholder="Confirm password" onChange={this.password1ChangeHandler} value={this.state.password1}/>
						</div>
					)}

					<div className="input-group mb-3">
						<input type="text" className="form-control" id="firstName" placeholder="First name" onChange={this.firstNameChangeHandler} value={this.state.firstName}/>
					</div>

					<div className="input-group mb-3">
						<input type="text" className="form-control" id="lastName" placeholder="Last name" onChange={this.lastNameChangeHandler} value={this.state.lastName}/>
					</div>

					<div className="input-group mb-3">
						<input type="text" className="form-control" id="email" placeholder="email@example.com" onChange={this.emailChangeHandler} value={this.state.email}/>
					</div>

					<button type="submit" className="btn btn-primary btn-register">Register</button>
				</form>
			</React.Fragment>
		);
	}
	get registerRendered() {
		if (this.props.user.pending) {
			return (
				<div className="loading">
					Some loading image.
				</div>
			);
		}
		if (this.props.user.registered) {
			return (
				<div className="register-success" >
					Welcome text ...
				</div>
			);
		}
		return this.renderedRegisterForm;
	}
	render() {
		return (
			<React.Fragment>
				<div className="container mt-3">
					{
						this.registerRendered
					}
				</div>
			</React.Fragment>
		);
	}
}

Register.propTypes = {
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
)(Register);
