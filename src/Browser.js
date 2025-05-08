import { connect } from "puppeteer-real-browser";

class Browser {
	url = "";
	page = null;
	browser = null;
	lastItem = null;

	constructor(olxUrl) {
		this.url = olxUrl;
	}

	async initialize() {
		const { page, browser } = await connect({
			headless: false,

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
	}

	async parseOlxData() {
		await this.page.goto(this.url, {
			waitUntil: "domcontentloaded",
		});

		const PRODUCT_SELECTOR = ".css-l9drzq";
		await this.page.waitForSelector(PRODUCT_SELECTOR, { timeout: 60_000 });
		const productElements = await this.page.$$(PRODUCT_SELECTOR);
		const productData = [];
		for (const productElement of productElements) {
			const title = await productElement.$eval(
				".css-1g61gc2",
				(el) => el.innerText,
			);
			const price = await productElement.$eval(
				".css-uj7mm0",
				(el) => el.innerText,
			);
			const link = await productElement.$eval(".css-1tqlkj0", (el) => el.href);
			const image = await productElement.$eval("img", (el) => el.src);
			const date = await productElement.$eval(
				".css-vbz67q",
				(el) => el.innerText,
			);

			productData.push({ title, price, link, image, date });
		}

		return productData;
	}

	async getNewestItem() {
		const newestProduct = await this.page.$$(PRODUCT_SELECTOR)[0];
		const title = await newestProduct.$eval(
			".css-1g61gc2",
			(el) => el.innerText,
		);
		const price = await newestProduct.$eval(
			".css-uj7mm0",
			(el) => el.innerText,
		);
		const link = await newestProduct.$eval(".css-1tqlkj0", (el) => el.href);
		const image = await newestProduct.$eval("img", (el) => el.src);
		const date = await newestProduct.$eval(".css-vbz67q", (el) => el.innerText);

		const productData = { title, price, link, image, date };

		if (this.lastItem === null || productData.title !== this.lastItem.title) {
			this.lastItem = productData;
            return this.lastItem;
		}

		return null;
	}
}

const OLX_URL =
	"https://www.olx.pl/sport-hobby/rowery/rowery-gorskie/szczecin/?search%5Border%5D=created_at:desc&search%5Bfilter_float_price:to%5D=700&search%5Bfilter_enum_wheelsize%5D%5B0%5D=27-5&search%5Bfilter_enum_wheelsize%5D%5B1%5D=28&search%5Bfilter_enum_wheelsize%5D%5B2%5D=29&search%5Bfilter_enum_wheelsize%5D%5B3%5D=others";

export const browser = new Browser(OLX_URL);
