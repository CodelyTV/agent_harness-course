import type { DomainEventClass } from "@/contexts/shared/domain/event/DomainEvent";
import type { DomainEventSubscriber } from "@/contexts/shared/domain/event/DomainEventSubscriber";

import { OrderPlacedDomainEvent } from "../../domain/OrderPlacedDomainEvent";

import type { OrderConfirmationEmailSender } from "./OrderConfirmationEmailSender";

export class SendConfirmationEmailOnOrderPlaced implements DomainEventSubscriber<OrderPlacedDomainEvent> {
	constructor(private readonly sender: OrderConfirmationEmailSender) {}

	subscribedTo(): DomainEventClass[] {
		return [OrderPlacedDomainEvent];
	}

	async on(event: OrderPlacedDomainEvent): Promise<void> {
		await this.sender.send(event.aggregateId);
	}
}
