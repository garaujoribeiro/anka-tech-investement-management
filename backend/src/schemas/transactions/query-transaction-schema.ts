import { z } from "zod";
import { paginationSchema } from "../pagination";

export const getTransactionsQuerySchema = paginationSchema.extend({
  sortBy: z
    .enum(["quantity", "createdAt"], {
      errorMap: () => {
        return {
          message: "O campo de ordenação deve ser 'quantity' ou 'createdAt'",
        };
      },
    })
    .optional(),
  order: z
    .enum(["asc", "desc"], {
      errorMap: () => {
        return {
          message: "A ordem deve ser 'asc' ou 'desc'",
        };
      },
    })
    .optional(),
});

export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;
