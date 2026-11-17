import type { DomainEventClass } from "@/contexts/shared/domain/event/DomainEvent";
import type { DomainEventSubscriber } from "@/contexts/shared/domain/event/DomainEventSubscriber";

import { ProductReviewPublishedDomainEvent } from "../../domain/ProductReviewPublishedDomainEvent";

import type { ProductReviewThanksEmailSender } from "./ProductReviewThanksEmailSender";

export class SendThanksEmailOnProductReviewPublished implements DomainEventSubscriber<ProductReviewPublishedDomainEvent> {
	constructor(private readonly sender: ProductReviewThanksEmailSender) {}

	subscribedTo(): DomainEventClass[] {
		return [ProductReviewPublishedDomainEvent];
	}

	async on(event: ProductReviewPublishedDomainEvent): Promise<void> {
		await this.sender.send(event.aggregateId);
	}
}
