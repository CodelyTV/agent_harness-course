import type { OrderRepository } from "@/contexts/backend/orders/domain/OrderRepository";

import type { ProductRepository } from "../../domain/ProductRepository";
import { type ProductResponse, toProductResponse } from "../ProductResponse";

const maxProducts = 4;

export class BoughtTogetherProductsSearcher {
	constructor(
		private readonly orderRepository: OrderRepository,
		private readonly productRepository: ProductRepository,
	) {}

	async search(productId: string): Promise<ProductResponse[]> {
		const [orders, products] = await Promise.all([
			this.orderRepository.searchAll(),
			this.productRepository.searchAll(),
		]);

		const timesBoughtTogether = orders
			.filter((order) => order.containsProduct(productId))
			.flatMap((order) => [
				...new Set(order.lines.map((line) => line.productId)),
			])
			.filter((otherProductId) => otherProductId !== productId)
			.reduce(
				(counts, otherProductId) =>
					counts.set(
						otherProductId,
						(counts.get(otherProductId) ?? 0) + 1,
					),
				new Map<string, number>(),
			);

		return [...timesBoughtTogether]
			.sort(
				([firstId, firstCount], [secondId, secondCount]) =>
					secondCount - firstCount || firstId.localeCompare(secondId),
			)
			.flatMap(([otherProductId]) =>
				products.filter(
					(product) => product.id.value === otherProductId,
				),
			)
			.slice(0, maxProducts)
			.map(toProductResponse);
	}
}
