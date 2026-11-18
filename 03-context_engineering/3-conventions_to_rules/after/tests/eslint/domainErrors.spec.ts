import { describe, expect, it } from "vitest";

import { lintAs } from "./lintAs";

const rule = "no-restricted-syntax";

describe(`${rule} on errors thrown in the contexts`, () => {
	it("fails when a use case throws a generic Error", async () => {
		const messages = await lintAs(
			"src/contexts/backend/rule-test-domain-errors/application/WishlistAdder.ts",
			[
				"export class WishlistAdder {",
				"\tadd(productId: string): void {",
				"\t\tif (productId.length === 0) {",
				'\t\t\tthrow new Error("A product id is required");',
				"\t\t}",
				"\t}",
				"}",
				"",
			].join("\n"),
		);

		expect(messages.map((message) => message.ruleId)).toContain(rule);
	}, 30_000);

	it("passes when a use case throws a domain error", async () => {
		const messages = await lintAs(
			"src/contexts/backend/rule-test-domain-errors/application/WishlistAdder.ts",
			[
				'import { VariantNotFoundError } from "@/contexts/backend/checkout/domain/errors/VariantNotFoundError";',
				"",
				"export class WishlistAdder {",
				"\tadd(variantId: string): void {",
				"\t\tif (variantId.length === 0) {",
				"\t\t\tthrow new VariantNotFoundError(variantId);",
				"\t\t}",
				"\t}",
				"}",
				"",
			].join("\n"),
		);

		expect(messages).toEqual([]);
	}, 30_000);
});
