import express from "express";
import mongoose from "mongoose";
import {dirname} from "dirname-filename-esm";
import "dotenv/config";
import logger from "./handlers/logger.js";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
const __dirname = dirname(import.meta);
const app = express();
global.refreshTokens = [];
global.accessTokens = [];
global.clientTokens = [];
global.JWT_SECRET = randomUUID();
var debugMode = process.env.DEBUG === 'true' ? 'enabled' : 'disabled';
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, })
    .then(() => {
        logger.server("Connected to MongoDB");
    })
    .catch((error) => {
        logger.error(`Failed to connect to MongoDB: ${error.message}`);
    });
logger.server("Debug mode is " + debugMode);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
for (const fileName of fs.readdirSync(path.join(__dirname, "routes"))) {
    try {
        app.use((await import(`file://${__dirname}/routes/${fileName}`)).default);
        logger.debug("Imported route: " + fileName);
    } catch (error) {
         console.log(fileName, error)
    }
};

app.listen(process.env.PORT, () => {
    logger.server("Started server on PORT " + process.env.PORT);
});