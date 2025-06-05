import { backend } from "@/utils/backend/axios";
import { API_ENDPOINTS } from "@/utils/backend/endpoints";
import { getErrorMessage } from "@/utils/get-error-message";
import { toast } from "sonner";
import { SortOrder } from "@/utils/backend/types";

// services/userService.ts
export enum AssetType {
  STOCK = "STOCK",
  FUND = "FUND",
  BOND = "BOND",
  ETF = "ETF",
  CRYPTO = "CRYPTO",
}

export type Asset = {
  id: string;
  name: string;
  type: AssetType;
  currentValue: string;
  symbol: string;
  description: string;
};

/**
 * Busca uma lista paginada de ativos na API do backend.
 *
 * @param params - Parâmetros opcionais para buscar ativos.
 * @param params.page - O número da página a ser recuperada.
 * @param params.pageSize - A quantidade de ativos por página.
 * @param params.search - Uma consulta de busca para filtrar ativos.
 * @param params.orderBy - O campo para ordenar os resultados.
 * @param params.order - A ordem de classificação (ascendente ou descendente).
 * @returns Uma promessa que resolve para um objeto contendo metadados de paginação e um array de ativos.
 * @throws Exibe um toast de erro se a requisição falhar em ambiente de navegador.
 */
export const fetchAsset = async (params?: {
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
      results: Asset[];
    }>(API_ENDPOINTS.assets, {
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
