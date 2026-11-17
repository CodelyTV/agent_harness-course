import { OrderId } from "@/contexts/backend/orders/domain/OrderId";
import type { OrderRepository } from "@/contexts/backend/orders/domain/OrderRepository";
import type { CurrentUserProvider } from "@/contexts/backend/users/domain/CurrentUserProvider";

import { OrderNotFoundError } from "../../domain/errors/OrderNotFoundError";
import type { CartVariantAdder } from "../add/CartVariantAdder";

export class CartOrderAdder {
	constructor(
		private readonly orderRepository: OrderRepository,
		private readonly cartVariantAdder: CartVariantAdder,
		private readonly currentUserProvider: CurrentUserProvider,
	) {}

	async add(orderId: string): Promise<void> {
		const [order, currentUserId] = await Promise.all([
			this.orderRepository.search(new OrderId(orderId)),
			this.currentUserProvider.currentUserId(),
		]);

		if (!order || order.userId !== currentUserId.value) {
			throw new OrderNotFoundError(orderId);
		}

		const variantIds = order.lines.flatMap((line) =>
			Array<string>(line.quantity).fill(line.variantId),
		);

		await variantIds.reduce(async (previous, variantId) => {
			await previous;
			await this.cartVariantAdder.add(variantId);
		}, Promise.resolve());
	}
}
