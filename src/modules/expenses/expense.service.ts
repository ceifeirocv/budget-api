import {prisma} from '../../lid/prisma';
import {type IdInput, type ExpenseBodyInput} from './expense.schema';

export const createExpense = async (data: ExpenseBodyInput) => {
	const expense = await prisma.expense.create({
		data,
		include: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Budget: {
				select: {
					color: true,
					name: true,
				},
			},
		},
	});

	return expense;
};

export const findExpenses = async (userId: IdInput) => {
	const expenses = await prisma.expense.findMany({
		where: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Budget: {
				userId,
			},
		},
		include: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Budget: {
				select: {
					color: true,
					name: true,
				},
			},
		},
	});
	return expenses;
};

export const findExpenseById = async (id: IdInput, userId: IdInput) => {
	const expense = await prisma.expense.findFirst({
		where: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Budget: {
				userId,
			},
			id,
		},
		include: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Budget: {
				select: {
					color: true,
					name: true,
				},
			},
		},
	});
	return expense;
};

export const updateExpense = async (id: IdInput, data: ExpenseBodyInput) => {
	const expense = await prisma.expense.update({
		where: {
			id,
		},
		data,
	});
	return expense;
};

export const deleteExpense = async (id: IdInput) => {
	const expense = await prisma.expense.delete({
		where: {
			id,
		},
		include: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Budget: {
				select: {
					color: true,
					name: true,
				},
			},
		},
	});
	return expense;
};
