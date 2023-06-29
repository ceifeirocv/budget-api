import {type FastifyReply, type FastifyRequest} from 'fastify';
import {type ExpenseParamsInput, type ExpenseBodyInput} from './expense.schema';
import {createExpense, deleteExpense, findExpenseById, findExpenses, updateExpense} from './expense.service';

export const createExpenseHandler = async (request: FastifyRequest<{
	Body: ExpenseBodyInput;
}>, reply: FastifyReply) => {
	const {name, amount, budgetId} = request.body;
	try {
		const expense = await createExpense({
			name,
			amount,
			budgetId,
		});

		return {expense};
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const getExpensesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	try {
		const expenses = await findExpenses(request.user.sub);
		return {expenses};
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const getExpenseByIdHandler = async (request: FastifyRequest<{
	Params: ExpenseParamsInput;
}>, reply: FastifyReply) => {
	const {expenseId} = request.params;

	try {
		const expense = await findExpenseById(expenseId, request.user.sub);
		if (!expense) {
			return await reply
				.code(403)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({message: 'The client does not have access rights to the content'});
		}

		return {expense};
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const updateExpenseHandler = async (request: FastifyRequest<{
	Body: ExpenseBodyInput;
	Params: ExpenseParamsInput;
}>, reply: FastifyReply) => {
	const {name, amount, budgetId} = request.body;
	const {expenseId} = request.params;
	try {
		const expenseToUpdate = await findExpenseById(expenseId, request.user.sub);
		if (!expenseToUpdate) {
			return await reply
				.code(403)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({message: 'The client does not have access rights to the content'});
		}

		const expense = await updateExpense(
			expenseId,
			{
				name,
				amount,
				budgetId,
			},
		);

		return {expense};
	} catch (error) {
		console.error(error);
		return error;
	}
};

export const deleteExpenseByIdHandler = async (request: FastifyRequest<{
	Params: ExpenseParamsInput;
}>, reply: FastifyReply) => {
	const {expenseId} = request.params;

	try {
		const expense = await findExpenseById(expenseId, request.user.sub);
		if (!expense) {
			return await reply
				.code(403)
				.header('Content-Type', 'application/json; charset=utf-8')
				.send({message: 'The client does not have access rights to the content'});
		}

		await deleteExpense(expense.id);
		return {message: 'Expense deleted'};
	} catch (error) {
		console.error(error);
		return error;
	}
};
