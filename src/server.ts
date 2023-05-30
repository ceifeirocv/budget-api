import fastify from 'fastify';
import oauthPlugin from '@fastify/oauth2';
import jwt from '@fastify/jwt';
import 'dotenv/config';

import {authRoute} from './routes/auth';

const server = fastify();

const port = process.env.PORT ?? 4000;

void server.register(jwt, {
	secret: process.env.JWT_SECRET,
});

void server.register(oauthPlugin, {
	name: 'googleOAuth2',
	scope: ['profile', 'email'],
	credentials: {
		client: {
			id: process.env.GOOGLE_CLIENT_ID,
			secret: process.env.GOOGLE_CLIENT_SECRET,
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

server.listen({port}, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(`Server listening at ${address}`);
});
