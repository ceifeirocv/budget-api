/* eslint-disable @typescript-eslint/naming-convention */

import {type FastifyInstance} from 'fastify';
import {createBudgetHandler, deleteBudgetsByIdHandler, getBudgetsByIdHandler, getBudgetsHandler, updateBudgetHandler} from './budget.controller';
import {$ref} from './budget.schema';

export async function budgetRoute(server: FastifyInstance) {
	server.addHook('preHandler', async request => {
		await request.jwtVerify();
	});

	server.post('/',
		{
			schema: {
				body: $ref('budgetBodySchema'),
				response: {
					201: $ref('budgetResponseSchema'),
				},
				tags: ['Budget'],
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		createBudgetHandler,
	);

	server.get('/',
		{
			schema: {
				response: {
					200: $ref('budgetsResponseSchema'),
				},
				tags: ['Budget'],
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		getBudgetsHandler,
	);

	server.get('/:budgetId',
		{
			schema: {
				params: $ref('budgetParamsSchema'),
				response: {
					200: $ref('budgetResponseSchema'),
				},
				tags: ['Budget'],
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		getBudgetsByIdHandler,
	);

	server.put('/:budgetId',
		{
			schema: {
				body: $ref('budgetBodySchema'),
				params: $ref('budgetParamsSchema'),
				response: {
					201: $ref('budgetResponseSchema'),
				},
				tags: ['Budget'],
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		updateBudgetHandler,
	);

	server.delete('/:budgetId',
		{
			schema: {
				params: $ref('budgetParamsSchema'),
				tags: ['Budget'],
				response: {
					200: $ref('deleteBudgetResponseSchema'),
				},
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		deleteBudgetsByIdHandler,
	);
}
