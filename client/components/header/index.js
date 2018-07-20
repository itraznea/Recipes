import React from "react";
import PropTypes from "prop-types";
// import {Route, Switch} from "react-router";
import {NavLink} from "react-router-dom";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import userRedux from "../../redux/user";

export class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			dropdownShow: false
		};
		this.handlers = {};
		this.props.userActions.checkLoginStatus();
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

	get loginButtonHandler() {
		return this.handlers.loginButtonHandler || (
			this.handlers.loginButtonHandler = (event) => {
				event.stopPropagation();
				event.preventDefault();
				this.props.userActions.login(this.state.username, this.state.password);
				this.setState({
					username: "",
					password: ""
				});
				return false;
			}
		);
	}

	get logoutHandler() {
		return this.handlers.logoutHandler || (
			this.handlers.logoutHandler = (event) => {
				event.stopPropagation();
				event.preventDefault();
				this.props.userActions.logout(this.state.username);
				return false;
			}
		);
	}

	get dropdownHandler() {
		return this.handlers.dropdownHandler || (
			this.handlers.dropdownHandler = (event) => {
				event.target.focus();
				event.preventDefault();
				this.setState({
					dropdownShow: !this.state.dropdownShow
				});
			}
		);
	}

	get hideDropdownHandler() {
		return this.handlers.hideDropdownHandler || (
			this.handlers.hideDropdownHandler = (event) => {
				if (event && event.relatedTarget) {
					event.relatedTarget.click();
				}
				this.setState({
					dropdownShow: false
				});
			}
		);
	}

	render() {
		return (
			<header>
				<h1>Welcome to Recipes</h1>
				<nav>
					<div className="nav-menu-container">
						<ul className="nav">
							<li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
							<li className="nav-item"><NavLink className="nav-link" to="/recipes">Recipes</NavLink></li>
							<li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
							<li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
						</ul>
					</div>
					{this.props.location.pathname !== "/register" && (
						this.props.user.loggedIn ? (
							<div className="nav-hello">
								<div className="dropdown">
									<a
										href="/profile"
										className="nav-item dropdown-toggle"
										aria-expanded={this.state.dropdownShow}
										onClick={this.dropdownHandler}
										onBlur={this.hideDropdownHandler}
									>
											Hello, {this.props.user.profile.firstName}
									</a>
									<div className={this.state.dropdownShow ? "dropdown-menu show" : "dropdown-menu"}>
										<NavLink className="nav-link" to="/profile">Profile</NavLink>
										<a className="dropdown-item" href="#">My recipes</a>
										<a className="dropdown-item" href="#">Add recipe</a>
									</div>
								</div>
								<a href="logout" className="nav-link" onClick={this.logoutHandler} > Logout </a>
							</div>
						) : (
							<div className="nav-login">
								<form className="login-bar-form">
									<input className="login-input" type="text" placeholder="username" onChange={this.usernameChangeHandler} value={this.state.username}/>
									<input className="login-input" type="password" placeholder="password" onChange={this.passwordChangeHandler} value={this.state.password}/>
									<button className="btn btn-primary btn-login" onClick={this.loginButtonHandler}>Login</button>
								</form>
								<NavLink className="btn btn-success register-link" to="/register" >Register</NavLink>
							</div>
						)
					)}

					{/* <Switch location={this.props.location}>
						<Route path="/register" exact render={() => {
							return null;
						}} />
						<Route render={(props) => {
							return this.props.user.loggedIn ? (
								<div className="nav-hello">
									Hello, {this.props.user.profile.firstName}. <a href="logout" onClick={this.logoutHandler} > Logout </a>
								</div>
							) : (
								<div className="nav-login">
									<input className="login-input" type="text" placeholder="username" onChange={this.usernameChangeHandler} value={this.state.username}/>
									<input className="login-input" type="password" placeholder="password" onChange={this.passwordChangeHandler} value={this.state.password}/>
									<button className="btn btn-primary btn-login">Login</button>
									<NavLink className="btn btn-success register-link" to="/register" >Register</NavLink>
								</div>
							);
						}} />
					</Switch> */}
				</nav>
			</header>
		);
	}
}

Header.propTypes = {
	user: PropTypes.object,
	location: PropTypes.object,
	userActions: PropTypes.objectOf(PropTypes.func)
};

function mapStateToProps(state, ownProps) {
	return {
		user: state.user,
		location: state.routing.location
	};
}
function mapDispatchToProps(dispatch) {
	return Object.assign({}, {
		userActions: bindActionCreators(userRedux.actions, dispatch)
	});
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
