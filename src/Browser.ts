import { connect } from "puppeteer-real-browser";
import { db } from "./DB";
import { config } from "dotenv";
import logger from "./logger";
//types
import type { PageWithCursor } from "puppeteer-real-browser";
import type { OlxItem } from "./types";

config();

class Browser {
	url = "";
	page: PageWithCursor | null = null;
	// biome-ignore lint/suspicious/noExplicitAny: Private Browser type in library
	browser: any | null = null;
	lastItem: OlxItem | null = null;

	constructor(olxUrl: string) {
		this.url = olxUrl;
	}

	async initialize() {
		await db.insertCurrentLink(this.url);
		const { page, browser } = await connect({
			headless: true,

			args: [
				"--disable-background-networking",
				"--enable-features=NetworkService,NetworkServiceInProcess",
				"--disable-background-timer-throttling",
				"--disable-backgrounding-occluded-windows",
				"--disable-breakpad",
				"--disable-client-side-phishing-detection",
				"--disable-default-apps",
				"--disable-dev-shm-usage",
				"--disable-extensions",
				"--disable-features=TranslateUI",
				"--disable-hang-monitor",
				"--disable-ipc-flooding-protection",
				"--disable-popup-blocking",
				"--disable-prompt-on-repost",
				"--disable-renderer-backgrounding",
				"--disable-sync",
				"--force-color-profile=srgb",
				"--metrics-recording-only",
				"--no-first-run",
				"--password-store=basic",
				"--use-mock-keychain",
				"--no-sandbox",
				"--lang=pl-PL",
			],

			customConfig: {},

			turnstile: true,

			connectOption: {},

			disableXvfb: false,
			ignoreAllFlags: false,
		});

		this.page = page;
		this.browser = browser;
		logger.info("Browser initialized");
	}

	async parseOlxData() {
		this.url = await db.getCurrentLink();
		await this.page?.goto(this.url, {
			waitUntil: "domcontentloaded",
		});

		const PRODUCT_SELECTOR = ".css-l9drzq";
		await this.page?.waitForSelector(PRODUCT_SELECTOR, { timeout: 60_000 });
		const productElements = await this.page?.$$(PRODUCT_SELECTOR);
		const productData: OlxItem[] = [];
		if (!productElements || productElements.length === 0) {
			logger.warn("No products found on the page.");
			return productData;
		}
		for (const productElement of productElements) {
			const title = await productElement.$eval(
				".css-1g61gc2",
				(el) => (el as HTMLDivElement).innerText,
			);
			const price = await productElement.$eval(
				".css-uj7mm0",
				(el) => (el as HTMLDivElement).innerText,
			);
			const link = await productElement.$eval(".css-1tqlkj0", (el) => (el as HTMLLinkElement).href);
			const image = await productElement.$eval("img", (el) => el.src);
			const date = await productElement.$eval(
				".css-vbz67q",
				(el) => (el as HTMLDivElement).innerText,
			);

			productData.push({ title, price, link, image, date });
		}

		return productData;
	}

	async getNewestItem() {
		this.lastItem = await db.getLastItem();
		this.url = await db.getCurrentLink();
		if (!this.page) {
			throw new Error("Page is not initialized");
		}
		await this.page.goto(this.url, {
			waitUntil: "domcontentloaded",
		});
		const PRODUCT_SELECTOR = ".css-l9drzq";
		const productElements = await this.page.$$(PRODUCT_SELECTOR);
		if (!productElements || productElements.length === 0) {
			logger.warn("No products found on the page.");
			return null;
		}
		const newestProduct = productElements[0];
		const title = await newestProduct.$eval(
			".css-1g61gc2",
			(el) => (el as HTMLDivElement).innerText,
		);
		const price = await newestProduct.$eval(
			".css-uj7mm0",
			(el) => (el as HTMLDivElement).innerText,
		);
		const link = await newestProduct.$eval(".css-1tqlkj0", (el) => (el as  HTMLLinkElement).href);
		const image = await newestProduct.$eval("img", (el) => el.src);
		const date = await newestProduct.$eval(".css-vbz67q", (el) => (el as HTMLDivElement).innerText);

		const productData = { title, price, link, image, date };
		logger.info("Product data:", productData);

		if (this.lastItem === null || productData.title !== this.lastItem.title) {
			this.lastItem = productData;
			return this.lastItem;
		}

		return null;
	}
}
export default Browser;
export const createBrowser = async () => {
	const link = (await db.getCurrentLink()) || process.env.OLX_URL;
	return new Browser(link);
};
