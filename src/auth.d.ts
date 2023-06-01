import '@fastify/jwt';

declare module '@fastify/jwt' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions, @typescript-eslint/naming-convention
	export interface FastifyJWT {
		user: {
			sub: string;
			name: string;
			avatarUrl: string;
		};
	}
}
