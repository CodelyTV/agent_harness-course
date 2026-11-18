import { sql } from "@/lib/db";
import type { Product } from "@/models/Product";

type ProductRow = {
	id: string;
	name: string;
	category: string;
	price_amount: number;
	image_url: string;
};

function toProduct(row: ProductRow): Product {
	return {
		id: row.id,
		name: row.name,
		category: row.category,
		priceAmount: row.price_amount,
		imageUrl: row.image_url,
	};
}

export class ProductService {
	static async all(): Promise<Product[]> {
		const rows = await sql<ProductRow[]>`
			select id, name, category, price_amount, image_url
			from products
			order by name
		`;

		return rows.map(toProduct);
	}
}
