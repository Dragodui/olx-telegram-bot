import { Telegraf } from "telegraf";
import { config } from "dotenv";

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
			await bot.launch();
			console.log("Telegram bot launched");
		} catch (error) {
			console.error("Error launching bot:", error);
		}
	}

	setupCommands() {
		this.bot.command("changeUrl", async (ctx) => {
			const newUrl = ctx.message.text.split(" ")[1];
			if (newUrl) {
				try {
					await db.insertCurrentLink(newUrl);
					await ctx.reply(`URL changed to: ${newUrl}`);
				} catch (err) {
					console.error("Failed to change URL:", err);
					await ctx.reply("Failed to change URL.");
				}
			} else {
				await ctx.reply("⚠️ Please provide a new URL. Example: /changeUrl https://olx.pl/...");
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
		console.error("Error sending message:", error);	
		}
	}

	async sendMultipleOlxItems(items) {
		for (const item of items) {
			await this.sendOlxItem(item);
		}
	}
}
console.log("Bot token:", process.env.BOT_TOKEN);
console.log("Chat ID:", process.env.CHAT_ID);
export const bot = new TelegramBot(
	process.env.BOT_TOKEN,
	Number(process.env.CHAT_ID),
);
