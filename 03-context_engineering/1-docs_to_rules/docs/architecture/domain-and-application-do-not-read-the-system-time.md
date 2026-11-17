# 🕰️ Domain and application do not read the system time

## 💡 Convention

Domain and application code (`src/contexts/**/domain/` and `src/contexts/**/application/`) never read the system time: no `new Date()` without arguments and no `Date.now()`.

They receive the current time from the `Clock` port (`src/contexts/shared/domain/Clock.ts`). Only `SystemClock`, in infrastructure, reads the system time.

Creating a date from a known value, such as `new Date(order.createdAt)`, is fine.

## 🏆 Benefits

- Tests control the time with a fake `Clock` and do not depend on when they run.
- Use cases stay deterministic: the same input gives the same output.
- One place decides how the app reads the time, so changing it (time zone, precision) touches one file.

## 👀 Examples

### ✅ Good: The use case receives the time from the `Clock` port

```typescript
export class ProductReviewCreator {
	constructor(
		private readonly repository: ProductReviewRepository,
		private readonly clock: Clock,
		private readonly eventBus: EventBus,
	) {}

	async create(id: string, productId: string, userId: string, rating: number): Promise<void> {
		const review = ProductReview.create(id, productId, userId, rating, this.clock.now());

		await this.repository.save(review);
	}
}
```

### ❌ Bad: The use case reads the system time

```typescript
export class OrderPlacer {
	async place(userId: string, lines: PlaceOrderLine[]): Promise<string> {
		const order = Order.place(id, userId, new Date().toISOString(), lines);

		await this.repository.save(order);

		return order.id.value;
	}
}
```

## 🧐 Real world examples

- [`ProductReviewCreator`](../../src/contexts/backend/reviews/application/create/ProductReviewCreator.ts) gets the creation date with `this.clock.now()`.
- [`SystemClock`](../../src/contexts/backend/shared/infrastructure/SystemClock.ts) is the only place that reads the system time.

## 🔗 Related agreements

- [`Clock` port](../../src/contexts/shared/domain/Clock.ts)

Doc created by 🐢 💨 (Turbotuga™, [Codely](https://codely.com)’s mascot)
