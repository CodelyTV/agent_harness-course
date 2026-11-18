import { ProductService } from "@/services/ProductService";

export async function GET(): Promise<Response> {
	return Response.json(await ProductService.all());
}
