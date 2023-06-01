import axios from 'axios';
import {type FastifyInstance} from 'fastify';
import {string, z} from 'zod';
import {prisma} from '../lid/prisma';

export async function authRoute(fastify: FastifyInstance) {
	fastify.post('/login', async (request, reply) => {
		try {
			const bodySchema = z.object({
				accessToken: string(),
			});

			const {accessToken} = bodySchema.parse(request.body);

			const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Authorization: 'Bearer ' + accessToken,
				},
			});

			const googleUserSchema = z.object({
				id: z.string(),
				email: z.string().email(),
				name: z.string(),
				picture: z.string().url(),
			});

			const googleUser = googleUserSchema.parse(response.data);

			let user = await prisma.user.findUnique({
				where: {
					googleId: googleUser.id,
				},
			});

			if (!user) {
				user = await prisma.user.create({
					data: {
						name: googleUser.name,
						email: googleUser.email,
						googleId: googleUser.id,
						avatarUrl: googleUser.picture,
					},
				});
			}

			const token = fastify.jwt.sign(
				{
					name: user.name,
					avatarUrl: user.avatarUrl,
				},
				{
					sub: user.id,
					expiresIn: '30 days',
				},
			);
			return {token};
		} catch (error) {
			console.error(error);
			return error;
		}
	});
}

