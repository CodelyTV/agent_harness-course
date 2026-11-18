import { randomUUID } from "node:crypto";

import { sql } from "@/lib/db";
import type { Order, OrderLine } from "@/models/Order";

export class OrderService {
	static async place(userId: string, lines: OrderLine[]): Promise<Order> {
		if (lines.length === 0) {
			throw new Error("An order needs at least one line");
		}

		const id = `order-${randomUUID().slice(0, 8)}`;
		const subtotalAmount = lines.reduce(
			(total, line) => total + line.unitPriceAmount * line.quantity,
			0,
		);

		await sql`
			insert into orders (id, user_id, subtotal_amount)
			values (${id}, ${userId}, ${subtotalAmount})
		`;

		for (const line of lines) {
			await sql`
				insert into order_lines (order_id, product_id, variant_id, quantity, unit_price_amount)
				values (${id}, ${line.productId}, ${line.variantId}, ${line.quantity}, ${line.unitPriceAmount})
			`;
		}

		return { id, userId, status: "confirmed", subtotalAmount, lines };
	}

	static async ofUser(userId: string): Promise<Omit<Order, "lines">[]> {
		const rows = await sql<
			{ id: string; user_id: string; status: string; subtotal_amount: number }[]
		>`
			select id, user_id, status, subtotal_amount
			from orders
			where user_id = ${userId}
			order by created_at desc
		`;

		return rows.map((row) => ({
			id: row.id,
			userId: row.user_id,
			status: row.status,
			subtotalAmount: row.subtotal_amount,
		}));
	}
}
