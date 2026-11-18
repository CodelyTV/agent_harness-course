import { describe, expect, it } from "vitest";

import { lintAs } from "./lintAs";

const rule = "no-restricted-syntax";

describe(`${rule} on route handlers`, () => {
	it("fails on a new route handler", async () => {
		const messages = await lintAs(
			"src/app/api/rule-test-route-handlers/route.ts",
			[
				"export function GET(): Response {",
				"\treturn Response.json({ ok: true });",
				"}",
				"",
			].join("\n"),
		);

		expect(messages.map((message) => message.ruleId)).toContain(rule);
	}, 30_000);

	it("passes on a server action", async () => {
		const messages = await lintAs(
			"src/app/actions/rule-test-route-handlers/removeFromCart.ts",
			[
				'"use server";',
				"",
				'import { revalidatePath } from "next/cache";',
				"",
				'import { retailContainer } from "@/contexts/backend/shared/infrastructure/RetailContainer";',
				"",
				"export async function removeFromCart(variantId: string): Promise<void> {",
				"\tawait retailContainer.cartVariantRemover.remove(variantId);",
				'\trevalidatePath("/checkout");',
				"}",
				"",
			].join("\n"),
		);

		expect(messages).toEqual([]);
	}, 30_000);
});
