import { config } from "dotenv";
config();
import { browser } from "./src/Browser.js";
import { db } from "./src/DB.js";
import { bot } from "./src/TelegramBot.js";
import { wait } from "./src/utils.js";
import logger from "./src/logger.js";

async function main() {
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
	await browser.initialize();
	await bot.launch();
	while (true) {
		try {
			await main();
		} catch (error) {
			logger.error("Error in main loop:", error);
			await wait(1000*60); // Wait 1 second before retrying
		}
	}
})();
