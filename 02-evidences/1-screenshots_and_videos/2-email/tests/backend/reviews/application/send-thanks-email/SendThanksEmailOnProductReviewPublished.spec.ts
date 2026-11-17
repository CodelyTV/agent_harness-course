import { describe, expect, it } from "vitest";

import type { ProductRepository } from "@/contexts/backend/products/domain/ProductRepository";
import { productReviewThanksEmail } from "@/contexts/backend/reviews/application/send-thanks-email/ProductReviewThanksEmail";
import { ProductReviewThanksEmailSender } from "@/contexts/backend/reviews/application/send-thanks-email/ProductReviewThanksEmailSender";
import { SendThanksEmailOnProductReviewPublished } from "@/contexts/backend/reviews/application/send-thanks-email/SendThanksEmailOnProductReviewPublished";
import { ProductReviewPublishedDomainEvent } from "@/contexts/backend/reviews/domain/ProductReviewPublishedDomainEvent";
import type { ProductReviewRepository } from "@/contexts/backend/reviews/domain/ProductReviewRepository";
import type { EmailSender } from "@/contexts/backend/shared/domain/email/EmailSender";
import { User } from "@/contexts/backend/users/domain/User";
import type { UserRepository } from "@/contexts/backend/users/domain/UserRepository";

import { Mock } from "../../../../shared/Mock";
import { ProductMother } from "../../../products/domain/ProductMother";
import { ProductReviewMother } from "../../domain/ProductReviewMother";

describe("SendThanksEmailOnProductReviewPublished should", () => {
	const repository = Mock.create<ProductReviewRepository>();
	const userRepository = Mock.create<UserRepository>();
	const productRepository = Mock.create<ProductRepository>();
	const emailSender = Mock.create<EmailSender>();
	const subscriber = new SendThanksEmailOnProductReviewPublished(
		new ProductReviewThanksEmailSender(
			repository,
			userRepository,
			productRepository,
			emailSender,
		),
	);

	it("send a thanks email to the author of the published review", async () => {
		const review = ProductReviewMother.create({ status: "published" });
		const user = User.fromPrimitives({
			id: review.userId,
			name: "Jane Doe",
			email: "jane.doe@codely.com",
		});
		const product = ProductMother.create({ id: review.productId });
		repository.searchShouldReturn(review);
		userRepository.searchShouldReturn(user);
		productRepository.searchShouldReturn(product);

		await subscriber.on(
			new ProductReviewPublishedDomainEvent(review.id.value),
		);

		emailSender.expectSendToHaveBeenCalledWith(
			productReviewThanksEmail({
				to: "jane.doe@codely.com",
				customerName: "Jane Doe",
				productName: product.name,
				rating: review.rating.value,
			}),
		);
	});
});

describe("productReviewThanksEmail should", () => {
	it("greet the customer and name the reviewed product", () => {
		const email = productReviewThanksEmail({
			to: "jane.doe@codely.com",
			customerName: "Jane Doe",
			productName: "Hexagonal Overshirt",
			rating: 4,
		});

		expect(email.subject).toBe("Thanks for reviewing Hexagonal Overshirt");
		expect(email.html).toContain("Hi Jane Doe");
		expect(email.html).toContain("Hexagonal Overshirt");
	});
});
