import { sql } from "@/lib/db";
import type { Cart } from "@/models/Cart";

export class CartService {
	static async of(userId: string): Promise<Cart> {
		const lines = await sql<
			{ product_id: string; variant_id: string; quantity: number }[]
		>`
			select product_id, variant_id, quantity
			from checkout_lines
			where checkout_id = ${`checkout-${userId}`}
		`;

		return {
			userId,
			lines: lines.map((line) => ({
				productId: line.product_id,
				variantId: line.variant_id,
				quantity: line.quantity,
			})),
		};
	}

	static async add(userId: string, variantId: string): Promise<void> {
		const variants = await sql<{ product_id: string; online_stock: number }[]>`
			select product_id, online_stock from product_variants where id = ${variantId}
		`;

		if (variants.length === 0) {
			throw new Error(`Variant ${variantId} not found`);
		}

		if (variants[0].online_stock <= 0) {
			throw new Error(`Variant ${variantId} is out of stock`);
		}

		await sql`
			insert into checkout_lines (checkout_id, product_id, variant_id, quantity)
			values (${`checkout-${userId}`}, ${variants[0].product_id}, ${variantId}, 1)
			on conflict (checkout_id, variant_id)
			do update set quantity = checkout_lines.quantity + 1
		`;
	}
}
