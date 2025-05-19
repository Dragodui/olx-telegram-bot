# OLX Item Notifier Bot

A Node.js-based Telegram bot that monitors OLX listings and notifies you of new items automatically every hour.

## Features

* Monitors a specified OLX URL for new listings
* Sends new items to your Telegram chat (with image, price, and link)
* Supports Telegram commands:

  * `/changeUrl <url>` — change the OLX URL being monitored
  * `/getUrl` — get the current monitored URL
* Stores last seen item and current URL in SQLite

## Tech Stack

* Node.js + ES Modules
* Puppeteer (via `puppeteer-real-browser`) for scraping
* SQLite for storage
* Telegraf for Telegram bot
* Winston for logging

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourname/olx-notifier-bot.git
   cd olx-notifier-bot
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   ```env
   BOT_TOKEN=your_telegram_bot_token
   CHAT_ID=your_telegram_chat_id
   OLX_URL=https://www.olx.pl/...
   ```

4. **Run the bot:**

   ```bash
   node index.js
   ```

## Notes

* The bot checks for new listings every hour.
* Make sure the OLX URL is valid and points to a listing page.
* Telegram commands must be sent from the chat specified by `CHAT_ID`.

