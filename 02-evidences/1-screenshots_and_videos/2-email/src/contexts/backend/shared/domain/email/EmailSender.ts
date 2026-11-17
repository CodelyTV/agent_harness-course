import type { Email } from "./Email";

export abstract class EmailSender {
	abstract send(email: Email): Promise<void>;
}
