import { createQueryKeys } from "@/lib/query-keys-factory";
import { SortOrder } from "@/utils/backend/types";

export const assetQueryKey = createQueryKeys("asset", {
  list: (param?: {
    page?: number;
    pageSize?: number;
    search?: string;
    orderBy?: string;
    order?: SortOrder;
  }) =>
    [
      param?.page && `page-${param.page}`,
      param?.pageSize && `pageSize-${param.pageSize}`,
      param?.search && `search-${param.search}`,
      param?.orderBy && `orderBy-${param.orderBy}`,
      param?.order && `order-${param.order}`,
    ].filter(Boolean),
  detail: (id: string) => [id],
});
