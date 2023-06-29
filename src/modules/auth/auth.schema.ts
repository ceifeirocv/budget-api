/* eslint-disable @typescript-eslint/naming-convention */
import {z} from 'zod';
import {buildJsonSchemas} from 'fastify-zod';

export const authBodySchema = z.object({
	accessToken: z.string({
		required_error: 'accessToken is Requiered',
		invalid_type_error: 'accessToken must be a string',
	}).trim(),
});

export const googleUserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	name: z.string(),
	picture: z.string().url(),
});

export const createUserSchema = z.object({
	email: z.string({
		required_error: 'Email is Requiered',
		invalid_type_error: 'Email must be a string',
	}).email(),
	name: z.string(),
	googleId: z.string(),
	avatarUrl: z.string().url(),
});

export const authResponseSchema = z.object({
	token: z.string(),
});

export type authBodyInput = z.infer<typeof authBodySchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const {schemas: authSchemas, $ref} = buildJsonSchemas({authBodySchema, authResponseSchema}, {$id: 'authSchemas'});
