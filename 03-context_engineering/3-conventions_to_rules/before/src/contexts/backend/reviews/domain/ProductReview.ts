import { AggregateRoot } from "@/contexts/shared/domain/AggregateRoot";

import { ProductReviewNotPendingValidationError } from "./errors/ProductReviewNotPendingValidationError";
import { ProductReviewComment } from "./ProductReviewComment";
import { ProductReviewCreatedDomainEvent } from "./ProductReviewCreatedDomainEvent";
import { ProductReviewId } from "./ProductReviewId";
import {
	ProductReviewImage,
	type ProductReviewImagePrimitives,
} from "./ProductReviewImage";
import { ProductReviewPublishedDomainEvent } from "./ProductReviewPublishedDomainEvent";
import { ProductReviewRating } from "./ProductReviewRating";
import {
	ProductReviewStatus,
	type ProductReviewStatusValue,
} from "./ProductReviewStatus";

export type ProductReviewPrimitives = {
	id: string;
	productId: string;
	userId: string;
	rating: number;
	comment: string | null;
	image: ProductReviewImagePrimitives | null;
	status: ProductReviewStatusValue;
	createdAt: string;
};

export class ProductReview extends AggregateRoot {
	constructor(
		readonly id: ProductReviewId,
		readonly productId: string,
		readonly userId: string,
		readonly rating: ProductReviewRating,
		readonly comment: ProductReviewComment,
		readonly image: ProductReviewImage | null,
		private reviewStatus: ProductReviewStatus,
		readonly createdAt: string,
	) {
		super();
	}

	static create(
		id: string,
		productId: string,
		userId: string,
		rating: number,
		comment: string | null,
		image: ProductReviewImagePrimitives | null,
		createdAt: string,
	): ProductReview {
		const review = new ProductReview(
			new ProductReviewId(id),
			productId,
			userId,
			new ProductReviewRating(rating),
			new ProductReviewComment(comment),
			image ? ProductReviewImage.fromPrimitives(image) : null,
			ProductReviewStatus.pendingValidation(),
			createdAt,
		);

		review.record(
			new ProductReviewCreatedDomainEvent(
				review.id.value,
				review.productId,
				review.userId,
				review.rating.value,
				review.comment.value,
			),
		);

		return review;
	}

	static fromPrimitives(primitives: ProductReviewPrimitives): ProductReview {
		return new ProductReview(
			new ProductReviewId(primitives.id),
			primitives.productId,
			primitives.userId,
			new ProductReviewRating(primitives.rating),
			new ProductReviewComment(primitives.comment),
			primitives.image
				? ProductReviewImage.fromPrimitives(primitives.image)
				: null,
			ProductReviewStatus.fromPrimitives(primitives.status),
			primitives.createdAt,
		);
	}

	get status(): ProductReviewStatus {
		return this.reviewStatus;
	}

	isPendingValidation(): boolean {
		return this.reviewStatus.isPendingValidation();
	}

	isPublished(): boolean {
		return this.reviewStatus.isPublished();
	}

	publish(): void {
		this.changeReviewStatusTo(ProductReviewStatus.published());

		this.record(new ProductReviewPublishedDomainEvent(this.id.value));
	}

	markAsSpam(): void {
		this.changeReviewStatusTo(ProductReviewStatus.spam());
	}

	toPrimitives(): ProductReviewPrimitives {
		return {
			id: this.id.value,
			productId: this.productId,
			userId: this.userId,
			rating: this.rating.value,
			comment: this.comment.value,
			image: this.image?.toPrimitives() ?? null,
			status: this.reviewStatus.value,
			createdAt: this.createdAt,
		};
	}

	private changeReviewStatusTo(status: ProductReviewStatus): void {
		this.ensureIsPendingValidation();

		this.reviewStatus = status;
	}

	private ensureIsPendingValidation(): void {
		if (!this.isPendingValidation()) {
			throw new ProductReviewNotPendingValidationError(this.id.value);
		}
	}
}
