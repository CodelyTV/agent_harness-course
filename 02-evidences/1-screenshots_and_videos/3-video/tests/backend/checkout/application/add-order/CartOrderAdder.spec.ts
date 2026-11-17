import { beforeEach, describe, expect, it } from "vitest";

import { CartVariantAdder } from "@/contexts/backend/checkout/application/add/CartVariantAdder";
import { CartOrderAdder } from "@/contexts/backend/checkout/application/add-order/CartOrderAdder";
import { Checkout } from "@/contexts/backend/checkout/domain/Checkout";
import { checkoutIdForUser } from "@/contexts/backend/checkout/domain/CheckoutId";
import type { CheckoutRepository } from "@/contexts/backend/checkout/domain/CheckoutRepository";
import { OrderNotFoundError } from "@/contexts/backend/checkout/domain/errors/OrderNotFoundError";
import { Order } from "@/contexts/backend/orders/domain/Order";
import type { OrderRepository } from "@/contexts/backend/orders/domain/OrderRepository";
import type { ProductRepository } from "@/contexts/backend/products/domain/ProductRepository";
import type { CurrentUserProvider } from "@/contexts/backend/users/domain/CurrentUserProvider";
import { UserId } from "@/contexts/backend/users/domain/UserId";

import { Mock } from "../../../../shared/Mock";
import { ProductMother } from "../../../products/domain/ProductMother";
import { ProductVariantMother } from "../../../products/domain/ProductVariantMother";

describe("CartOrderAdder should", () => {
	const orderRepository = Mock.create<OrderRepository>();
	const checkoutRepository = Mock.create<CheckoutRepository>();
	const productRepository = Mock.create<ProductRepository>();
	const currentUserProvider = Mock.create<CurrentUserProvider>();
	const adder = new CartOrderAdder(
		orderRepository,
		new CartVariantAdder(
			checkoutRepository,
			productRepository,
			currentUserProvider,
		),
		currentUserProvider,
	);
	const userId = new UserId("user-aibuilder");
	const product = ProductMother.create({
		variants: [
			ProductVariantMother.createPrimitives({ id: "v1", onlineStock: 5 }),
		],
	});

	function orderOf(ownerId: string): Order {
		return Order.fromPrimitives({
			id: "order-0001",
			userId: ownerId,
			createdAt: new Date().toISOString(),
			deliveryMethod: "home-delivery",
			status: "confirmed",
			subtotal: { amount: 39, currency: "EUR" },
			lines: [
				{
					productId: product.id.value,
					variantId: "v1",
					quantity: 1,
					unitPriceAmount: 39,
				},
			],
		});
	}

	beforeEach(() => {
		currentUserProvider.currentUserIdShouldReturn(userId);
		productRepository.searchByVariantIdShouldReturn(product);
		checkoutRepository.searchShouldReturn(null);
	});

	it("add the lines of an order of the current user to the cart", async () => {
		orderRepository.searchShouldReturn(orderOf(userId.value));

		await adder.add("order-0001");

		checkoutRepository.expectSaveToHaveBeenCalledWith(
			Checkout.create(checkoutIdForUser(userId)).addVariant(
				product.id.value,
				"v1",
			),
		);
	});

	it("fail when the order belongs to another customer", async () => {
		orderRepository.searchShouldReturn(orderOf("user-another"));

		await expect(adder.add("order-0001")).rejects.toBeInstanceOf(
			OrderNotFoundError,
		);
		checkoutRepository.expectSaveNotToHaveBeenCalled();
	});
});
