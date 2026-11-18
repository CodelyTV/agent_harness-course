import { execFileSync } from "node:child_process";
import {
	cpSync,
	existsSync,
	mkdirSync,
	readdirSync,
	rmSync,
	statSync,
	symlinkSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceDir = dirname(fileURLToPath(import.meta.url));
const finalDir = join(sourceDir, "..", "before");
const legacyDir = join(sourceDir, "legacy");

const authors = {
	laura: ["Laura Méndez", "laura.mendez@example.com"],
	marc: ["Marc Puig", "marc.puig@example.com"],
	irene: ["Irene Sanz", "irene.sanz@example.com"],
	dani: ["Dani Ortega", "dani.ortega@example.com"],
	nora: ["Nora Vidal", "nora.vidal@example.com"],
};

const ds = "src/contexts/frontend/design-system/";
const sections = "src/contexts/frontend/retail/sections/";
const products = "src/contexts/backend/products/";
const orders = "src/contexts/backend/orders/";
const users = "src/contexts/backend/users/";
const checkout = "src/contexts/backend/checkout/";
const reviews = "src/contexts/backend/reviews/";
const sharedDomain = "src/contexts/shared/domain/";
const sharedInfra = "src/contexts/backend/shared/infrastructure/";

const timeline = [
	{
		date: "2021-03-08T10:12:00+01:00",
		author: "laura",
		message: "chore: bootstrap Next.js project",
		add: [
			".gitignore",
			"package.json",
			"package-lock.json",
			"tsconfig.json",
			"next.config.ts",
			"global.d.ts",
			"eslint.config.mjs",
			"Makefile",
			"src/app/layout.tsx",
			"src/app/layout.module.scss",
			"src/app/app.scss",
			"src/app/icon.svg",
			"src/app/error.tsx",
			"src/app/loading.tsx",
			"src/app/not-found.tsx",
			"src/app/status.module.scss",
		],
	},
	{
		date: "2021-03-10T17:40:00+01:00",
		author: "laura",
		message: "chore: run PostgreSQL with Docker Compose",
		add: ["compose.yml", "scripts/wait-for-db.mjs", "database/schema.sql"],
	},
	{
		date: "2021-03-15T09:25:00+01:00",
		author: "laura",
		message: "feat: connect to the database",
		add: ["src/lib/db.ts"],
	},
	{
		date: "2021-03-22T12:03:00+01:00",
		author: "laura",
		message: "feat: list the products of the catalog",
		legacy: ["products-v1"],
	},
	{
		date: "2021-04-05T16:18:00+02:00",
		author: "marc",
		message: "feat(design-system): add settings, tools and generic styles",
		add: [
			`${ds}settings/`,
			`${ds}tools/`,
			`${ds}generic/`,
			`${ds}index.scss`,
		],
	},
	{
		date: "2021-04-19T11:47:00+02:00",
		author: "marc",
		message: "feat(design-system): add the Moderat fonts",
		add: ["public/fonts/"],
	},
	{
		date: "2021-05-03T15:30:00+02:00",
		author: "marc",
		message: "feat(design-system): add atoms",
		add: [`${ds}atoms/`, `${ds}shared/`],
	},
	{
		date: "2021-05-24T10:05:00+02:00",
		author: "laura",
		message: "feat: get a product by id",
		legacy: ["products-v2"],
	},
	{
		date: "2021-06-14T18:22:00+02:00",
		author: "marc",
		message: "feat(design-system): add icons",
		add: [`${ds}icons/`],
	},
	{
		date: "2021-07-05T09:58:00+02:00",
		author: "laura",
		message: "feat: add products to the cart",
		legacy: ["cart"],
	},
	{
		date: "2021-09-13T13:14:00+02:00",
		author: "marc",
		message: "feat: place orders",
		legacy: ["orders"],
	},
	{
		date: "2021-10-18T17:02:00+02:00",
		author: "marc",
		message: "feat(design-system): add molecules and objects",
		add: [`${ds}molecules/`, `${ds}objects/`],
	},
	{
		date: "2021-11-22T12:36:00+01:00",
		author: "laura",
		message: "chore: seed the catalog",
		add: ["database/seed.sql"],
	},
	{
		date: "2022-02-14T10:41:00+01:00",
		author: "laura",
		message: "feat: get users by id",
		legacy: ["users"],
	},
	{
		date: "2022-04-11T16:09:00+02:00",
		author: "marc",
		message: "feat: subscribe to the newsletter",
		legacy: ["newsletter-v1"],
	},
	{
		date: "2022-07-04T11:27:00+02:00",
		author: "laura",
		message: "feat: add products to the wishlist",
		add: [
			"src/models/WishlistItem.ts",
			"src/services/WishlistService.ts",
			"src/app/api/wishlist/route.ts",
		],
	},
	{
		date: "2022-09-19T09:33:00+02:00",
		author: "marc",
		message: "feat: unsubscribe from the newsletter",
		add: [
			"src/models/NewsletterSubscription.ts",
			"src/services/NewsletterService.ts",
			"src/app/api/newsletter/route.ts",
		],
	},
	{
		date: "2022-12-12T15:55:00+01:00",
		author: "laura",
		message: "feat: add product photos",
		add: ["public/products/"],
	},
	{
		date: "2023-01-30T10:00:00+01:00",
		author: "irene",
		message: "refactor: introduce onion architecture",
		body: [
			"Business logic moves from src/services to src/contexts/backend/<context>,",
			"split in domain, application and infrastructure layers. Use cases",
			"depend on repository ports and RetailContainer wires the Postgres",
			"adapters.",
			"",
			"src/services and src/models are legacy: new features go to",
			"src/contexts, and we migrate the existing services one context at a time.",
		],
		add: [
			`${sharedDomain}Money.ts`,
			`${sharedDomain}value-object/`,
			`${sharedInfra}PostgresConnection.ts`,
			`${sharedInfra}PostgresRepository.ts`,
			`${sharedInfra}RetailContainer.ts`,
			"vitest.config.ts",
			"tests/setupTests.ts",
			"tests/shared/Mock.ts",
		],
	},
	{
		date: "2023-02-06T14:20:00+01:00",
		author: "irene",
		message: "test: add integration tests with a real database",
		add: [
			"vitest.integration.config.ts",
			"tests/backend/shared/infrastructure/RetailEnvironmentArranger.ts",
			"tests/backend/shared/infrastructure/describeWithEnvironmentArranger.ts",
		],
	},
	{
		date: "2023-03-06T11:11:00+01:00",
		author: "irene",
		message: "refactor(products): migrate products to onion architecture",
		body: [
			"ProductService and the /api/products endpoints become the",
			"ProductsSearcher and ProductFinder use cases over a ProductRepository",
			"port. The catalog pages call them through RetailContainer.",
		],
		add: [
			`${products}domain/`,
			`${products}infrastructure/`,
			`${products}application/ProductResponse.ts`,
			`${products}application/find/`,
			`${products}application/search/`,
			"src/app/page.tsx",
			"src/app/page.module.scss",
			"src/app/products/[id]/page.tsx",
			"src/app/products/[id]/page.module.scss",
			"src/app/products/[id]/ProductPurchasePanel.tsx",
			"src/app/products/[id]/ProductPurchasePanel.module.scss",
			`${sections}ProductCard.tsx`,
			`${sections}ProductCard.module.scss`,
			`${sections}ProductVisual.tsx`,
			`${sections}ProductVisual.module.scss`,
			`${sections}PageHeader.tsx`,
			`${sections}PageHeader.module.scss`,
			`${sections}MainNav.tsx`,
			`${sections}MainNav.module.scss`,
			`${sections}Footer.tsx`,
			`${sections}Footer.module.scss`,
			"src/contexts/frontend/retail/ui/format.ts",
		],
		remove: [
			"src/models/Product.ts",
			"src/services/ProductService.ts",
			"src/app/api/products/",
		],
	},
	{
		date: "2023-03-13T09:47:00+01:00",
		author: "irene",
		message: "test(products): cover the catalog use cases",
		add: [
			"tests/backend/products/domain/",
			"tests/backend/products/application/find/",
			"tests/backend/products/application/search/",
			"tests/backend/products/infrastructure/",
			"tests/frontend/retail/ui/",
		],
	},
	{
		date: "2023-05-15T16:30:00+02:00",
		author: "irene",
		message: "refactor(users): migrate users to onion architecture",
		add: [
			`${users}domain/`,
			`${users}infrastructure/`,
		],
		remove: ["src/models/User.ts", "src/services/UserService.ts"],
	},
	{
		date: "2023-06-26T10:52:00+02:00",
		author: "marc",
		message: "refactor(orders): migrate orders to onion architecture",
		body: [
			"OrderService and /api/orders become the OrderPlacer, UserOrdersLister",
			"and OrderFinder use cases. The Order aggregate computes its subtotal.",
		],
		add: [
			`${orders}domain/`,
			`${orders}infrastructure/`,
			`${orders}application/find/`,
			`${orders}application/list-mine/`,
			`${orders}application/place/`,
			`${sharedDomain}Clock.ts`,
			`${sharedInfra}SystemClock.ts`,
			"tests/backend/orders/application/place/",
			"src/app/account/",
			"src/contexts/frontend/retail/ui/orderTable.module.scss",
			`${sections}DataTable.tsx`,
			`${sections}DataTable.module.scss`,
		],
		remove: [
			"src/models/Order.ts",
			"src/services/OrderService.ts",
			"src/app/api/orders/",
		],
	},
	{
		date: "2023-07-03T12:15:00+02:00",
		author: "marc",
		message: "test(orders): cover the order repository",
		add: ["tests/backend/orders/infrastructure/"],
	},
	{
		date: "2023-09-18T11:38:00+02:00",
		author: "irene",
		message: "refactor(checkout): migrate the cart to onion architecture",
		body: [
			"CartService and /api/cart become the checkout context. The product",
			"pages add and remove variants through server actions.",
		],
		add: [
			`${checkout}domain/Checkout.ts`,
			`${checkout}domain/CheckoutId.ts`,
			`${checkout}domain/CheckoutLine.ts`,
			`${checkout}domain/CheckoutRepository.ts`,
			`${checkout}infrastructure/`,
			`${checkout}application/confirm/`,
			`${checkout}application/count/`,
			`${checkout}application/remove/`,
			`${checkout}application/view/`,
			"src/app/checkout/",
			"src/app/actions/checkout/",
			`${sections}CartLink.tsx`,
			`${sections}CartLink.module.scss`,
			"tests/backend/checkout/application/confirm/",
		],
		legacy: ["checkout-v1"],
		remove: [
			"src/models/Cart.ts",
			"src/services/CartService.ts",
			"src/app/api/cart/",
		],
	},
	{
		date: "2024-02-12T10:24:00+01:00",
		author: "dani",
		message: "refactor(checkout): throw domain errors instead of generic Error",
		body: [
			"A generic Error only carries a message, so the actions could not tell",
			"a missing variant from an out of stock one. Domain errors extend",
			"CodelyError and live in the domain/errors folder of their context.",
		],
		add: [
			`${sharedDomain}CodelyError.ts`,
			`${checkout}domain/errors/`,
			`${checkout}application/add/`,
			"tests/backend/checkout/application/add/",
		],
	},
	{
		date: "2024-04-08T15:03:00+02:00",
		author: "dani",
		message: "feat(admin): add the admin dashboard",
		add: [
			"src/app/admin/page.tsx",
			"src/app/admin/page.module.scss",
			"src/app/admin/layout.tsx",
			"src/app/admin/layout.module.scss",
			"src/app/admin/AdminNav.tsx",
			"src/app/admin/AdminNav.module.scss",
			"src/app/actions/admin/",
			"src/contexts/frontend/retail/application/dashboard/",
			`${sections}MetricCard.tsx`,
			`${sections}MetricCard.module.scss`,
			`${sections}AdminLink.tsx`,
			`${sections}AdminLink.module.scss`,
			`${products}application/low-stock/`,
		],
	},
	{
		date: "2024-04-15T09:12:00+02:00",
		author: "dani",
		message: "test(products): cover the low stock list",
		add: ["tests/backend/products/application/low-stock/"],
	},
	{
		date: "2024-05-20T17:45:00+02:00",
		author: "dani",
		message: "feat(admin): list the inventory",
		add: [`${products}application/inventory/`, "src/app/admin/inventory/"],
	},
	{
		date: "2024-06-24T11:58:00+02:00",
		author: "irene",
		message: "feat(admin): list every order",
		add: [`${orders}application/list/`, "src/app/admin/orders/"],
	},
	{
		date: "2024-07-15T13:26:00+02:00",
		author: "dani",
		message: "feat: list the product categories",
		add: [`${products}application/categories/`],
	},
	{
		date: "2024-09-30T10:37:00+02:00",
		author: "irene",
		message: "feat: publish domain events through an in-memory event bus",
		add: [
			`${sharedDomain}AggregateRoot.ts`,
			`${sharedDomain}event/`,
			`${sharedInfra}event-bus/`,
			"tests/backend/shared/infrastructure/event-bus/",
		],
	},
	{
		date: "2025-01-20T10:08:00+01:00",
		author: "nora",
		message: "feat(reviews): model product reviews",
		add: [
			`${reviews}domain/ProductReview.ts`,
			`${reviews}domain/ProductReviewId.ts`,
			`${reviews}domain/ProductReviewRating.ts`,
			`${reviews}domain/ProductReviewComment.ts`,
			`${reviews}domain/ProductReviewImage.ts`,
			`${reviews}domain/ProductReviewStatus.ts`,
			`${reviews}domain/ProductReviewRepository.ts`,
			`${reviews}domain/errors/InvalidProductReviewRatingError.ts`,
			`${reviews}domain/errors/ProductReviewCommentTooLongError.ts`,
			`${reviews}domain/errors/ProductReviewImageTooLargeError.ts`,
			`${reviews}domain/errors/UnsupportedProductReviewImageTypeError.ts`,
			"tests/backend/reviews/domain/",
		],
	},
	{
		date: "2025-02-10T15:49:00+01:00",
		author: "nora",
		message: "feat(reviews): create a product review",
		add: [
			`${reviews}application/create/`,
			`${reviews}domain/ProductReviewCreatedDomainEvent.ts`,
			`${reviews}domain/errors/ProductNotPurchasedError.ts`,
			`${reviews}infrastructure/PostgresProductReviewRepository.ts`,
			"src/app/actions/reviews/",
			"src/app/products/[id]/ProductReviewForm.tsx",
		],
	},
	{
		date: "2025-02-17T11:21:00+01:00",
		author: "nora",
		message: "test(reviews): cover review creation",
		add: [
			"tests/backend/reviews/application/create/",
			"tests/backend/reviews/infrastructure/PostgresProductReviewRepository.spec.ts",
		],
	},
	{
		date: "2025-03-17T09:55:00+01:00",
		author: "nora",
		message: "feat(reviews): validate new reviews against spam",
		add: [
			`${reviews}application/validate/`,
			`${reviews}domain/ProductReviewSpamDetector.ts`,
			`${reviews}domain/ProductReviewFinder.ts`,
			`${reviews}domain/ProductReviewPublishedDomainEvent.ts`,
			`${reviews}domain/errors/ProductReviewDoesNotExistError.ts`,
			`${reviews}domain/errors/ProductReviewNotPendingValidationError.ts`,
			`${reviews}infrastructure/RuleBasedProductReviewSpamDetector.ts`,
			"tests/backend/reviews/application/validate/",
			"tests/backend/reviews/infrastructure/RuleBasedProductReviewSpamDetector.spec.ts",
		],
	},
	{
		date: "2025-04-28T14:33:00+02:00",
		author: "nora",
		message: "feat(reviews): show the published reviews of a product",
		add: [
			`${reviews}application/search-all/`,
			"src/app/products/[id]/ProductReviews.tsx",
			"src/app/products/[id]/ProductReviews.module.scss",
			"tests/backend/reviews/application/search-all/",
		],
	},
	{
		date: "2025-06-09T12:02:00+02:00",
		author: "dani",
		message: "chore: add scripts to link agent instructions",
		add: ["etc/scripts/"],
	},
	{
		date: "2025-09-22T10:44:00+02:00",
		author: "dani",
		message: "feat: add the user menu",
		add: [`${sections}UserMenu.tsx`, `${sections}UserMenu.module.scss`],
	},
	{
		date: "2026-05-11T16:27:00+02:00",
		author: "nora",
		message: "feat(users): show the current user in the menu",
		add: [
			`${users}application/current/`,
			`${sections}UserMenuTrigger.tsx`,
		],
	},
	{
		date: "2026-08-31T09:30:00+02:00",
		author: "irene",
		message: "docs: add AGENTS.md",
		add: ["AGENTS.md"],
	},
	{
		date: "2026-10-26T11:15:00+01:00",
		author: "dani",
		message: "chore: install the deterministify skill",
		add: [".agents/", "skills-lock.json"],
		symlinks: {
			".claude/skills/deterministify": "../../.agents/skills/deterministify",
		},
	},
];

function listFiles(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);

		return statSync(path).isDirectory() ? listFiles(path) : [path];
	});
}

const ignored = [/^node_modules\//, /^\.next\//, /\.tsbuildinfo$/, /^next-env\.d\.ts$/];
const finalFiles = listFiles(finalDir)
	.map((path) => relative(finalDir, path))
	.filter((path) => !ignored.some((pattern) => pattern.test(path)));

function matches(path, entry) {
	return entry.endsWith("/") ? path.startsWith(entry) : path === entry;
}

const target = resolve(process.argv[2] ?? "");

if (!process.argv[2]) {
	console.error("Usage: node build-history.mjs <target directory>");
	process.exit(1);
}

if (existsSync(target) && readdirSync(target).length > 0) {
	console.error(`${target} already exists and is not empty`);
	process.exit(1);
}

mkdirSync(target, { recursive: true });

function git(args, env = {}) {
	return execFileSync("git", args, {
		cwd: target,
		env: { ...process.env, ...env },
		stdio: ["ignore", "pipe", "inherit"],
	}).toString();
}

git(["init", "--quiet", "--initial-branch=main"]);

const added = new Set();

for (const step of timeline) {
	for (const entry of step.remove ?? []) {
		rmSync(join(target, entry), { recursive: true, force: true });
	}

	for (const label of step.legacy ?? []) {
		cpSync(join(legacyDir, label), target, { recursive: true });
	}

	for (const entry of step.add ?? []) {
		const files = finalFiles.filter((path) => matches(path, entry));

		if (files.length === 0) {
			throw new Error(`"${entry}" matches no file of the final tree`);
		}

		for (const file of files) {
			if (added.has(file)) {
				throw new Error(`${file} is added twice`);
			}

			added.add(file);
			mkdirSync(dirname(join(target, file)), { recursive: true });
			cpSync(join(finalDir, file), join(target, file));
		}
	}

	for (const [path, pointsTo] of Object.entries(step.symlinks ?? {})) {
		mkdirSync(dirname(join(target, path)), { recursive: true });
		symlinkSync(pointsTo, join(target, path));
		git(["add", "--force", path]);
	}

	const [name, email] = authors[step.author];
	const message = [step.message, ...(step.body ? ["", ...step.body] : [])].join(
		"\n",
	);

	git(["add", "--all"]);
	git(
		["-c", "commit.gpgsign=false", "commit", "--quiet", "--message", message],
		{
			GIT_AUTHOR_NAME: name,
			GIT_AUTHOR_EMAIL: email,
			GIT_AUTHOR_DATE: step.date,
			GIT_COMMITTER_NAME: name,
			GIT_COMMITTER_EMAIL: email,
			GIT_COMMITTER_DATE: step.date,
		},
	);
}

const missing = finalFiles.filter((file) => !added.has(file));

if (missing.length > 0) {
	throw new Error(`Files never added:\n${missing.join("\n")}`);
}

const leftovers = git(["ls-files"])
	.trim()
	.split("\n")
	.filter((file) => !finalFiles.includes(file))
	.filter((file) => !timeline.some((step) => file in (step.symlinks ?? {})));

if (leftovers.length > 0) {
	throw new Error(`Files that should be gone:\n${leftovers.join("\n")}`);
}

console.log(
	`Created ${target} with ${timeline.length} commits from ${timeline[0].date.slice(0, 10)} to ${timeline.at(-1).date.slice(0, 10)}`,
);
