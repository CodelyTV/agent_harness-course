import { describe, expect, it } from "vitest";

import { lintAs } from "./lintAs";

const rule = "no-restricted-imports";

describe(rule, () => {
	it("fails when a repository queries through the sql client of src/lib/db", async () => {
		const messages = await lintAs(
			"src/contexts/backend/rule-test-raw-sql/infrastructure/PostgresWishlistRepository.ts",
			[
				'import { sql } from "../../../../lib/db";',
				"",
				"export async function wishlistSize(): Promise<number> {",
				"\tconst rows = await sql`select 1 from wishlist_items`;",
				"",
				"\treturn rows.length;",
				"}",
				"",
			].join("\n"),
		);

		expect(messages.map((message) => message.ruleId)).toContain(rule);
	}, 30_000);

	it("passes when a repository extends PostgresRepository", async () => {
		const messages = await lintAs(
			"src/contexts/backend/rule-test-raw-sql/infrastructure/PostgresWishlistRepository.ts",
			[
				'import { PostgresRepository } from "@/contexts/backend/shared/infrastructure/PostgresRepository";',
				"",
				"export class PostgresWishlistRepository extends PostgresRepository {",
				"\tasync size(): Promise<number> {",
				"\t\tconst rows = await this.sql`select 1 from wishlist_items`;",
				"",
				"\t\treturn rows.length;",
				"\t}",
				"}",
				"",
			].join("\n"),
		);

		expect(messages).toEqual([]);
	}, 30_000);
});
