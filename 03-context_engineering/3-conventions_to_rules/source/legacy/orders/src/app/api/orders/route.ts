import type { OrderLine } from "@/models/Order";
import { OrderService } from "@/services/OrderService";

export async function GET(request: Request): Promise<Response> {
	const userId = new URL(request.url).searchParams.get("userId") ?? "";

	return Response.json(await OrderService.ofUser(userId));
}

export async function POST(request: Request): Promise<Response> {
	const { userId, lines } = (await request.json()) as {
		userId: string;
		lines: OrderLine[];
	};

	return Response.json(await OrderService.place(userId, lines), {
		status: 201,
	});
}
