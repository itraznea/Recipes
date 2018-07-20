import users from "./users";

export default function(app, mongoConn) {
	//add endpoints loading and whatever;
	users(app, mongoConn);
}
