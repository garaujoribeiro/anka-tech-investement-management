export const pathnameLabel = (pathname: string | null): string => {
  switch (pathname) {
    case "/":
      return "Clientes";
    case "/ativos":
      return "Ativos Financeiros";
    default:
      return "Pagina em construção";
  }
};
