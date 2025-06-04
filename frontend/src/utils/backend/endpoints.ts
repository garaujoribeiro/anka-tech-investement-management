export const API_ENDPOINTS = {
  clients: "/clients",
  client: (id: string) => `/clients/${id}`,
  toggleClientStatus: (id: string) => `/clients/toggle-status/${id}`,
  allocations: "/allocations",
  allocation: (id: string) => `/allocations/${id}`,
  transactions: "/transactions",
  transaction: (id: string) => `/transactions/${id}`,
  assets: "/assets",
  asset: (id: string) => `/assets/${id}`,
};
