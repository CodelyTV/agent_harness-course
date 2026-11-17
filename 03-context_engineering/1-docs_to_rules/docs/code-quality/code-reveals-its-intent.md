# 🔍 Code reveals its intent

## 💡 Convention

Code tells what it does and why in the language of the business, not how it does it.

- Name classes, methods and variables after the business concept they represent, not after their technical implementation.
- When a condition expresses a business decision, give it a name: a method of the entity or a well-named variable.
- A reader must understand a use case from its names, without reading the implementation of each call.

## 🏆 Benefits

- Reviewers and agents understand a change from the names, without following every call.
- Business rules live in one named place, so a change in the rule touches one method.
- The code and the conversations of the team use the same words.

## 👀 Examples

### ✅ Good: The entity names the business decision

```typescript
if (!variant.hasStock()) {
	throw new VariantOutOfStockError(variantId);
}

const published = reviews.filter((review) => review.isPublished());
```

### ❌ Bad: The use case repeats how the decision is made

```typescript
if (variant.onlineStock <= 0) {
	throw new VariantOutOfStockError(variantId);
}

const list = reviews.filter((r) => r.status.value === "published");
```

## 🧐 Real world examples

- [`ProductVariant`](../../src/contexts/backend/products/domain/ProductVariant.ts) names its stock decisions with `hasStock()` and `isLowStock()`.
- [`ProductReviewValidator`](../../src/contexts/backend/reviews/application/validate/ProductReviewValidator.ts) reads as the business rule: `review.isPendingValidation()`, `review.markAsSpam()`, `review.publish()`.

## 🔗 Related agreements

- [Domain and application do not read the system time](../architecture/domain-and-application-do-not-read-the-system-time.md)

Doc created by 🐢 💨 (Turbotuga™, [Codely](https://codely.com)’s mascot)
