import postgres from "postgres";

export const sql = postgres(
	process.env.DATABASE_URL ??
		"postgres://retail:retail@localhost:55432/retail",
);
