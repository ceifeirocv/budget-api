/* eslint-disable @typescript-eslint/naming-convention */
import fastify from 'fastify';
import jwt from '@fastify/jwt';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerui from '@fastify/swagger-ui';
import 'dotenv/config';

import {authRoute} from './modules/auth/auth.route';
import {budgetRoute} from './modules/budget/budget.route';
import {expenseRoute} from './modules/expenses/expense.route';
import {authSchemas} from './modules/auth/auth.schema';
import {budgetSchemas} from './modules/budget/budget.schema';
import {expenseSchemas} from './modules/expenses/expense.schema';
import {version} from '../package.json';

const server = fastify();

const port = process.env.PORT ?? 4000;

void server.register(cors, {
	origin: '*',
});

void server.register(jwt, {
	secret: process.env.JWT_SECRET,
});

server.get('/', async (request, reply) => ({server: 'Ok'}));

async function main() {
	for (const schema of [...authSchemas, ...budgetSchemas, ...expenseSchemas]) {
		server.addSchema(schema);
	}

	await server.register(
		swagger,
		{
			openapi: {
				info: {
					title: 'Budget Api',
					description: 'The Budget API is a powerful and flexible tool designed to help users manage their personal finances effectively',
					version,
				},
				externalDocs: {
					url: 'https://github.com/ceifeirocv/budget-api',
					description: 'Github Repo',
				},
				tags: [
					{name: 'User', description: 'User related end-points'},
				],
				servers: [
					{url: 'http://localhost:4000'},
					{url: 'https://budget-api-nn6x.onrender.com/'},
				],
				components: {
					securitySchemes: {
						bearerAuth: {
							type: 'http',
							scheme: 'bearer',
							bearerFormat: 'JWT',
						},
					},
				},
			},
		},
	);
	await server.register(
		swaggerui,
		{
			routePrefix: '/docs',
			theme: {
				title: 'Budget API Documantation',
			},
			uiConfig: {
				deepLinking: false,
			},
			uiHooks: {
				onRequest(request, reply, next) {
					next();
				},
				preHandler(request, reply, next) {
					next();
				},
			},
			staticCSP: true,
			transformStaticCSP: header => header,
			transformSpecification(swaggerObject, request, reply) {
				return swaggerObject;
			},
			transformSpecificationClone: true,
		});

	void server.register(authRoute, {prefix: 'api/auth'});
	void server.register(budgetRoute, {prefix: 'api/budget'});
	void server.register(expenseRoute, {prefix: 'api/expense'});

	try {
		const address = await server.listen({port, host: '0.0.0.0'});
		console.log(`Server listening at ${address}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

void main();
