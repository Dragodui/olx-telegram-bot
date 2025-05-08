import { browser } from "./src/Browser.js";
import { bot } from "./src/TelegramBot.js";

async function main() {
    const newestItem = await browser.getNewestItem();
    if (newestItem) {
        console.log("New item found:", newestItem);
        await bot.sendOlxItem(newestItem);
    }
    await new Promise((resolve) => setTimeout(resolve, 60_000*60)); // 1 hour 
} 

(async () => {
	await browser.initialize();
    await bot.launch();
	// await browser.parseOlxData();
    // const currentItems = await browser.parseOlxData();
    // await bot.sendMultipleOlxItems(currentItems);
    while (true) {
        try {
            await main();
        } catch (error) {
            console.error("Error in main loop:", error);
        }
    }
})();
