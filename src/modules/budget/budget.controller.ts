import {type FastifyReply, type FastifyRequest} from 'fastify';
import {type BudgetParamsInput, type CreateBudgetBodyInput} from './budget.schema';
import {createBudget, deleteBudgetsById, findBudgetsById, findBudgetsByUser, updateBudget} from './budget.service';

export const createBudgetHandler = async (request: FastifyRequest<{
	Body: CreateBudgetBodyInput;
}>, reply: FastifyReply) => {
	const {name, amount, color} = request.body;
	try {
		const budget = await createBudget({
			name,
			amount,
			userId: request.user.sub,
			color,
		});
		return await reply.code(201).send({budget});
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const getBudgetsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const budgets = await findBudgetsByUser(request.user.sub);
		return {budgets};
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const getBudgetsByIdHandler = async (request: FastifyRequest<{
	Params: BudgetParamsInput;
}>, reply: FastifyReply) => {
	const {budgetId} = request.params;
	try {
		const budget = await findBudgetsById(budgetId, request.user.sub);
		return {budget};
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const updateBudgetHandler = async (request: FastifyRequest<{
	Body: CreateBudgetBodyInput;
	Params: BudgetParamsInput;
}>, reply: FastifyReply) => {
	const {name, amount, color} = request.body;
	const {budgetId} = request.params;

	try {
		const budgetToUpdate = await findBudgetsById(budgetId, request.user.sub);
		if (!budgetToUpdate) {
			return await reply
				.code(403)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({message: 'The client does not have access rights to the content'});
		}

		const budget = await updateBudget(budgetId, {
			name,
			amount,
			userId: request.user.sub,
			color,
		});
		return await reply.code(201).send({budget});
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const deleteBudgetsByIdHandler = async (request: FastifyRequest<{
	Params: BudgetParamsInput;
}>, reply: FastifyReply) => {
	const {budgetId} = request.params;
	try {
		const budget = await findBudgetsById(budgetId, request.user.sub);
		if (!budget) {
			return await reply
				.code(403)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({message: 'The client does not have access rights to the content'});
		}

		await deleteBudgetsById(budget.id);
		return {message: 'Budget deleted'};
	} catch (error) {
		console.error(error);
		return error;
	}
};
