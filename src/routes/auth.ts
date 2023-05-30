import axios from 'axios';
import {type FastifyInstance} from 'fastify';

export async function authRoute(fastify: FastifyInstance) {
	fastify.get('/auth/google/callback', async function (request, reply) {
		try {
			const {token} = await this.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);
			const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
				headers: {
					// eslint-disable-next-line @typescript-eslint/naming-convention
					Authorization: 'Bearer ' + token.access_token,
				},
			});
			console.log('Axios: ', response.data);
			return response.data;
		} catch (error) {
			console.error(error);
			return error;
		}
	});
}
