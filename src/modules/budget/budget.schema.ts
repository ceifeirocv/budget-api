import {buildJsonSchemas} from 'fastify-zod';
import {z} from 'zod';

const idSchema = z.string().uuid();

const budgetBodySchema = z.object({
	name: z.string().trim(),
	amount: z.coerce.number(),
	color: z.string().trim(),
});

const budgetParamsSchema = z.object({
	budgetId: z.string().trim().uuid(),
});

const budgetResponseSchema = z.object({
	budget: z.object({
		id: z.string().uuid(),
		name: z.string(),
		amount: z.coerce.number(),
		createdAt: z.string().datetime(),
		color: z.string(),
		userId: z.string().uuid(),
	}),
});

const budgetsResponseSchema = z.object({
	budgets: z.array(z.object(
		{
			id: z.string().uuid(),
			name: z.string(),
			amount: z.coerce.number(),
			createdAt: z.string().datetime(),
			color: z.string(),
			userId: z.string().uuid(),
		},
	)),
});

const deleteBudgetResponseSchema = z.object({
	message: z.string(),
});

const budgetSchema = z.object({
	name: z.string(),
	amount: z.coerce.number(),
	userId: z.string().uuid(),
	color: z.string(),
});

export type CreateBudgetBodyInput = z.infer<typeof budgetBodySchema>;
export type BudgetParamsInput = z.infer<typeof budgetParamsSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type IdInput = z.infer<typeof idSchema>;

export const {schemas: budgetSchemas, $ref} = buildJsonSchemas(
	{
		budgetBodySchema,
		budgetResponseSchema,
		budgetsResponseSchema,
		budgetParamsSchema,
		deleteBudgetResponseSchema,
	},
	{$id: 'budgetSchemas'},
);
