import { describe, expect, it } from "vitest";

import { orderConfirmationEmail } from "@/contexts/backend/orders/application/send-confirmation-email/OrderConfirmationEmail";
import { OrderConfirmationEmailSender } from "@/contexts/backend/orders/application/send-confirmation-email/OrderConfirmationEmailSender";
import { SendConfirmationEmailOnOrderPlaced } from "@/contexts/backend/orders/application/send-confirmation-email/SendConfirmationEmailOnOrderPlaced";
import { Order } from "@/contexts/backend/orders/domain/Order";
import { OrderPlacedDomainEvent } from "@/contexts/backend/orders/domain/OrderPlacedDomainEvent";
import type { OrderRepository } from "@/contexts/backend/orders/domain/OrderRepository";
import type { EmailSender } from "@/contexts/backend/shared/domain/email/EmailSender";
import { User } from "@/contexts/backend/users/domain/User";
import type { UserRepository } from "@/contexts/backend/users/domain/UserRepository";

import { Mock } from "../../../../shared/Mock";

describe("SendConfirmationEmailOnOrderPlaced should", () => {
	const orderRepository = Mock.create<OrderRepository>();
	const userRepository = Mock.create<UserRepository>();
	const emailSender = Mock.create<EmailSender>();
	const subscriber = new SendConfirmationEmailOnOrderPlaced(
		new OrderConfirmationEmailSender(
			orderRepository,
			userRepository,
			emailSender,
		),
	);

	it("send a confirmation email to the customer of the placed order", async () => {
		const order = Order.fromPrimitives({
			id: "order-0001",
			userId: "user-jane",
			createdAt: new Date().toISOString(),
			deliveryMethod: "home-delivery",
			status: "confirmed",
			subtotal: { amount: 128, currency: "EUR" },
			lines: [
				{
					productId: "p1",
					variantId: "v1",
					quantity: 2,
					unitPriceAmount: 39,
				},
				{
					productId: "p2",
					variantId: "v2",
					quantity: 1,
					unitPriceAmount: 50,
				},
			],
		});
		orderRepository.searchShouldReturn(order);
		userRepository.searchShouldReturn(
			User.fromPrimitives({
				id: "user-jane",
				name: "Jane Doe",
				email: "jane.doe@codely.com",
			}),
		);

		await subscriber.on(
			new OrderPlacedDomainEvent("order-0001", "user-jane"),
		);

		emailSender.expectSendToHaveBeenCalledWith(
			orderConfirmationEmail({
				to: "jane.doe@codely.com",
				customerName: "Jane Doe",
				orderId: "order-0001",
				items: 3,
				totalAmount: 128,
				currency: "EUR",
			}),
		);
	});
});

describe("orderConfirmationEmail should", () => {
	it("show the order, its items and its total", () => {
		const email = orderConfirmationEmail({
			to: "jane.doe@codely.com",
			customerName: "Jane Doe",
			orderId: "order-0001",
			items: 3,
			totalAmount: 128,
			currency: "EUR",
		});

		expect(email.subject).toBe("Your order order-0001 is confirmed");
		expect(email.html).toContain("Hi Jane Doe");
		expect(email.html).toContain("We will send 3 items to your home");
		expect(email.html).toContain("Total: €128.00");
	});

	it("use the singular for an order with one item", () => {
		const email = orderConfirmationEmail({
			to: "jane.doe@codely.com",
			customerName: "Jane Doe",
			orderId: "order-0001",
			items: 1,
			totalAmount: 39,
			currency: "EUR",
		});

		expect(email.html).toContain("We will send 1 item to your home");
	});
});
