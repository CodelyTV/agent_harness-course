export type OrderLine = {
	productId: string;
	variantId: string;
	quantity: number;
	unitPriceAmount: number;
};

export type Order = {
	id: string;
	userId: string;
	status: string;
	subtotalAmount: number;
	lines: OrderLine[];
};
