import winston from "winston";

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
	const date = new Date(
		typeof timestamp === "string" || typeof timestamp === "number"
			? timestamp
			: Date.now(),
	);

	const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
		date.getMonth() + 1,
	).padStart(
		2,
		"0",
	)}.${date.getFullYear()} ${String(date.getHours()).padStart(2, "0")}:${String(
		date.getMinutes(),
	).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

	return `[${level.toUpperCase()}] ${formattedDate} - ${message}`;
});

const logger = winston.createLogger({
	level: "info",
	format: winston.format.combine(winston.format.timestamp(), customFormat),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "logs.log" }),
	],
});

export default logger;
