import { DomainEvent } from "@/contexts/shared/domain/event/DomainEvent";

export type OrderPlacedDomainEventPrimitives = {
	id: string;
	userId: string;
};

export class OrderPlacedDomainEvent extends DomainEvent {
	static readonly eventName = "codely.retail.order.placed";

	constructor(
		readonly id: string,
		readonly userId: string,
		eventId?: string,
		occurredOn?: string,
	) {
		super(OrderPlacedDomainEvent.eventName, id, eventId, occurredOn);
	}

	toPrimitives(): OrderPlacedDomainEventPrimitives {
		return {
			id: this.id,
			userId: this.userId,
		};
	}
}
