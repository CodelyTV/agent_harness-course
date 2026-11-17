import { randomUUID } from "node:crypto";

import type { EventBus } from "@/contexts/shared/domain/event/EventBus";

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
		private readonly eventBus: EventBus,
	) {}

	async place(
		userId: string,
		deliveryMethod: string,
		lines: PlaceOrderLine[],
	): Promise<string> {
		const order = Order.place(
			`order-${randomUUID().slice(0, 8)}`,
			userId,
			new Date().toISOString(),
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
		await this.eventBus.publish(order.pullDomainEvents());

		return order.id.value;
	}
}
