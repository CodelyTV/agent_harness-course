import { WishlistService } from "@/services/WishlistService";

export async function GET(request: Request): Promise<Response> {
	const userId = new URL(request.url).searchParams.get("userId") ?? "";

	return Response.json(await WishlistService.itemsOf(userId));
}

export async function POST(request: Request): Promise<Response> {
	const { userId, productId } = (await request.json()) as {
		userId: string;
		productId: string;
	};
	await WishlistService.add(userId, productId);

	return new Response(null, { status: 201 });
}
