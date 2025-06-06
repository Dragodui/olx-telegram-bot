import { config } from "dotenv";
config();
import { db } from "./src/DB";
import { bot } from "./src/TelegramBot";
import { wait } from "./src/utils";
import logger from "./src/logger";
import { createBrowser } from "./src/Browser";
import type Browser from "./src/Browser";

// TODO: Change ChangeUrl funtion to check if the url is valid(by selectors)
async function main(browser: Browser) {
	logger.info("Checking for new items...");
	const newestItem = await browser.getNewestItem();
	if (newestItem) {
		logger.info("New item found:", newestItem);
		await db.insertLastItem(newestItem);
		await bot.sendOlxItem(newestItem);
	}
	logger.info("Waiting 1 hour till next check");
	await wait(60 * 60 * 1000); // 1 hour
}

(async () => {
	await db.initialize();
	const browser = await createBrowser();
	await browser.initialize();
	await bot.launch();
	while (true) {
		try {
			await main(browser);
		} catch (error) {
			logger.error("Error in main loop:", error);
			await wait(1000 * 60); // Wait 1 second before retrying
		}
	}
})();
