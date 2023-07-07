import buildServer from './server';

const port = process.env.PORT ?? 4000;

const server = buildServer();

async function main() {
	try {
		const address = await server.listen({port, host: '0.0.0.0'});
		console.log(`Server listening at ${address}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

void main();
