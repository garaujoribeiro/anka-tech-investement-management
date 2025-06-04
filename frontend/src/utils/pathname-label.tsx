export const pathnameLabel = (pathname: string | null): string => {
  switch (pathname) {
    case "/":
      return "Clientes";
    default:
      return "Pagina em construção";
  }
};
