export type CartLine = {
	productId: string;
	variantId: string;
	quantity: number;
};

export type Cart = {
	userId: string;
	lines: CartLine[];
};
