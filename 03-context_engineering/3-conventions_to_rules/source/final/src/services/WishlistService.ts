import { sql } from "@/lib/db";
import type { WishlistItem } from "@/models/WishlistItem";

export class WishlistService {
	static async itemsOf(userId: string): Promise<WishlistItem[]> {
		const rows = await sql<
			{ user_id: string; product_id: string; added_at: Date }[]
		>`
			select user_id, product_id, added_at
			from wishlist_items
			where user_id = ${userId}
			order by added_at desc
		`;

		return rows.map((row) => ({
			userId: row.user_id,
			productId: row.product_id,
			addedAt: row.added_at.toISOString(),
		}));
	}

	static async add(userId: string, productId: string): Promise<void> {
		const products =
			await sql`select id from products where id = ${productId}`;

		if (products.length === 0) {
			throw new Error(`Product ${productId} not found`);
		}

		await sql`
			insert into wishlist_items (user_id, product_id)
			values (${userId}, ${productId})
			on conflict do nothing
		`;
	}
}
