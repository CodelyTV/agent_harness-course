import { ProductId } from "@/contexts/backend/products/domain/ProductId";
import type { ProductRepository } from "@/contexts/backend/products/domain/ProductRepository";
import type { EmailSender } from "@/contexts/backend/shared/domain/email/EmailSender";
import { UserId } from "@/contexts/backend/users/domain/UserId";
import type { UserRepository } from "@/contexts/backend/users/domain/UserRepository";

import { ProductReviewFinder } from "../../domain/ProductReviewFinder";
import type { ProductReviewRepository } from "../../domain/ProductReviewRepository";

import { productReviewThanksEmail } from "./ProductReviewThanksEmail";

export class ProductReviewThanksEmailSender {
	private readonly finder: ProductReviewFinder;

	constructor(
		repository: ProductReviewRepository,
		private readonly userRepository: UserRepository,
		private readonly productRepository: ProductRepository,
		private readonly emailSender: EmailSender,
	) {
		this.finder = new ProductReviewFinder(repository);
	}

	async send(reviewId: string): Promise<void> {
		const review = await this.finder.find(reviewId);
		const [user, product] = await Promise.all([
			this.userRepository.search(new UserId(review.userId)),
			this.productRepository.search(new ProductId(review.productId)),
		]);

		if (!user || !product) {
			return;
		}

		await this.emailSender.send(
			productReviewThanksEmail({
				to: user.email,
				customerName: user.name,
				productName: product.name,
				rating: review.rating.value,
			}),
		);
	}
}
