
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

			return budget;
		} catch (error) {
			return error;
		}
	});
}
