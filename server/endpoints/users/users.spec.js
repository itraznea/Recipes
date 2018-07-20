import {UsersEndPoints} from "./";

describe("The users endpoint class should", () => {
	let mongoConn = null;
	let res = null;
	let collection = null;
	let savedConsoleError = console.error;
	beforeEach(() => {
		console.error = jest.fn();
		collection = {
			find: jest.fn(),
			findOne: jest.fn(),
			insert: jest.fn(),
			findAndModify: jest.fn(),
			update: jest.fn()
		};
		mongoConn =  {
			collection(p) {
				return collection;
			}
		};
		let status = jest.fn();
		let json = jest.fn();
		let end = jest.fn();
		let cookie = jest.fn();
		res = {
			status,
			json,
			cookie,
			end
		};
		status.mockReturnValue(res);
		json.mockReturnValue(res);
		end.mockReturnValue(res);
		cookie.mockReturnValue(res);
	});
	afterEach(() => {
		console.error = savedConsoleError;
	});
	it("expose a login server handler", () => {
		const uEI = new UsersEndPoints(mongoConn);
		expect(typeof uEI.login).toBe("function");
	});
	describe("the exposed login handler should:", () => {
		it("respond with 400 on no username", () => {
			const uEI = new UsersEndPoints(mongoConn);
			uEI.login({body: {password: "dgsgs"}}, res);
			expect(res.status).toBeCalledWith(400);
			expect(res.end).toBeCalled();
		});
		it("respond with 400 on no password", () => {
			const uEI = new UsersEndPoints(mongoConn);
			uEI.login({body: {username: "dgsgs"}}, res);
			expect(res.status).toBeCalledWith(400);
			expect(res.end).toBeCalled();
		});
		it("responds 500 on db error", () => {
			collection.findOne = jest.fn((findObj, cb) => {
				cb(new Error("someError"), null);
			});
			const uEI = new UsersEndPoints(mongoConn);
			uEI.login({body: {username: "dgsgs", password: "hjh"}}, res);
			expect(res.status).toBeCalledWith(500);
			expect(console.error).toBeCalled();
			expect(res.end).toBeCalled();
		});
		it("responds with 404 if user not found in one second not earlier", (done) => {
			collection.findOne = jest.fn((findObj, cb) => {
				cb(null, null);
			});
			const uEI = new UsersEndPoints(mongoConn);
			uEI.login({body: {username: "dgsgs", password: "hjh"}}, res);
			setTimeout(() => {
				expect(res.status).not.toBeCalled();
				expect(res.end).not.toBeCalled();
			}, 990);
			setTimeout(() => {
				expect(res.status).toBeCalledWith(404);
				expect(res.end).toBeCalled();
				done();
			}, 1000);
		});
		it("responds with 500 on bcrypt error", (done) => {
			collection.findOne = jest.fn((findObj, cb) => {
				cb(null, {password: null});
			});
			const uEI = new UsersEndPoints(mongoConn);
			uEI.login({body: {username: "dgsgs", password: "this password won't match"}}, res);
			setTimeout(() => {
				expect(res.status).toBeCalledWith(500);
				expect(res.end).toBeCalled();
				expect(console.error).toBeCalledWith("Error in bcrypt:", new Error("data and hash arguments required"));
				done();
			}, 200);
		});
		it("responds with 404 on password mismatch", (done) => {
			collection.findOne = jest.fn((findObj, cb) => {
				cb(null, {password: "$2b$10$i1U8qTxRO8yM7SnDYg7JH.ijpof5FbnY3amsUlllgUkTlLg4uoovK"});
			});
			const uEI = new UsersEndPoints(mongoConn);
			uEI.login({body: {username: "dgsgs", password: "this password won't match"}}, res);
			setTimeout(() => {
				expect(res.status).toBeCalledWith(404);
				expect(res.end).toBeCalled();
				done();
			}, 200);
		});
		it("responds with 201 on success", (done) => {
			collection.findOne = jest.fn((findObj, cb) => {
				cb(null, {password: "$2b$10$i1U8qTxRO8yM7SnDYg7JH.ijpof5FbnY3amsUlllgUkTlLg4uoovK"});
			});
			collection.findAndModify = jest.fn((findObj, cb) => {
				cb(null, {
					firstName: "John",
					lastName: "Test",
					email: "johnt@test.com",
					username: "johnt",
					bio: ""
				});
			});
			const uEI = new UsersEndPoints(mongoConn);
			uEI.login({body: {username: "dgsgs", password: "parola123"}}, res);
			setTimeout(() => {
				expect(res.status).toBeCalledWith(201);
				expect(collection.findAndModify).toBeCalled();
				expect(res.cookie).toBeCalled();
				expect(res.cookie.mock.calls[0][0]).toBe("authToken");
				expect(res.cookie.mock.calls[0][1]).toBe(collection.findAndModify.mock.calls[0][0].update.$set.authHash);
				expect(res.cookie.mock.calls[0][2].httpOnly).toBe(true);
				expect(Math.floor(res.cookie.mock.calls[0][2].expires.getTime() / 1000)).toBeCloseTo(Math.floor(new Date(Date.now() + 6.048e8).getTime() / 1000));
				done();
			}, 200);
		});
	});
});
