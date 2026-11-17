import { expect, it } from "vitest";

import { PostgresProductRepository } from "@/contexts/backend/products/infrastructure/PostgresProductRepository";
import { PostgresConnection } from "@/contexts/backend/shared/infrastructure/PostgresConnection";

import { describeWithEnvironmentArranger } from "../../shared/infrastructure/describeWithEnvironmentArranger";
import { RetailEnvironmentArranger } from "../../shared/infrastructure/RetailEnvironmentArranger";
import { ProductMother } from "../domain/ProductMother";

const connection = new PostgresConnection();
const arranger = new RetailEnvironmentArranger(connection);
const repository = new PostgresProductRepository(connection);

describeWithEnvironmentArranger(
	arranger,
	"PostgresProductRepository should",
	() => {
		it("save a product and read it back", async () => {
			const product = ProductMother.create();

			await repository.save(product);

			expect(
				(await repository.search(product.id))?.toPrimitives(),
			).toEqual(product.toPrimitives());
		});

		it("search only the products matching a query", async () => {
			const hoodie = ProductMother.create({ name: "Aggregate Hoodie" });
			const tee = ProductMother.create({ name: "Domain Event Tee" });
			const trousers = ProductMother.create({
				name: "Bounded Context Trousers",
			});
			await repository.save(hoodie);
			await repository.save(tee);
			await repository.save(trousers);

			const matching = await repository.searchMatching("hoodie");

			expect(matching.map((product) => product.toPrimitives())).toEqual([
				hoodie.toPrimitives(),
			]);
		});
	},
);
