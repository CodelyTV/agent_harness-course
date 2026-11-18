import eslintConfigNext from "@next/eslint-plugin-next";
import eslintConfigCodely from "eslint-config-codely";
import globals from "globals";

import { retailPlugin } from "./etc/eslint/plugin.mjs";

// Baseline: eslint-suppressions.json lists the code that broke a rule the day the rule arrived.
// It only shrinks: `eslint .` fails when an entry no longer occurs. Migrate a file, then run `npx eslint . --prune-suppressions`.

export default [
	...eslintConfigCodely.course,
	{
		files: ["**/**.ts"],
		rules: {
			"@typescript-eslint/explicit-function-return-type": "error",
			"@typescript-eslint/switch-exhaustiveness-check": "off",
		},
	},
	{
		...eslintConfigNext.configs.recommended,
		plugins: {
			"@next/next": eslintConfigNext,
		},
		settings: {
			react: {
				version: "detect",
			},
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
			},
		},
	},
	{
		files: ["**/*.tsx"],
		rules: {
			"import/no-unresolved": "off",
		},
	},
	{
		files: ["src/**", "tests/**"],
		rules: {
			"import/no-restricted-paths": [
				"error",
				{
					zones: [
						{
							target: ["./src", "./tests"],
							from: ["./src/services", "./src/models"],
							message:
								"src/services and src/models are legacy. Put the logic in a use case of src/contexts/backend/<context>/application and call it through RetailContainer. Convention: src/contexts/backend/products/application/find/ProductFinder.ts",
						},
					],
				},
			],
		},
	},
	{
		files: ["src/**", "tests/**"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							regex: "^(@/|(\\.\\./)+)lib/db$",
							message:
								"Do not query the database with the sql client of src/lib/db. Add a repository that extends PostgresRepository in the infrastructure folder of the context. Convention: src/contexts/backend/products/infrastructure/PostgresProductRepository.ts",
						},
					],
				},
			],
		},
	},
	{
		files: ["src/app/**/route.{js,ts,tsx}"],
		rules: {
			"no-restricted-syntax": [
				"error",
				{
					selector: "Program",
					message:
						"Do not add route handlers. Read data in a server component through RetailContainer and change it with a server action in src/app/actions. Convention: src/app/actions/checkout/addSelectedVariantToCart.ts",
				},
			],
		},
	},
	{
		files: ["src/contexts/**/*.{ts,tsx}"],
		rules: {
			"no-restricted-syntax": [
				"error",
				{
					selector:
						"ThrowStatement > :matches(NewExpression, CallExpression)[callee.name='Error']",
					message:
						"Throw a domain error: a class in the domain/errors folder of the context that extends CodelyError. Convention: src/contexts/backend/checkout/domain/errors/VariantNotFoundError.ts",
				},
			],
		},
	},
	{
		files: ["src/contexts/backend/**/*.ts", "src/contexts/shared/**/*.ts"],
		ignores: ["src/contexts/backend/shared/infrastructure/SystemClock.ts"],
		plugins: {
			retail: retailPlugin,
		},
		rules: {
			"retail/no-system-time": "error",
		},
	},
];
