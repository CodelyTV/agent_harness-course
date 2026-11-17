import type {
	OrderPlacer,
	PlaceOrderLine,
} from "@/contexts/backend/orders/application/place/OrderPlacer";
import type { Product } from "@/contexts/backend/products/domain/Product";
import { ProductId } from "@/contexts/backend/products/domain/ProductId";
import type { ProductRepository } from "@/contexts/backend/products/domain/ProductRepository";
import type { CurrentUserProvider } from "@/contexts/backend/users/domain/CurrentUserProvider";

import type { Checkout } from "../../domain/Checkout";
import { checkoutIdForUser } from "../../domain/CheckoutId";
import type { CheckoutRepository } from "../../domain/CheckoutRepository";
import { VariantOutOfStockError } from "../../domain/errors/VariantOutOfStockError";

export class CheckoutConfirmer {
	constructor(
		private readonly checkoutRepository: CheckoutRepository,
		private readonly productRepository: ProductRepository,
		private readonly orderPlacer: OrderPlacer,
		private readonly currentUserProvider: CurrentUserProvider,
	) {}

	async confirm(): Promise<string | null> {
		const userId = await this.currentUserProvider.currentUserId();
		const checkout = await this.checkoutRepository.search(
			checkoutIdForUser(userId),
		);

		if (!checkout || checkout.isEmpty()) {
			return null;
		}

		const products = await this.searchProductsOf(checkout);

		this.ensureStock(checkout, products);

		const lines: PlaceOrderLine[] = checkout.lines.flatMap((line) => {
			const product = products.get(line.productId);

			if (!product) {
				return [];
			}

			return [
				{
					productId: line.productId,
					variantId: line.variantId,
					quantity: line.quantity,
					unitPriceAmount: product.price.amount,
				},
			];
		});

		const orderId = await this.orderPlacer.place(
			userId.value,
			checkout.deliveryMethod,
			lines,
		);

		await this.decreaseStock(checkout, products);
		await this.checkoutRepository.save(checkout.clear());

		return orderId;
	}

	private async searchProductsOf(
		checkout: Checkout,
	): Promise<Map<string, Product>> {
		const productIds = [
			...new Set(checkout.lines.map((line) => line.productId)),
		];
		const products = await Promise.all(
			productIds.map((productId) =>
				this.productRepository.search(new ProductId(productId)),
			),
		);

		return new Map(
			products
				.filter((product): product is Product => product !== null)
				.map((product) => [product.id.value, product]),
		);
	}

	private ensureStock(
		checkout: Checkout,
		products: Map<string, Product>,
	): void {
		const lineWithoutStock = checkout.lines.find((line) => {
			const variant = products
				.get(line.productId)
				?.variant(line.variantId);

			return !variant?.hasStockFor(line.quantity);
		});

		if (lineWithoutStock) {
			throw new VariantOutOfStockError(lineWithoutStock.variantId);
		}
	}

	private async decreaseStock(
		checkout: Checkout,
		products: Map<string, Product>,
	): Promise<void> {
		const updated = checkout.lines.reduce((current, line) => {
			const product = current.get(line.productId);

			return product
				? new Map(current).set(
						line.productId,
						product.withStockDecreased(
							line.variantId,
							line.quantity,
						),
					)
				: current;
		}, products);

		await Promise.all(
			[...updated.values()].map((product) =>
				this.productRepository.save(product),
			),
		);
	}
}
