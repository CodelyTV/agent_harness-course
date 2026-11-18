const message =
	"Do not read the system time here: inject a Clock and call clock.now(). SystemClock is the only adapter that reads it. Convention: src/contexts/backend/reviews/application/create/ProductReviewCreator.ts";

export const noSystemTime = {
	meta: {
		type: "problem",
		docs: {
			description: "Read the current time through an injected Clock",
		},
		schema: [],
		messages: {
			systemTime: message,
		},
	},
	create(context) {
		return {
			"NewExpression[callee.type='Identifier'][callee.name='Date'][arguments.length=0]"(
				node,
			) {
				context.report({ node, messageId: "systemTime" });
			},
			"CallExpression[callee.type='MemberExpression'][callee.object.name='Date'][callee.property.name='now']"(
				node,
			) {
				context.report({ node, messageId: "systemTime" });
			},
		};
	},
};
