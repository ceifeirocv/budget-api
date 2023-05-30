import fastify from 'fastify';
import oauthPlugin from '@fastify/oauth2';
import {authRoute} from './routes/auth';

const server = fastify();

void server.register(oauthPlugin, {
	name: 'googleOAuth2',
	scope: ['profile', 'email'],
	credentials: {
		client: {
			id: '1048568934801-s9b0i2ubpktif27k7g5de50591244irk.apps.googleusercontent.com',
			secret: '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',
		},
		auth: oauthPlugin.GOOGLE_CONFIGURATION,
	},
	// Register a fastify url to start the redirect flow
	startRedirectPath: '/auth/google',
	// Facebook redirect here after the user login
	callbackUri: 'http://localhost:4000/auth/google/callback',
});

void server.register(authRoute);

server.get('/ping', async (request, reply) => 'pong\n');

server.listen({port: 4000}, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(`Server listening at ${address}`);
});
