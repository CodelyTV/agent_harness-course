import type { EventBus } from "@/contexts/shared/domain/event/EventBus";

import { ProductReviewFinder } from "../../domain/ProductReviewFinder";
import type { ProductReviewRepository } from "../../domain/ProductReviewRepository";
import type { ProductReviewSpamDetector } from "../../domain/ProductReviewSpamDetector";

const trustedAuthorPublishedReviews = 3;

export class ProductReviewValidator {
	private readonly finder: ProductReviewFinder;

	constructor(
		private readonly repository: ProductReviewRepository,
		private readonly spamDetector: ProductReviewSpamDetector,
		private readonly eventBus: EventBus,
	) {
		this.finder = new ProductReviewFinder(repository);
	}

	async validate(id: string): Promise<void> {
		const review = await this.finder.find(id);

		if (!review.isPendingValidation()) {
			return;
		}

		const isSpam =
			!(await this.isTrustedAuthor(review.userId)) &&
			(await this.spamDetector.isSpam(review));

		if (isSpam) {
			review.markAsSpam();
		} else {
			review.publish();
		}

		await this.repository.save(review);
		await this.eventBus.publish(review.pullDomainEvents());
	}

	private async isTrustedAuthor(userId: string): Promise<boolean> {
		const publishedReviews =
			await this.repository.countPublishedByUser(userId);

		return publishedReviews >= trustedAuthorPublishedReviews;
	}
}
