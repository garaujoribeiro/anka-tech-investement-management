type QueryParams = {
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

/**
 * Classe utilitária para construir parâmetros de consulta para operações de banco de dados como filtragem, busca, paginação e ordenação.
 *
 * @exemplo
 * const qb = new QueryBuilder(params)
 *   .search(['name', 'email'])
 *   .paginate()
 *   .order();
 * const query = qb.build();
 *
 * @observação
 * Projetada para ser usada com ORMs como o Prisma, esta classe ajuda a construir objetos de consulta dinamicamente com base na entrada do usuário.
 *
 * @param params - Parâmetros de consulta normalmente recebidos de uma requisição (ex: search, page, limit, orderBy, orderDir).
 */
export class QueryBuilder {
  private where: any = {};
  private take?: number;
  private skip?: number;
  private orderBy: any = undefined;

  constructor(private readonly params: QueryParams) {}

  search(fields: string[]) {
    const searchTerm = this.params.search;
    if (searchTerm && fields.length > 0) {
      this.where.OR = fields.map((field) => ({
        [field]: {
          contains: searchTerm,
        },
      }));
    }
    return this;
  }

  paginate(defaultLimit = 10) {
    const page = this.params.page ?? 1;
    const limit = this.params.limit ?? defaultLimit;

    this.take = limit;
    this.skip = (page - 1) * limit;

    return this;
  }

  order(defaultField = "createdAt") {
    const field = this.params.orderBy ?? defaultField;
    const direction = this.params.orderDir ?? "desc";

    this.orderBy = {
      [field]: direction,
    };

    return this;
  }

  build() {
    return {
      where: this.where,
      take: this.take,
      skip: this.skip,
      orderBy: this.orderBy,
    };
  }
}
