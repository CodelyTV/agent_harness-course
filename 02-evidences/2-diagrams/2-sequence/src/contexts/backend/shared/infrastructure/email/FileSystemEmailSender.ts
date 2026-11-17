import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Email } from "../../domain/email/Email";
import { EmailSender } from "../../domain/email/EmailSender";

export class FileSystemEmailSender extends EmailSender {
	constructor(
		private readonly directory = path.join(process.cwd(), "emails"),
	) {
		super();
	}

	async send(email: Email): Promise<void> {
		await mkdir(this.directory, { recursive: true });

		await writeFile(
			path.join(this.directory, this.fileNameFor(email)),
			email.html,
		);
	}

	private fileNameFor(email: Email): string {
		const recipient = email.to.replace(/[^a-z0-9]+/gi, "_");

		return `${Date.now()}-${recipient}.html`;
	}
}
