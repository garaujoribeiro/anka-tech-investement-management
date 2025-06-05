export const pathnameLabel = (pathname: string | null): string => {
  switch (pathname) {
    case "/":
      return "Clientes";
    case "/ativos":
      return "Ativos Financeiros";
    case "/clientes/[client]":
      return "Perfil do Cliente";
    default:
      return "Pagina em construção";
  }
};
