import { sql } from "@/lib/db";
import type { User } from "@/models/User";

export class UserService {
	static async byId(id: string): Promise<User> {
		const rows = await sql<User[]>`
			select id, name, email from users where id = ${id}
		`;

		if (rows.length === 0) {
			throw new Error(`User ${id} not found`);
		}

		return rows[0];
	}
}
