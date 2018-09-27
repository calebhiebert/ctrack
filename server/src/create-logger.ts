import pino from 'pino';

export default (name: string) => {
	return pino({ name, level: process.env.LOG_LEVEL || 'info' });
};
