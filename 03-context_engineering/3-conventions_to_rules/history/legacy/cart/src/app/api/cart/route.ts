import { CartService } from "@/services/CartService";

export async function GET(request: Request): Promise<Response> {
	const userId = new URL(request.url).searchParams.get("userId") ?? "";

	return Response.json(await CartService.of(userId));
}

export async function POST(request: Request): Promise<Response> {
	const { userId, variantId } = (await request.json()) as {
		userId: string;
		variantId: string;
	};
	await CartService.add(userId, variantId);

	return new Response(null, { status: 201 });
}
