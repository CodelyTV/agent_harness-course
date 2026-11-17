import type { EmailSender } from "@/contexts/backend/shared/domain/email/EmailSender";
import { UserId } from "@/contexts/backend/users/domain/UserId";
import type { UserRepository } from "@/contexts/backend/users/domain/UserRepository";

import { OrderId } from "../../domain/OrderId";
import type { OrderRepository } from "../../domain/OrderRepository";

import { orderConfirmationEmail } from "./OrderConfirmationEmail";

export class OrderConfirmationEmailSender {
	constructor(
		private readonly orderRepository: OrderRepository,
		private readonly userRepository: UserRepository,
		private readonly emailSender: EmailSender,
	) {}

	async send(orderId: string): Promise<void> {
		const order = await this.orderRepository.search(new OrderId(orderId));
		const customer = order
			? await this.userRepository.search(new UserId(order.userId))
			: null;

		if (!order || !customer) {
			return;
		}

		await this.emailSender.send(
			orderConfirmationEmail({
				to: customer.email,
				customerName: customer.name,
				orderId: order.id.value,
				items: order.items(),
				totalAmount: order.subtotal.amount,
				currency: order.subtotal.currency,
			}),
		);
	}
}
