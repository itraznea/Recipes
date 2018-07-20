import axios from "axios";
import config from "./config.js";

const initialState = {
	profile: {
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
		password1: "",
		bio: ""
	},
	loggedIn: false,
	pending: false,
	registered: false,
	updatedSuccessfully: false
};
const userRedux = {
	actions: {
		checkLoginStatus() {
			return {
				type: "CHECK_LOGIN_STATUS",
				payload: axios.get(new URL("/users/login", config.endpointURL).href)
			};
		},

		register(userData) {
			return {
				type: "REGISTER",
				payload: axios.post(new URL("/users/register", config.endpointURL).href, userData)
			};
		},

		login(username, password) {
			return {
				type: "LOGIN",
				payload: axios.post(new URL("/users/login", config.endpointURL).href, {username, password})
			};
		},

		logout() {
			return {
				type: "LOGOUT",
				payload: axios.delete(new URL("/users/login", config.endpointURL).href)
			};
		},

		changeDetails(password, userData) {
			return {
				type: "CHANGE_DETAILS",
				payload: axios.put(new URL("/users/profile", config.endpointURL).href, {password, userData})
			};
		},

		resetUpdate() {
			return {
				type: "RESET_UPDATED"
			};
		}

	},
	reducer(state = initialState, action) {
		switch (action.type) {
			case "UPDATED_DONE":
				return Object.assign({}, state, {
					updated: false
				});
			case "CHECK_LOGIN_STATUS_FULFILLED":
				return Object.assign({}, state, {
					profile: Object.assign({}, {
						firstName: action.payload.data.firstName,
						lastName: action.payload.data.lastName,
						username: action.payload.data.username,
						email: action.payload.data.email,
						bio: action.payload.data.bio
					}),
					pending: false,
					loggedIn: true
				});
			case "CHECK_LOGIN_STATUS_PENDING":
				return Object.assign({}, state, {
					pending: true
				});

			case "CHECK_LOGIN_STATUS_REJECTED":
				return Object.assign({}, state, {
					loggedIn: false,
					profile: Object.assign({}, initialState.profile),
					pending: false
				});

			case "REGISTER_FULFILLED":
				return Object.assign({}, state, {
					registered: true,
					pending: false
				});

			case "REGISTER_PENDING":
				return Object.assign({}, state, {
					pending: true,
					registered: false
				});

			case "REGISTER_REJECTED":
			{
				let error = "";
				switch (action.payload.response.status) {
					case 400:
						error = "Please check your details again";
						break;

					case 409:
						error = "username already exists";
						break;

					case 500:
						error = "Internal error, not your fault. Please try again later.... much later :))";
						break;

					default:
						error = "Unknown error, please contact the lazy admin";
						break;
				}
				return Object.assign({}, state, {
					registered: false,
					error,
					pending: false
				});
			}
			case "LOGIN_FULFILLED":
				return Object.assign({}, state, {
					pending: false,
					loggedIn: true,
					profile: {
						username: action.payload.data.username,
						firstName: action.payload.data.firstName,
						lastName: action.payload.data.lastName,
						email: action.payload.data.email,
						bio: action.payload.data.bio
					}
				});

			case "LOGIN_PENDING":
				return Object.assign({}, state, {
					pending: true,
					loggedIn: false
				});

			case "LOGIN_REJECTED":
				return Object.assign({}, state, {
					loggedIn: false,
					profile: Object.assign({}, initialState.profile),
					pending: false
				});

			case "LOGOUT_PENDING":
			case "LOGOUT_REJECTED":
			case "LOGOUT_FULFILLED":
				return Object.assign({}, state, {
					loggedIn: false,
					profile: {
						username: "",
						firstName: "",
						lastName: "",
						email: "",
						bio: ""
					}
				});
			case "CHANGE_DETAILS_FULFILLED":
				return Object.assign({}, state, {
					pending: false,
					profile: {
						username: action.payload.data.username,
						firstName: action.payload.data.firstName,
						lastName: action.payload.data.lastName,
						email: action.payload.data.email,
						bio: action.payload.data.bio
					},
					updatedSuccessfully: true
				});

			case "CHANGE_DETAILS_PENDING":
				return Object.assign({}, state, {
					pending: true
				});

			case "CHANGE_DETAILS_REJECTED":
			{
				let error = "";
				switch (action.payload.response.status) {
					case 404:
					case 400:
						error = "Please check your details again";
						break;
					case 500:
						error = "Internal error, not your fault. Please try again later.... much later :))";
						break;

					default:
						error = "Unknown error, please contact the lazy admin";
						break;
				}

				return Object.assign({}, state, {
					pending: false,
					error
				});
			}

			case "RESET_UPDATED":
				return Object.assign({}, state, {
					updatedSuccessfully: false,
					error: null
				});

			default:
				return state;
		}
	}
};

export default userRedux;
