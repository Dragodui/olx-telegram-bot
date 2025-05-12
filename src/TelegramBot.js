import { config } from "dotenv";
import { Telegraf } from "telegraf";
import { db } from "./DB.js";
import logger from "./logger.js";
config();
class TelegramBot {
	constructor(token, chatId) {
		this.token = token;
		this.chatId = chatId;
		this.bot = new Telegraf(token);
		this.setupCommands();
	}

	async launch() {
		try {
			this.bot.launch().then(() => logger.info("Bot launched"));;
		} catch (error) {
			logger.error("Error launching bot:", error);
		}
	}

	setupCommands() {
		this.bot.command("changeUrl", async (ctx) => {
			logger.info("Change URL command received:", ctx.message.text);
			const newUrl = ctx.message.text.split(" ")[1];
			if (newUrl) {
				try {
					await db.insertCurrentLink(newUrl);
					await ctx.reply(`URL changed to: ${newUrl}`);
				} catch (err) {
					logger.error("Failed to change URL:", err);
					await ctx.reply("Failed to change URL.");
				}
			} else {
				await ctx.reply("Please provide a new URL. Example: /changeUrl https://olx.pl/...");
			}
		});

		this.bot.command("getUrl", async (ctx) => {
			logger.info("Get URL command received");
			try {
				
			const currentLink  = await db.getCurrentLink();
			if (currentLink) {
				await ctx.reply(`Current URL: ${currentLink}`);
			} else {
				await ctx.reply("No URL found. Please set a URL first using /changeUrl.");
			}
			} catch (error) {
				logger.error("Error getting URL:", error);
			}

		});
	}

	async sendOlxItem(itemData) {
		try {
			const { title, price, link, image, date } = itemData;
		const message = `${title} \n${price} \n${link} \n${date}`;
		if (image) {
			await this.bot.telegram.sendPhoto(this.chatId, image, {
				caption: message,
			});
		} else {
			await this.bot.telegram.sendMessage(this.chatId, message);
		}
		} catch (error) {
		logger.error("Error sending message:", error);	
		}
	}

	async sendMultipleOlxItems(items) {
		for (const item of items) {
			await this.sendOlxItem(item);
		}
	}
}
logger.info("Bot token:", process.env.BOT_TOKEN);
logger.info("Chat ID:", process.env.CHAT_ID);
export const bot = new TelegramBot(
	process.env.BOT_TOKEN,
	Number(process.env.CHAT_ID),
);
