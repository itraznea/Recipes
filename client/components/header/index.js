import React from "react";
//import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";

export default class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: ""
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
					<div className="nav-login">
						<input className="login-input" type="text" placeholder="username" onChange={this.usernameChangeHandler} value={this.state.username}/>
						<input className="login-input" type="password" placeholder="password" onChange={this.passwordChangeHandler} value={this.state.password}/>
						<button className="btn btn-success btn-login">Login</button>
					</div>
				</nav>
			</header>
		);
	}
}

Header.propTypes = {

};
