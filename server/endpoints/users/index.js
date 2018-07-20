import bcrypt from "bcrypt";
import crypto from "crypto";
const emailRegEx = /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/;
export class UsersEndPoints {
	constructor(mongoConnection) {
		this.mongoConnection = mongoConnection;
	}

	get login() {
		return (req, res) => {
			if (typeof req.body.username !== "string" || typeof req.body.password !== "string") {
				res.status(400).end();
				return true;
			}
			this.mongoConnection.collection("users").findOne({username: req.body.username}, (err, doc) => {
				if (err) {
					console.error("Error in db:", err);
					res.status(500).end();
					return true;
				}
				if (!doc) {
					setTimeout(() => {
						res.status(404).end();
					}, 1000);
					return true;
				}
				bcrypt.compare(req.body.password, doc.password, (bcError, result) => {
					if (bcError) {
						console.error("Error in bcrypt:", bcError);
						res.status(500).end();
						return true;
					}
					if (result) {
						let hash = crypto.createHash("whirlpool");
						hash.update(doc.username + "_" + (new Date()) + "%@&7843GH$&%#8Gh#84(^#hgf5@&%928%&@!*^jgY%&W");
						const digestedHash = hash.digest("base64");
						return this.mongoConnection
							.collection("users")
							.findAndModify({
								query: {
									username: doc.username
								},
								update: {
									$set: {
										authHash: digestedHash
									}
								},
								new: true
							}, (dbError, doc, modifies) => {
								if (dbError) {
									console.error("Error in db:", dbError);
									res.status(500).end();
									return true;
								}
								res.cookie("authToken", digestedHash, {
									httpOnly: true,
									expires: new Date(Date.now() + 6.048e8)
								}).status(201).json({
									firstName: doc.firstName,
									lastName: doc.lastName,
									username: doc.username,
									email: doc.email,
									bio: doc.bio
								});
								return true;
							});
					}
					res.status(404).end();
					return true;
				});
				return true;
			});
			return true;
		};
	}
	get checkLogin() {
		return (req, res) => {
			if (!req.cookies || !req.cookies.authToken) {
				res.status(400).end();
				return false;
			}
			this.mongoConnection
				.collection("users")
				.findOne({authHash: req.cookies.authToken}, (err, doc) => {
					if (err) {
						res.status(500).end();
						console.error("problems with db whatever...");
						return false;
					}
					if (!doc) {
						res.status(403).end();
						return false;
					}
					res.status(200).json({
						firstName: doc.firstName,
						username: doc.username,
						lastName: doc.lastName,
						email: doc.email,
						bio: doc.bio
					});
					return false;
				});
			return false;
		};
	}

	get register() {
		return (req, res) => {
			if (typeof req.body.username !== "string" ||
				typeof req.body.password !== "string" ||
				typeof req.body.firstName !== "string" ||
				typeof req.body.lastName !== "string" ||
				req.body.password !== req.body.password1 ||
				!(emailRegEx.test(req.body.email))) {
				res.status(400).end();
				return true;
			}

			bcrypt.hash(req.body.password, 10)
				.then((hashedPassword) => {
					this.mongoConnection
						.collection("users")
						.insert({
							username: req.body.username,
							password: hashedPassword,
							email: req.body.email,
							firstName: req.body.firstName,
							lastName: req.body.lastName,
							bio: ""
						}, (err, doc) => {
							if (err) {
								if (err.code === 11000) {
									res.status(409).end();
									return true;
								}
								res.status(500).end();
								console.error("MongoDB error:", err);
								return true;
							}
							res.status(201).end();
							return true;
						});
				});
			return true;
		};
	}

	get logout() {
		return (req, res) => {
			this.mongoConnection
				.collection("users")
				.update({authHash: req.cookies.authToken}, {$unset: {authHash: 1}}, (dbError, doc) => {
					if (dbError) {
						console.error("Error in db:", dbError);
						res.status(500).end();
						return true;
					}
					res.cookie("authToken", "", {
						httpOnly: true,
						expires: new Date(Date.now())
					}).status(201).end();
					return true;
				});
		};
	}

	get changeDetails() {
		return (req, res) => {
			if (!req.cookies || !req.cookies.authToken) {
				res.status(400).end();
				return true;
			}
			this.mongoConnection.collection("users").findOne({authHash: req.cookies.authToken}, (err, doc) => {
				if (err) {
					console.error("Error in db:", err);
					res.status(500).end();
					return true;
				}
				if (!doc) {
					setTimeout(() => {
						res.status(404).end();
					}, 1000);
					return true;
				}
				bcrypt.compare(req.body.password, doc.password, (bcError, result) => {
					if (bcError) {
						console.error("Error in bcrypt:", bcError);
						res.status(404).end();
						return true;
					}
					if (result) {
						const updateSetter = Object.keys(req.body.userData).reduce((acc, itemKey) => {
							if (itemKey === "email" && !(emailRegEx.test(req.body.email))) {
								return acc;
							}
							if (req.body.userData[itemKey]) {
								acc[itemKey] = req.body.userData[itemKey];
							}
							return acc;
						}, {});
						return this.mongoConnection
							.collection("users")
							.findAndModify({
								query: {
									username: doc.username
								},
								update: {
									$set: updateSetter
								},
								new: true
							}, (dbError, doc, modifies) => {
								if (dbError) {
									console.error("Error in db:", dbError);
									res.status(500).end();
									return true;
								}
								res.status(201).json({
									username: doc.username,
									firstName: doc.firstName,
									lastName: doc.lastName,
									email: doc.email,
									bio: doc.bio
								});
								return true;
							});
					}
					res.status(404).end();
					return true;
				});
				return true;
			});
			return true;
		};
	}

	get deleteAccount() {
		return (req, res) => {
			if (!req.cookies || !req.cookies.authToken || !req.body.password) {
				res.status(400).end();
				return true;
			}

			this.mongoConnection
				.collection("users")
				.findOne(
					{
						authHash: req.cookies.authToken
					},
					(err, doc) => {
						if (err) {
							res.status(500).end();
							console.error("Error in db", err);
							return true;
						}
						if (!doc) {
							res.cookie("authToken", "", {
								expires: new Date(Date.now()),
								httpOnly: true
							}).status(401).end();
							return true;
						}
						bcrypt.compare(req.body.password, doc.password, (bcError, result) => {
							if (bcError) {
								res.status(500).end();
								console.error("Error in bcrypt", bcError);
								return true;
							}
							if (result) {
								this.mongoConnection.collection("users").deleteOne(
									{
										authHash: req.cookies.authToken
									},
									(err) => {
										if (err) {
											res.status(500).end();
											console.error("Error in db", err);
											return true;
										}
										res.cookie("authToken", "", {
											expires: new Date(Date.now()),
											httpOnly: true
										}).status(200).end();
										return true;
									}
								);
								return true;
							}
							return true;
						});
						return true;
					}
				);
			return true;
		};
	}
}

export default function(app, mongoConnection) {
	const usersInstance = new UsersEndPoints(mongoConnection);
	app.post("/users/login", usersInstance.login);
	app.get("/users/login", usersInstance.checkLogin);
	app.delete("/users/login", usersInstance.logout);
	app.post("/users/register", usersInstance.register);
	app.put("/users/profile", usersInstance.changeDetails);
}
