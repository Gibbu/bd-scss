import c from 'kleur';

const getMessage = (message: any | any[]) => {
	if (typeof message === 'string') return message;
	else if (Array.isArray(message)) return message.join('\n');
	else return message;
};

export const log = {
	success: (message: any | any[]) => {
		console.log(`${c.green().bold('[SUCCESS]')} ${getMessage(message)}`);
	},
	warning: (message: any | any[]) => {
		console.log(`${c.yellow().bold('[WARNING]')} ${getMessage(message)}`);
	},
	error: (message: any | any[]) => {
		console.log(`\n${c.red().bold('[ERROR]')} ${getMessage(message)}\n`);
		process.exit(1);
	},
	info: (message: any | any[], title?: string) => {
		console.log(`${c.blue().bold(`[${title || 'INFO'}]`)} ${getMessage(message)}`);
	},
	code: (message: string, char: string = '`') => {
		return c.yellow(`${char}` + message + `${char}`);
	},
	comment: (message: string) => {
		return c.grey(message);
	}
};
