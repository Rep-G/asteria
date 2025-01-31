import express from "express";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import error from "../handlers/error.js";
import logger from "../handlers/logger.js";
const app = express.Router();

async function decodeBase64(encodedString) {
    const decodedString = Buffer.from(encodedString, 'base64').toString('utf-8');
    return decodedString;
}

async function DateAddHours(date, hours) {
    date.setHours(date.getHours() + hours);
    return date;
}

app.post("/account/api/oauth/token", async (req, res) => {
    try {
        let authorization = [];
        if (!req.headers["authorization"] || !req.headers["authorization"].startsWith("Basic ")) {
            return error.createError(
                "errors.com.epicgames.common.oauth.invalid_client",
                "It appears that your Authorization header may be invalid or not present, please verify that you are sending the correct headers.",
                [], 1011, "invalid_client", 400, res
            );
        };
        const base64Auth = req.headers["authorization"].split(" ")[1];
        authorization = decodeBase64(base64Auth).split(":");
        logger.debug(req.body);
        // logger.debug(`Decoded authorization: ${authorization}`);
        if (!authorization[1])  return error.createError(
            "errors.com.epicgames.common.oauth.invalid_client",
            "It appears that your Authorization header may be invalid or not present, please verify that you are sending the correct headers.",
            [], 1011, "invalid_client", 400, res
        );
        if (!req.body.grant_type || !req.headers["authorization"])  return error.createError(
            "errors.com.epicgames.common.oauth.invalid_client",
            "It appears that your Authorization header may be invalid or not present, please verify that you are sending the correct headers.",
            [], 1011, "invalid_client", 400, res
        );
        switch (req.body.grant_type) {
            case "client_credentials":
                let clientToken = global.clientTokens.findIndex((i) => i.ip == req.ip);
                if (clientToken != -1) global.clientTokens.splice(clientToken, 1);
                let access_token = jwt.sign({
                    "p": Buffer.from(randomUUID()).toString("base64"),
                    "clsvc": "fortnite",
                    "t": "s",
                    "mver": false,
                    "clid": authorization,
                    "ic": true,
                    "am": req.body.grant_type,
                    "jti": randomUUID().replace(/-/ig, ""),
                    "creation_date": new Date(),
                    "hours_expire": 4
                }, global.JWT_SECRET, { expiresIn: 4 });
                const decodedClient = jwt.decode(access_token);

                res.json({
                    access_token: `eg1~${access_token}`,
                    expires_in: Math.round(((await DateAddHours(new Date(decodedClient.creation_date), decodedClient.hours_expire).getTime()) - (new Date().getTime())) / 1000),
                    expires_at: await DateAddHours(new Date(decodedClient.creation_date), decodedClient.hours_expire).toISOString(),
                    token_type: "bearer",
                    client_id: authorization,
                    internal_client: true,
                    client_service: "fortnite"
                });
                return;
        }
    }
    catch(err) {
        logger.error(err.message)
        return error.createError(
            "errors.com.epicgames.common.oauth.invalid_request",
            "An error occurred while processing your request.",
            [], 1012, err.message, 500, res
        );
    }
});

export default app;