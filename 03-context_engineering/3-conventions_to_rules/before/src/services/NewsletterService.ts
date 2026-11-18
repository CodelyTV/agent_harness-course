import { sql } from "@/lib/db";
import type { NewsletterSubscription } from "@/models/NewsletterSubscription";

export class NewsletterService {
	static async subscribe(email: string): Promise<NewsletterSubscription> {
		if (!email.includes("@")) {
			throw new Error(`Invalid email: ${email}`);
		}

		const rows = await sql<{ email: string; subscribed_at: Date }[]>`
			insert into newsletter_subscriptions (email)
			values (${email})
			on conflict (email) do update set email = excluded.email
			returning email, subscribed_at
		`;

		return {
			email: rows[0].email,
			subscribedAt: rows[0].subscribed_at.toISOString(),
		};
	}

	static async unsubscribe(email: string): Promise<void> {
		await sql`delete from newsletter_subscriptions where email = ${email}`;
	}
}
