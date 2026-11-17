import type { Email } from "@/contexts/backend/shared/domain/email/Email";

export type OrderConfirmationEmailParams = {
	to: string;
	customerName: string;
	orderId: string;
	items: number;
	totalAmount: number;
	currency: string;
};

const template = `<!doctype html>
<html lang="en">
	<body style="margin: 0; padding: 32px 16px; background: #f4f3ee; font-family: Helvetica, Arial, sans-serif; color: #1c2230;">
		<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
			<tr>
				<td align="center">
					<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; background: #ffffff; border-radius: 16px; padding: 32px;">
						<tr>
							<td>
								<p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 2px; color: #6b7280;">CODELY ATELIER</p>
								<h1 style="margin: 0 0 16px; font-size: 24px;">Thanks for your order</h1>
								<p style="margin: 0 0 16px; font-size: 16px; line-height: 1.5;">Hi {{customerName}}, we received your order <strong>{{orderId}}</strong>. We will send its {{items}} items to your home.</p>
								<p style="margin: 0; font-size: 18px; font-weight: bold;">Total: {{total}}</p>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</body>
</html>
`;

function render(values: Record<string, string>): string {
	return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
		String(values[key]),
	);
}

export function orderConfirmationEmail(
	params: OrderConfirmationEmailParams,
): Email {
	return {
		to: params.to,
		subject: `Your order ${params.orderId} is confirmed`,
		html: render({
			customerName: params.customerName,
			orderId: params.orderId,
			items: String(params.items),
			total: new Intl.NumberFormat("en-GB", {
				style: "currency",
				currency: params.currency,
			}).format(params.totalAmount),
		}),
	};
}
