import bcrypt from "bcrypt";
import crypto from "crypto";

export default function(app, mongoConnection) {
	app.post("/users/login", (req, res) => {
		if (typeof req.body.username !== "string" || typeof req.body.password !== "string") {
			res.status(400).end();
			return true;
		}
		mongoConnection.collection("users").findOne({username: req.body.username}, (err, doc) => {
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
			bcrypt.compare(req.body.password, doc.password, (bcError, res) => {
				if (bcError) {
					console.error("Error in bcrypt:", bcError);
					res.status(500).end();
					return true;
				}
				if (res) {
					let hash = crypto.createHash("whirlpool");
					hash.update(doc.username + "_" + (new Date()) + "%@&7843GH$&%#8Gh#84(^#hgf5@&%928%&@!*^jgY%&W");
					const digestedHash = hash.digest("base64");
					return mongoConnection
						.collection("users")
						.update({username: doc.username}, {$set: {authHash: digestedHash}}, (dbError, doc) => {
							if (dbError) {
								console.error("Error in db:", dbError);
								res.status(500).end();
								return true;
							}
							res.cookie("authToken", digestedHash, {
								domain: "localhost",
								httpOnly: true,
								expires: new Date(Date.now() + 6.048e8)
							}).status(201).end();
							return true;
						});
				}
				res.status(404).end();
				return true;
			});
			return true;
		});
		return true;
	});
}
