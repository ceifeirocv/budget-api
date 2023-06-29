import {buildJsonSchemas} from 'fastify-zod';
import {z} from 'zod';

const idSchema = z.string().uuid();

const expenseBodySchema = z.object({
	name: z.string(),
	amount: z.coerce.number(),
	budgetId: z.string().uuid(),
});

const expenseResponseSchema = z.object({
	expense: z.object({
		id: z.string().uuid(),
		name: z.string(),
		amount: z.coerce.number(),
		createdAt: z.string().datetime(),
		budgetId: z.string().uuid(),
	}),
});

const expensesResponseSchema = z.object({
	expenses: z.array(z.object(
		{
			id: z.string().uuid(),
			name: z.string(),
			amount: z.coerce.number(),
			createdAt: z.string().datetime(),
			budgetId: z.string().uuid(),
		},
	)),
});

const expenseParamsSchema = z.object({
	expenseId: z.string().uuid(),
});

const deleteExpenseResponseSchema = z.object({
	message: z.string(),
});

export type IdInput = z.infer<typeof idSchema>;
export type ExpenseBodyInput = z.infer<typeof expenseBodySchema>;
export type ExpenseParamsInput = z.infer<typeof expenseParamsSchema>;

export const {schemas: expenseSchemas, $ref} = buildJsonSchemas(
	{
		expenseBodySchema,
		expenseResponseSchema,
		expensesResponseSchema,
		expenseParamsSchema,
		deleteExpenseResponseSchema,
	},
	{$id: 'expenseSchemas'},
);
