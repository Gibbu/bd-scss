import chalk from 'chalk';

export default {
	success: (message: unknown | any) => {
		console.log(chalk.bgGreenBright.black(' SUCCESS ') + ' ' + message);
	},
	warning: (message: unknown | any) => {
		console.log(chalk.yellow.black(' WARNING ') + ' ' + message);
	},
	error: (message: unknown | any) => {
		console.log(chalk.bgRed.black(' ERROR ') + ' ' + message);
		process.exit(1);
	},
	info: (message: unknown | any, title?: string) => {
		console.log(chalk.bgBlueBright.black(` ${title || 'INFO'} `) + ' ' + message);
	},
	code: (message: unknown | any) => {
		return chalk.yellow('`' + message + '`');
	},
};
