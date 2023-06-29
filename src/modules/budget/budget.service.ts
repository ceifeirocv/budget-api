import {prisma} from '../../lid/prisma';
import {type IdInput, type BudgetInput} from './budget.schema';

export const createBudget = async (data: BudgetInput) => {
	const budget = await prisma.budget.create({
		data,
	});

	return budget;
};

export const findBudgetsByUser = async (userId: IdInput) => {
	const budgets = await prisma.budget.findMany({
		where: {
			userId,
		},
	});
	return budgets;
};

export const findBudgetsById = async (id: IdInput, userId: IdInput) => {
	const budget = await prisma.budget.findFirst({
		where: {
			id,
			userId,
		},
	});
	return budget;
};

export const deleteBudgetsById = async (id: IdInput) => {
	const budget = await prisma.budget.delete({
		where: {
			id,
		},
	});
	return budget;
};

export const updateBudget = async (id: IdInput, data: BudgetInput) => {
	const budget = await prisma.budget.update({
		where: {
			id,
		},
		data,
	});

	return budget;
};
