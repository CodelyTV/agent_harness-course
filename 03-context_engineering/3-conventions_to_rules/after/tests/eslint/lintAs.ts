import { ESLint, type Linter } from "eslint";
import { existsSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const eslint = new ESLint({ cwd: process.cwd() });

function firstMissingAncestor(directory: string): string | null {
	let missing: string | null = null;
	let current = directory;

	while (!existsSync(current)) {
		missing = current;
		current = path.dirname(current);
	}

	return missing;
}

export async function lintAs(
	filePath: string,
	code: string,
): Promise<Linter.LintMessage[]> {
	const absolutePath = path.resolve(filePath);

	if (existsSync(absolutePath)) {
		throw new Error(
			`${filePath} already exists: pick a path that no real file uses`,
		);
	}

	const createdDirectory = firstMissingAncestor(path.dirname(absolutePath));

	await mkdir(path.dirname(absolutePath), { recursive: true });
	await writeFile(absolutePath, code);

	try {
		const [result] = await eslint.lintText(code, {
			filePath: absolutePath,
		});

		return result.messages;
	} finally {
		await rm(createdDirectory ?? absolutePath, {
			recursive: true,
			force: true,
		});
	}
}
