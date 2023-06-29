import axios from 'axios';
import {type FastifyReply, type FastifyRequest} from 'fastify';
import {googleUserSchema, type authBodyInput} from './auth.schema';
import {createUser, findUser} from './auth.service';

export const authHandler = async (request: FastifyRequest<{
	Body: authBodyInput;
}>, reply: FastifyReply) => {
	const {accessToken} = request.body;

	try {
		const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
			headers: {
				// eslint-disable-next-line @typescript-eslint/naming-convention
				Authorization: 'Bearer ' + accessToken,
			},
		});
		const googleUser = googleUserSchema.parse(response.data);
		let user = await findUser(googleUser.id);
		if (!user) {
			user = await createUser({
				name: googleUser.name,
				email: googleUser.email,
				googleId: googleUser.id,
				avatarUrl: googleUser.picture,
			});
		}

		const token = await reply.jwtSign(
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
};
