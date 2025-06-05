import { backend } from "@/utils/backend/axios";
import { API_ENDPOINTS } from "@/utils/backend/endpoints";
import { CreateClientDto } from "@/schemas/create-client-schema";
import { UpdateClientDto } from "@/schemas/update-client-schema";
import { getErrorMessage } from "@/utils/get-error-message";
import { toast } from "sonner";
import { SortOrder } from "@/utils/backend/types";

// services/userService.ts
export enum ClientStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type Client = {
  id: string;
  name: string;
  email: string;
  status: ClientStatus;
};

/**
 * Busca uma lista de clientes na API backend.
 *
 * @returns Uma promessa que resolve para um objeto contendo metadados de paginação e um array de objetos `Client`.
 * @throws Exibe um toast de erro se a requisição falhar.
 */
export const fetchClients = async (params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  order?: SortOrder;
}) => {
  try {
    const res = await backend.get<{
      meta: {
        page: number;
        limit: number;
        total: number;
      };
      results: Client[];
    }>(API_ENDPOINTS.clients, {
      params: {
        page: params?.page,
        limit: params?.pageSize,
        search: params?.search,
        orderBy: params?.orderBy,
        order: params?.order,
      },
    });
    return res.data;
  } catch (err) {
    if (typeof window !== "undefined") {
      toast.error(getErrorMessage(err));
    }
  }
};

/**
 * Busca um cliente pelo seu identificador único.
 *
 * @param id - O identificador único do cliente a ser buscado.
 * @returns Uma promessa que resolve para o objeto `Client` buscado, ou `undefined` se ocorrer um erro.
 * @throws Exibe um toast de erro se a requisição falhar.
 */
export const fetchClientById = async (id: string) => {
  try {
    return await backend<Client>(API_ENDPOINTS.client(id));
  } catch (err) {
    if (typeof window !== "undefined") {
      toast.error(getErrorMessage(err));
    }
    throw new Error(getErrorMessage(err)); 
  }
};

/**
 * Cria um novo cliente enviando uma requisição POST para a API backend.
 *
 * @param client - O objeto DTO contendo as informações do novo cliente.
 * @returns Uma promessa que resolve com a resposta do backend, ou undefined se ocorrer um erro.
 *
 * @throws Exibe um toast de erro se a requisição falhar.
 */
export const createClient = async (client: CreateClientDto) => {
  try {
    return await backend.post(API_ENDPOINTS.clients, client);
  } catch (err) {
    toast.error(getErrorMessage(err));
  }
};

/**
 * Atualiza um cliente existente com os dados fornecidos.
 *
 * @param params - Os parâmetros para atualizar o cliente.
 * @param params.id - O identificador único do cliente a ser atualizado.
 * @param params.client - Os dados para atualizar o cliente.
 * @returns Uma promessa que resolve com os dados do cliente atualizado, ou exibe um toast de erro se a atualização falhar.
 */
export const updateClient = async ({
  id,
  client,
}: {
  id: string;
  client: UpdateClientDto;
}) => {
  try {
    return await backend.put(API_ENDPOINTS.client(id), client);
  } catch (err) {
    toast.error(getErrorMessage(err));
  }
};

/**
 * Exclui um cliente pelo seu identificador único.
 *
 * Envia uma requisição DELETE para a API backend para remover o cliente com o ID especificado.
 * Se ocorrer um erro durante a requisição, uma notificação de erro é exibida.
 *
 * @param id - O identificador único do cliente a ser excluído.
 * @returns Uma promessa que resolve com a resposta do backend, ou undefined se ocorrer um erro.
 */
export const deleteClient = async (id: string) => {
  try {
    return await backend.delete(API_ENDPOINTS.client(id));
  } catch (err) {
    toast.error(getErrorMessage(err));
  }
};

/**
 * Alterna o status de um cliente pelo seu identificador único.
 *
 * Envia uma requisição PUT para o backend para alterar o status do cliente (ex: ativar/desativar).
 * Se ocorrer um erro durante a requisição, exibe um toast de erro com uma mensagem relevante.
 *
 * @param id - O identificador único do cliente cujo status será alternado.
 * @returns Uma promessa que resolve com a resposta do backend, ou undefined se ocorrer um erro.
 */
export const toggleClientStatus = async (id: string) => {
  try {
    return await backend.put(API_ENDPOINTS.toggleClientStatus(id));
  } catch (err) {
    toast.error(getErrorMessage(err));
  }
};
