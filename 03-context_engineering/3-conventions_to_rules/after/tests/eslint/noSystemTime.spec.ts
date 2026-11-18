import { describe, expect, it } from "vitest";

import { lintAs } from "./lintAs";

const rule = "retail/no-system-time";
const filePath =
	"src/contexts/backend/rule-test-system-time/application/WishlistAdder.ts";

describe(rule, () => {
	it("fails when a use case creates a Date for now", async () => {
		const messages = await lintAs(
			filePath,
			[
				"export function addedAt(): string {",
				"\treturn new Date().toISOString();",
				"}",
				"",
			].join("\n"),
		);

		expect(messages.map((message) => message.ruleId)).toContain(rule);
	}, 30_000);

	it("fails when a use case calls Date.now", async () => {
		const messages = await lintAs(
			filePath,
			[
				"export function addedAt(): number {",
				"\treturn Date.now();",
				"}",
				"",
			].join("\n"),
		);

		expect(messages.map((message) => message.ruleId)).toContain(rule);
	}, 30_000);

	it("passes when a use case asks an injected Clock and parses dates", async () => {
		const messages = await lintAs(
			filePath,
			[
				'import type { Clock } from "@/contexts/shared/domain/Clock";',
				"",
				"export class WishlistAdder {",
				"\tconstructor(private readonly clock: Clock) {}",
				"",
				"\taddedAt(): string {",
				"\t\treturn this.clock.now();",
				"\t}",
				"",
				"\tyearOf(date: string): number {",
				"\t\treturn new Date(date).getFullYear();",
				"\t}",
				"}",
				"",
			].join("\n"),
		);

		expect(messages).toEqual([]);
	}, 30_000);
});
