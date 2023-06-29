/* eslint-disable @typescript-eslint/naming-convention */

import {type FastifyInstance} from 'fastify';
import {authHandler} from './auth.controller';
import {$ref} from './auth.schema';

export async function authRoute(server: FastifyInstance) {
	server.post('/', {
		schema:
		{
			body: $ref('authBodySchema'),
			response: {200: $ref('authResponseSchema')},
			tags: ['User'],
		}}, authHandler);
}

