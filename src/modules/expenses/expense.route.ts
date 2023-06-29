/* eslint-disable @typescript-eslint/naming-convention */
import {type FastifyInstance} from 'fastify';
import {createExpenseHandler, deleteExpenseByIdHandler, getExpenseByIdHandler, getExpensesHandler, updateExpenseHandler} from './expense.controller';
import {$ref} from './expense.schema';

export async function expenseRoute(server: FastifyInstance) {
	server.addHook('preHandler', async request => {
		await request.jwtVerify();
	});

	server.post('/',
		{
			schema: {
				body: $ref('expenseBodySchema'),
				tags: ['Expense'],
				response: {
					200: $ref('expenseResponseSchema'),
				},
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		createExpenseHandler,
	);

	server.get('/',
		{
			schema: {
				tags: ['Expense'],
				response: {
					200: $ref('expensesResponseSchema'),
				},
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		getExpensesHandler,
	);

	server.get('/:expenseId',
		{
			schema: {
				tags: ['Expense'],
				params: $ref('expenseParamsSchema'),
				response: {
					200: $ref('expenseResponseSchema'),
				},
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		getExpenseByIdHandler,
	);

	server.put('/:expenseId',
		{
			schema: {
				body: $ref('expenseBodySchema'),
				params: $ref('expenseParamsSchema'),
				tags: ['Expense'],
				response: {
					200: $ref('expenseResponseSchema'),
				},
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		updateExpenseHandler,
	);

	server.delete('/:expenseId',
		{
			schema: {
				tags: ['Expense'],
				params: $ref('expenseParamsSchema'),
				response: {
					200: $ref('deleteExpenseResponseSchema'),
				},
				security: [
					{
						bearerAuth: [],
					},
				],
			},
		},
		deleteExpenseByIdHandler,
	);
}
