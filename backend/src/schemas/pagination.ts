import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce
    .number({
      invalid_type_error: "A página deve ser um número",
    })
    .int({
      message: "O número da página deve ser um número inteiro",
    })
    .min(1, {
      message: "O número da página deve ser pelo menos 1",
    })
    .default(1),
  limit: z.coerce
    .number({
      invalid_type_error: "O limite deve ser um número",
    })
    .int({
      message: "O limite deve ser um número inteiro",
    })
    .min(1, {
      message: "O limite deve ser pelo menos 1",
    })
    .max(100, {
      message: "O limite não pode ser maior que 100",
    })
    .default(10),
});
