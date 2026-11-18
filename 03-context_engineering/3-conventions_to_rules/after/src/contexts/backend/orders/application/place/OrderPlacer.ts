import { randomUUID } from "node:crypto";

import type { Clock } from "@/contexts/shared/domain/Clock";

import { Order } from "../../domain/Order";
import { OrderLine } from "../../domain/OrderLine";
import type { OrderRepository } from "../../domain/OrderRepository";

export type PlaceOrderLine = {
	productId: string;
	variantId: string;
	quantity: number;
	unitPriceAmount: number;
};

export class OrderPlacer {
	constructor(
		private readonly repository: OrderRepository,
		private readonly clock: Clock,
	) {}

	async place(
		userId: string,
		deliveryMethod: string,
		lines: PlaceOrderLine[],
	): Promise<string> {
		if (lines.length === 0) {
			throw new Error("An order needs at least one line");
		}

		const order = Order.place(
			`order-${randomUUID().slice(0, 8)}`,
			userId,
			this.clock.now(),
			deliveryMethod,
			"EUR",
			lines.map(
				(line) =>
					new OrderLine(
						line.productId,
						line.variantId,
						line.quantity,
						line.unitPriceAmount,
					),
			),
		);

		await this.repository.save(order);

		return order.id.value;
	}
}
