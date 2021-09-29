import chalk from "chalk";

export function log(...args: string[]): void {
    console.log(chalk.magenta(new Date(Date.now()).toLocaleString()), ...args);
}
