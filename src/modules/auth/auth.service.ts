import {prisma} from '../../lid/prisma';
import {type CreateUserInput} from './auth.schema';

export const findUser = async (input: string) => {
	const user = await prisma.user.findUnique({
		where: {
			googleId: input,
		},
	});
	return user;
};

export const createUser = async (input: CreateUserInput) => {
	const user = await prisma.user.create({
		data: input,
	});
	return user;
};
