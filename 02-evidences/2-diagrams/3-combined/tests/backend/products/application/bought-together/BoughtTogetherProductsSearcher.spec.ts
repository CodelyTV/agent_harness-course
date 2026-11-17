import { describe, expect, it } from "vitest";

import { Order } from "@/contexts/backend/orders/domain/Order";
import type { OrderRepository } from "@/contexts/backend/orders/domain/OrderRepository";
import { BoughtTogetherProductsSearcher } from "@/contexts/backend/products/application/bought-together/BoughtTogetherProductsSearcher";
import { toProductResponse } from "@/contexts/backend/products/application/ProductResponse";
import type { ProductRepository } from "@/contexts/backend/products/domain/ProductRepository";

import { Mock } from "../../../../shared/Mock";
import { ProductMother } from "../../domain/ProductMother";

function orderWith(id: string, productIds: string[]): Order {
	return Order.fromPrimitives({
		id,
		userId: "user-aibuilder",
		createdAt: new Date().toISOString(),
		deliveryMethod: "home-delivery",
		status: "confirmed",
		subtotal: { amount: 0, currency: "EUR" },
		lines: productIds.map((productId) => ({
			productId,
			variantId: `${productId}-v1`,
			quantity: 1,
			unitPriceAmount: 0,
		})),
	});
}

describe("BoughtTogetherProductsSearcher should", () => {
	const orderRepository = Mock.create<OrderRepository>();
	const productRepository = Mock.create<ProductRepository>();
	const searcher = new BoughtTogetherProductsSearcher(
		orderRepository,
		productRepository,
	);

	it("return the products bought with a product, the most frequent first", async () => {
		const tee = ProductMother.create({ id: "tee" });
		const hoodie = ProductMother.create({ id: "hoodie" });
		const trousers = ProductMother.create({ id: "trousers" });
		const vest = ProductMother.create({ id: "vest" });
		orderRepository.searchAllShouldReturn([
			orderWith("order-1", ["tee", "hoodie"]),
			orderWith("order-2", ["tee", "trousers", "hoodie"]),
			orderWith("order-3", ["vest", "trousers"]),
		]);
		productRepository.searchAllShouldReturn([tee, hoodie, trousers, vest]);

		expect(await searcher.search("tee")).toEqual([
			toProductResponse(hoodie),
			toProductResponse(trousers),
		]);
	});

	it("return no products when nobody bought the product", async () => {
		orderRepository.searchAllShouldReturn([
			orderWith("order-1", ["vest", "trousers"]),
		]);
		productRepository.searchAllShouldReturn([
			ProductMother.create({ id: "tee" }),
		]);

		expect(await searcher.search("tee")).toEqual([]);
	});
});
