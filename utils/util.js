export function alphabeticalOrderedStringify(param) {
	if (!param) return JSON.stringify(param);
	switch (typeof param) {
		case "boolean":
		case "string":
		case "number":
			return JSON.stringify(param);
		case "function":
		default:
			console.warn("param: ", param, " ignored");
			return JSON.stringify(undefined);
		case "object":
			if (Array.isArray(param)) {
				return JSON.stringify(param.map(item => {
					return alphabeticalOrderedStringify(item);
				}));
			} else if (param instanceof Date) {
				return JSON.stringify(param);
			}
			return Object.keys(param).sort().reduce((acc, itemKey) =>
				`${acc}${(acc === "" ? "{" : ",")}"${itemKey}":${alphabeticalOrderedStringify(param[itemKey])}`
				, "") + "}";
	}
}
