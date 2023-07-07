/* eslint-disable @typescript-eslint/no-unsafe-call */
import {describe, vi, it, expect} from 'vitest';
import buildServer from '../server';
import {before, after} from 'node:test';

describe('Server Tests', () => {
	const server = buildServer();

	before(() => server.ready());

	after(async () => server.close());

	it('should return status "Ok" on GET /', async () => {
		const response = await server.inject({
			method: 'GET',
			url: '/',
		});

		expect(response.statusCode).toEqual(200);
		expect(response.json()).toEqual({server: 'Ok'});
	});

	// Add more tests as needed
});

