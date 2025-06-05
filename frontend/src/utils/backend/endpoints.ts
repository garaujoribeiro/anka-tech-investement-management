export const API_ENDPOINTS = {
  clients: "/clients",
  client: (id: string) => `/clients/${id}`,
  clientTransaction: (id: string) => `/clients/${id}/transactions`,
  toggleClientStatus: (id: string) => `/clients/toggle-status/${id}`,
  assets: "/assets",
  asset: (id: string) => `/assets/${id}`,
};
