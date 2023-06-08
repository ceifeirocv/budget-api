
import {type FastifyInstance} from 'fastify';
import {z} from 'zod';
import {prisma} from '../lid/prisma';

export async function budgetRoute(fastify: FastifyInstance) {
	fastify.addHook('preHandler', async request => {
		await request.jwtVerify();
	});

	fastify.post('/budget', async (request, reply) => {
		const bodySchema = z.object({
			name: z.string(),
			amount: z.coerce.number(),
		});
		try {
			const {name, amount} = bodySchema.parse(request.body);

			const budget = await prisma.budget.create({
				data: {
					name,
					amount,
					userId: request.user.sub,
				},
			});

			return {budget};
		} catch (error) {
			return error;
		}
	});

	fastify.get('/budget', async (request, reply) => {
		try {
			const budgets = await prisma.budget.findMany({
				where: {
					userId: request.user.sub,
				},
			});
			return {budgets};
		} catch (error) {
			return error;
		}
	});

	fastify.get('/budget/:budgetId', async (request, reply) => {
		const paramsSchema = z.object({
			budgetId: z.string().uuid(),
		});

		try {
			const {budgetId} = paramsSchema.parse(request.params);
			const budget = await prisma.budget.findFirst({
				where: {
					userId: request.user.sub,
					id: budgetId,
				},
			});
			return {budget};
		} catch (error) {
			return error;
		}
	});

	fastify.put('/budget/:budgetId', async (request, reply) => {
		const paramsSchema = z.object({
			budgetId: z.string().uuid(),
		});
		const bodySchema = z.object({
			name: z.string(),
			amount: z.coerce.number(),
		});

		try {
			const {budgetId} = paramsSchema.parse(request.params);
			const {name, amount} = bodySchema.parse(request.body);
			const budget = await prisma.budget.update({
				where: {
					id: budgetId,
				},
				data: {
					name,
					amount,
					userId: request.user.sub,
				},
			});
			return {budget};
		} catch (error) {
			return error;
		}
	});
}
