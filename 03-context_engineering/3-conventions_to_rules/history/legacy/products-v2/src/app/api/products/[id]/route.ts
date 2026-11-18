import { ProductService } from "@/services/ProductService";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ id: string }> },
): Promise<Response> {
	const { id } = await params;

	return Response.json(await ProductService.byId(id));
}
