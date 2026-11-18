import { describe, expect, it } from "vitest";

import { lintAs } from "./lintAs";

const rule = "import/no-restricted-paths";

describe(rule, () => {
	it("fails when new code imports a legacy service", async () => {
		const messages = await lintAs(
			"src/app/actions/rule-test-legacy-layer/addToWishlist.ts",
			[
				'import { WishlistService } from "@/services/WishlistService";',
				"",
				"export async function addToWishlist(userId: string, productId: string): Promise<void> {",
				"\tawait WishlistService.add(userId, productId);",
				"}",
				"",
			].join("\n"),
		);

		expect(messages.map((message) => message.ruleId)).toContain(rule);
	}, 30_000);

	it("passes when new code calls a use case through the container", async () => {
		const messages = await lintAs(
			"src/app/actions/rule-test-legacy-layer/countCart.ts",
			[
				'import { retailContainer } from "@/contexts/backend/shared/infrastructure/RetailContainer";',
				"",
				"export async function countCart(): Promise<number> {",
				"\treturn retailContainer.cartItemCounter.count();",
				"}",
				"",
			].join("\n"),
		);

		expect(messages).toEqual([]);
	}, 30_000);
});
