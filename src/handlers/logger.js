import chalk from "chalk";
import "dotenv/config";

class logger {
    async server(message) {
        console.log(`${chalk.gray(`[${new Date().toISOString()}]`)} ${chalk.green("[SERVER]")} ${message}`);
    }

    async debug(message) {
        if (process.env.DEBUG == "true") {
            console.log(process.env.DEBUG)
            console.log(`${chalk.gray(`[${new Date().toISOString()}]`)} ${chalk.blue("[DEBUG]")} ${message}`);
        }
    }

    async warn(message) {
        console.log(`${chalk.gray(`[${new Date().toISOString()}]`)} ${chalk.yellow("[WARN]")} ${message}`);
    }

    async error(message) {
        console.log(`${chalk.gray(`[${new Date().toISOString()}]`)} ${chalk.red("[ERROR]")} ${message}`);
    }
}

export default new logger();
