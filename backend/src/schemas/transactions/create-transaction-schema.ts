import { z } from "zod";

export const transactionTypeSchema = z.enum(["BUY", "SELL"]);

export const createTransactionSchema = z.object({
  assetId: z.string().cuid(),
  type: transactionTypeSchema,
  quantity: z.number().positive("Quantidade deve ser positiva"),
  date: z.coerce.date().optional(), // opcional, default para `now()` no backend
});

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
