import axios from 'axios';
import {type FastifyInstance} from 'fastify';
import {z} from 'zod';
import {prisma} from '../lid/prisma';

export async function authRoute(fastify: FastifyInstance) {
	fastify.get('/auth/google/callback', async function (request, reply) {
		try {
			const {token: googleToken} = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
			const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Authorization: 'Bearer ' + googleToken.access_token,
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
						email: googleUser.name,
						name: googleUser.email,
						googleId: googleUser.id,
						avatarUrl: googleUser.picture,
					},
				});
			}

			const token = fastify.jwt.sign(
				{
					name: user.name,
					avatarUrl: user.avatarUrl,
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
