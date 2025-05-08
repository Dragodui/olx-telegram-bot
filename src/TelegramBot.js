import { Telegraf } from "telegraf";
import { config } from "dotenv";

config();
class TelegramBot {
	constructor(token, chatId) {
		this.token = token;
        this.chatId = chatId;
		this.bot = new Telegraf(token);
	}

	async launch() {
		try {
            await bot.launch();
            console.log("Telegram bot launched");
        } catch (error) {
            console.error("Error launching bot:", error);
        }
			
	}
	async sendOlxItem( itemData) {
       const { title, price, link, image, date } = itemData
        const message = `${title} \n${price} \n${link} \n${date}`;
		if (image) {
            await this.bot.telegram.sendPhoto(this.chatId, image, {
				caption: message, 
			});
        } else {
            await this.bot.telegram.sendMessage(this.chatId, message);
        }
	}

    async sendMultipleOlxItems( items) {
        for (const item of items) {
            await this.sendOlxItem(item);
        }
    }
}
console.log("Bot token:", process.env.BOT_TOKEN);
console.log("Chat ID:", process.env.CHAT_ID);
export const bot = new TelegramBot(process.env.BOT_TOKEN, Number(process.env.CHAT_ID));
