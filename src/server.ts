import fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import 'dotenv/config';

import {authRoute} from './routes/auth';
import {budgetRoute} from './routes/budget';
import {expenseRoute} from './routes/expense';

const server = fastify();

const port = process.env.PORT ?? 4000;

void server.register(cors, {
	origin: '*',
});

void server.register(jwt, {
	secret: process.env.JWT_SECRET,
});

void server.register(authRoute);
void server.register(budgetRoute);
void server.register(expenseRoute);

server.get('/ping', async (request, reply) => 'pong\n');

server.listen({port}, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(`Server listening at ${address}`);
});
