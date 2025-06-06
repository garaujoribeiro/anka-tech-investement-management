import { z } from "zod";

// Enum para tipo de transação
export const transactionTypeSchema = z.enum(["BUY", "SELL"]);

// Schema para criação de uma transação (sem allocationId)
export const createTransactionSchema = z.object({
  assetId: z.string().uuid(),
  type: transactionTypeSchema,
  quantity: z.number().positive("Quantidade deve ser positiva"),
  date: z.coerce.date().optional(), // opcional, default para `now()` no backend
});

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
