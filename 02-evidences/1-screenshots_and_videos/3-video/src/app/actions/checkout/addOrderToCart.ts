"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { retailContainer } from "@/contexts/backend/shared/infrastructure/RetailContainer";

export async function addOrderToCart(formData: FormData): Promise<void> {
	const orderId = formData.get("orderId");

	if (typeof orderId !== "string" || orderId.length === 0) {
		throw new Error("orderId is required");
	}

	await retailContainer.cartOrderAdder.add(orderId);
	revalidatePath("/", "layout");
	revalidatePath("/checkout");
	redirect("/checkout");
}
