let promiseArray = [];
/**
 * Replaces both Promise Middleware and Thunk.
 */
export default class CapturePromise {
	/**
   * Gets a copy of the promises array.
   * @returns {*[]}
   */
	static get promises() {
		return [].concat(promiseArray);
	}

	/**
   * Gets the midleware that can be used with Redux.
   * @returns {function(*=): function(*): function(*=)}
   */
	static get middleware() {
		return ref => next => action => {
			if (typeof action === "function") {
				return action();
			}
			if (typeof action === "object") {
				if (typeof action.payload === "function") {
					return action.payload();
				}
				if (!(action.payload instanceof Promise)) {
					return next(action);
				}
				// first dispatch the PENDING
				next({
					type: action.type + "_PENDING",
					payload: {}
				});
				promiseArray.push(action.payload);
				// process the promise now.
				return action.payload.then(result => {
					promiseArray = promiseArray.filter(item => item !== action.payload);
					ref.dispatch({
						type: action.type + "_FULFILLED",
						payload: result
					});
					return Promise.resolve(true);
				}).catch(reason => {
					promiseArray = promiseArray.filter(item => item !== action.payload);
					ref.dispatch({
						type: action.type + "_REJECTED",
						payload: reason
					});
					return Promise.resolve(true);
				});
			}
			return next(action);
		};
	}
}
