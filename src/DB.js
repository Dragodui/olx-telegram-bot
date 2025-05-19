import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { browser } from "./Browser.js";
import logger from "./logger.js";

class DB {
	constructor() {
		this.db = null;
	}

	async initialize() {
		this.db = await open({
			filename: "./db.sqlite",
			driver: sqlite3.Database,
		});

		await this.db.exec(`
            CREATE TABLE IF NOT EXISTS lastItem (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                price TEXT,
                link TEXT,
                image TEXT,
                date TEXT
            )
        `);

		this.db.exec(`
            CREATE TABLE IF NOT EXISTS currentLink (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT
            )`);
		logger.info("Database initialized");
	}

	async insertLastItem(item) {
		await this.db.run("DELETE FROM lastItem");
		await this.db.run(
			`
            INSERT INTO lastItem (title, price, link, image, date)
            VALUES (?, ?, ?, ?, ?)
        `,
			[item.title, item.price, item.link, item.image, item.date],
		);
	}

	async insertCurrentLink(url) {
		await this.db.run("DELETE FROM currentLink");
		await this.db.run(
			`
            INSERT INTO currentLink (url)
            VALUES (?)
        `, [url]);
    }

	async getCurrentLink() {
		const result = await this.db.get("SELECT url FROM currentLink LIMIT 1");
		return result ? result.url : null;
	}

	async getAllItems() {
		return await this.db.all("SELECT * FROM items");
	}

	async getLastItem() {
		const result = await this.db.get(
			"SELECT * FROM lastItem ORDER BY id DESC LIMIT 1",
		);
		return result
			? {
					title: result.title,
					price: result.price,
					link: result.link,
					image: result.image,
					date: result.date,
				}
			: null;
	}
}

export const db = new DB();
