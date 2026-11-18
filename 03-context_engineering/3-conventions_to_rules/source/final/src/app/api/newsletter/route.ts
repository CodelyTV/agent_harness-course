import { NewsletterService } from "@/services/NewsletterService";

export async function POST(request: Request): Promise<Response> {
	const { email } = (await request.json()) as { email: string };
	const subscription = await NewsletterService.subscribe(email);

	return Response.json(subscription, { status: 201 });
}

export async function DELETE(request: Request): Promise<Response> {
	const { email } = (await request.json()) as { email: string };
	await NewsletterService.unsubscribe(email);

	return new Response(null, { status: 204 });
}
