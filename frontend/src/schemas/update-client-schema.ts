import { z } from "zod";

export const updateClientSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  email: z.string().email("O e-mail deve ser válido"),
});

export type UpdateClientDto = z.infer<typeof updateClientSchema>;
