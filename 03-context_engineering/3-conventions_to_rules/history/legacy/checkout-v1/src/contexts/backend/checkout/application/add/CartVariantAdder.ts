import type { ProductRepository } from "@/contexts/backend/products/domain/ProductRepository";
import type { CurrentUserProvider } from "@/contexts/backend/users/domain/CurrentUserProvider";

import { Checkout } from "../../domain/Checkout";
import { checkoutIdForUser } from "../../domain/CheckoutId";
import type { CheckoutRepository } from "../../domain/CheckoutRepository";

export class CartVariantAdder {
	constructor(
		private readonly checkoutRepository: CheckoutRepository,
		private readonly productRepository: ProductRepository,
		private readonly currentUserProvider: CurrentUserProvider,
	) {}

	async add(variantId: string): Promise<void> {
		const product =
			await this.productRepository.searchByVariantId(variantId);
		const variant = product?.variant(variantId);

		if (!product || !variant) {
			throw new Error(`Variant ${variantId} not found`);
		}

		if (!variant.hasStock()) {
			throw new Error(`Variant ${variantId} is out of stock`);
		}

		const checkoutId = checkoutIdForUser(
			await this.currentUserProvider.currentUserId(),
		);
		const checkout =
			(await this.checkoutRepository.search(checkoutId)) ??
			Checkout.create(checkoutId);

		await this.checkoutRepository.save(
			checkout.addVariant(product.id.value, variantId),
		);
	}
}
