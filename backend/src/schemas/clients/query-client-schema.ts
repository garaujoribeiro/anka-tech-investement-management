import { z } from "zod";
import { paginationSchema } from "../pagination";

export const getClientsQuerySchema = paginationSchema.extend({
  search: z
    .string({
      message: "O termo de busca deve ser uma string",
    })
    .optional(),
  sortBy: z
    .enum(["name", "createdAt"], {
      errorMap: () => {
        return {
          message: "O campo de ordenação deve ser 'name' ou 'createdAt'",
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

export type GetClientsQuery = z.infer<typeof getClientsQuerySchema>;
