export type OrderLinePrimitives = {
	productId: string;
	variantId: string;
	quantity: number;
	unitPriceAmount: number;
};

export class OrderLine {
	constructor(
		readonly productId: string,
		readonly variantId: string,
		readonly quantity: number,
		readonly unitPriceAmount: number,
	) {
		if (quantity <= 0) {
			throw new Error(
				`Order line quantity must be positive, got ${quantity}`,
			);
		}
	}

	static fromPrimitives(primitives: OrderLinePrimitives): OrderLine {
		return new OrderLine(
			primitives.productId,
			primitives.variantId,
			primitives.quantity,
			primitives.unitPriceAmount,
		);
	}

	lineTotal(): number {
		return this.unitPriceAmount * this.quantity;
	}

	toPrimitives(): OrderLinePrimitives {
		return {
			productId: this.productId,
			variantId: this.variantId,
			quantity: this.quantity,
			unitPriceAmount: this.unitPriceAmount,
		};
	}
}
