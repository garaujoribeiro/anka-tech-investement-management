import { backend } from "@/utils/backend/axios";
import { API_ENDPOINTS } from "@/utils/backend/endpoints";
import { SortOrder } from "@/utils/backend/types";
import { getErrorMessage } from "@/utils/get-error-message";
import { toast } from "sonner";
import { Asset } from "./asset";

export interface Transaction {
  id: string;
  allocationId: string;
  clientId: string;
  assetId: string;
  type: "BUY" | "SELL";
  quantity: string; // Using string to match the Decimal type in Prisma
  price: string;
  date: Date;
  asset: Asset;
}

/**
 * Busca uma lista paginada de transações para um cliente específico.
 *
 * @param clientId - O identificador único do cliente cujas transações serão buscadas.
 * @param params - Parâmetros opcionais de consulta para paginação, busca e ordenação.
 * @param params.page - O número da página a ser recuperada (opcional).
 * @param params.pageSize - A quantidade de itens por página (opcional).
 * @param params.search - Uma string de busca para filtrar as transações (opcional).
 * @param params.orderBy - O campo pelo qual ordenar os resultados (opcional).
 * @param params.order - A ordem de classificação, ascendente ou descendente (opcional).
 * @returns Uma promessa que resolve para um objeto contendo metadados de paginação e a lista de transações.
 * @throws Lança um erro com uma mensagem descritiva caso a requisição falhe.
 */
export const fetchTransactions = async (
  clientId: string,
  params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    orderBy?: string;
    order?: SortOrder;
  }
) => {
  try {
    const res = await backend.get<{
      meta: {
        page: number;
        limit: number;
        total: number;
      };
      results: [];
    }>(API_ENDPOINTS.clientTransaction(clientId), {
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
    throw new Error(getErrorMessage(err));
  }
};
