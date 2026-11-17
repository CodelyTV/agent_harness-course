import type { Email } from "@/contexts/backend/shared/domain/email/Email";

export type ProductReviewThanksEmailParams = {
	to: string;
	customerName: string;
	productName: string;
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
								<h1 style="margin: 0 0 16px; font-size: 24px;">Thanks for your review</h1>
								<p style="margin: 0; font-size: 16px; line-height: 1.5;">Hi {{customerName}}, your review of <strong>{{productName}}</strong> is now published. It helps other customers pick the right fit.</p>
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

export function productReviewThanksEmail(
	params: ProductReviewThanksEmailParams,
): Email {
	return {
		to: params.to,
		subject: `Thanks for reviewing ${params.productName}`,
		html: render({
			customerName: params.customerName,
			productName: params.productName,
		}),
	};
}
