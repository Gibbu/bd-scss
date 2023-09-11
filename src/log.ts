import c from 'kleur';

const getMessage = (message: string | string[]) => {
	if (typeof message === 'string') return message;
	else if (Array.isArray(message)) return message.join('\n');
	else return message;
};

export default {
	success: (message: string | string[]) => {
		console.log(`${c.green().bold('[SUCCESS]')} ${getMessage(message)}`);
	},
	warning: (message: string | string[]) => {
		console.log(`${c.yellow().bold('[WARNING]')} ${getMessage(message)}`);
	},
	error: (message: string | string[]) => {
		console.log(`${c.red().bold('[ERROR]')} ${getMessage(message)}\n`);
		process.exit(1);
	},
	info: (message: string | string[], title?: string) => {
		console.log(`${c.blue().bold(`[${title || 'INFO'}]`)} ${getMessage(message)}`);
	},
	code: (message: string, char: string = '`') => {
		return c.yellow(`${char}` + message + `${char}`);
	},
	comment: (message: string) => {
		return c.grey(message);
	}
};
