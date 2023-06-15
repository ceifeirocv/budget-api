
import {type FastifyInstance} from 'fastify';
import {z} from 'zod';
import {prisma} from '../lid/prisma';

export async function expenseRoute(fastify: FastifyInstance) {
	fastify.addHook('preHandler', async request => {
		await request.jwtVerify();
	});

	fastify.post('/expense', async (request, reply) => {
		const bodySchema = z.object({
			name: z.string(),
			amount: z.coerce.number(),
			budgetId: z.string().uuid(),
		});
		try {
			const {name, amount, budgetId} = bodySchema.parse(request.body);

			const expense = await prisma.expense.create({
				data: {
					name,
					amount,
					budgetId,
				},
			});

			return {expense};
		} catch (error) {
			console.log(error);

			return error;
		}
	});

	fastify.get('/expense', async (request, reply) => {
		try {
			const expenses = await prisma.expense.findMany({
				where: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Budget: {
						userId: request.user.sub,
					},
				},
				include: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Budget: {
						select: {
							color: true,
							name: true,
						},
					},
				},
			});
			return {expenses};
		} catch (error) {
			return error;
		}
	});

	fastify.get('/expense/:expenseId', async (request, reply) => {
		const paramsSchema = z.object({
			expenseId: z.string().uuid(),
		});

		try {
			const {expenseId} = paramsSchema.parse(request.params);
			const expense = await prisma.expense.findFirst({
				where: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Budget: {
						userId: request.user.sub,
					},
					id: expenseId,
				},
			});
			if (!expense) {
				void reply
					.code(403)
					.header('Content-Type', 'application/json; charset=utf-8')
					.send({error: 'The client does not have access rights to the content'});
			}

			return {expense};
		} catch (error) {
			return error;
		}
	});

	fastify.put('/expense/:expenseId', async (request, reply) => {
		const paramsSchema = z.object({
			expenseId: z.string().uuid(),
		});
		const bodySchema = z.object({
			name: z.string(),
			amount: z.coerce.number(),
			budgetId: z.string().uuid(),
		});

		try {
			const {expenseId} = paramsSchema.parse(request.params);
			const expenseToUpdate = await prisma.expense.findFirst({
				where: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Budget: {
						userId: request.user.sub,
					},
					id: expenseId,
				},
			});
			if (!expenseToUpdate) {
				void reply
					.code(403)
					.header('Content-Type', 'application/json; charset=utf-8')
					.send({error: 'The client does not have access rights to the content'});
			}

			const {name, amount, budgetId} = bodySchema.parse(request.body);
			const expense = await prisma.expense.update({
				where: {
					id: expenseId,
				},
				data: {
					name,
					amount,
					budgetId,
				},
			});
			return {expense};
		} catch (error) {
			return error;
		}
	});

	fastify.delete('/expense/:expenseId', async (request, reply) => {
		const paramsSchema = z.object({
			expenseId: z.string().uuid(),
		});

		try {
			const {expenseId} = paramsSchema.parse(request.params);
			const expenseToUpdate = await prisma.expense.findFirst({
				where: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Budget: {
						userId: request.user.sub,
					},
					id: expenseId,
				},
			});
			if (!expenseToUpdate) {
				void reply
					.code(403)
					.header('Content-Type', 'application/json; charset=utf-8')
					.send({error: 'The client does not have access rights to the content'});
			}

			await prisma.expense.delete({
				where: {
					id: expenseId,
				},
			});
			return;
		} catch (error) {
			return error;
		}
	});
}
