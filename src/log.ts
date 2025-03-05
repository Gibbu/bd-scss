import chalk from 'chalk';

export const log = {
	success: (message: (unknown | any)[]) => {
		console.log(`${chalk.greenBright.bold('[SUCCESS]')} ${message.join('\n')}`);
	},
	warning: (message: (unknown | any)[]) => {
		console.log(`${chalk.yellowBright.bold('[WARNING]')} ${message.join('\n')}`);
	},
	error: (message: (unknown | any)[]) => {
		console.log(`\n${chalk.redBright.bold('[ERROR]')} ${message.join('\n')}\n`);
		process.exit(1);
	},
	info: (message: (unknown | any)[], title?: string) => {
		console.log(`${chalk.blueBright.bold(`[${title || 'INFO'}]`)} ${message.join('\n')}`);
	},
	code: (message: unknown | any, char: string = '`') => {
		return chalk.yellow(`${char}` + message + `${char}`);
	}
};
