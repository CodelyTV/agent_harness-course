import { noSystemTime } from "./rules/no-system-time.mjs";

export const retailPlugin = {
	meta: {
		name: "eslint-plugin-retail",
	},
	rules: {
		"no-system-time": noSystemTime,
	},
};
