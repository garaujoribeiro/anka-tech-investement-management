import { Prisma } from "../../generated/prisma";
import { FastifyInstance } from "fastify";
import { QueryBuilder } from "../utils/queryBuilder";

export class TransactionService {
  constructor(private readonly fastify: FastifyInstance) {}

  /**
   * Cria uma nova transação para um cliente e ativo, realizando a alocação dentro de uma transação no banco de dados.
   *
   * @param data - Os detalhes da transação.
   * @param data.clientId - O ID do cliente que está realizando a transação.
   * @param data.assetId - O ID do ativo envolvido na transação.
   * @param data.type - O tipo da transação, "BUY" ou "SELL".
   * @param data.quantity - A quantidade do ativo a ser transacionada.
   * @param data.price - O preço por unidade do ativo.
   * @returns Um objeto contendo a transação criada e a alocação relacionada.
   * @throws Lança um erro se a criação da transação falhar.
   */
  async create(data: {
    clientId: string;
    assetId: string;
    type: "BUY" | "SELL";
    quantity: Prisma.Decimal;
  }) {
    try {
      return await this.fastify.prisma.$transaction(async (tx) => {
        const client = await tx.client.findUnique({
          where: { id: data.clientId },
        });
        if (!client) {
          return this.fastify.httpErrors.notFound("Cliente não encontrado");
        }
        const asset = await tx.asset.findUnique({
          where: { id: data.assetId },
        });
        if (!asset) {
          return this.fastify.httpErrors.notFound("Ativo não encontrado");
        }
        const allocation =
          await this.fastify.allocationService.handleAllocation({
            clientId: data.clientId,
            assetId: data.assetId,
            quantity: data.quantity,
            tx,
            type: data.type,
          });

        const transaction = await tx.transaction.create({
          data: {
            price: asset.currentValue,
            quantity: data.quantity,
            type: data.type,
            allocationId: allocation.id,
            clientId: data.clientId,
            assetId: data.assetId,
          },
        });

        return { transaction, allocation };
      });
    } catch (error) {
      this.fastify.log.error("Erro ao criar transação:", error);
      return this.fastify.httpErrors.internalServerError(
        "Falha ao criar transação"
      );
    }
  }

  /**
   * Recupera uma lista paginada de transações para um cliente específico, com opções de busca e ordenação.
   *
   * @param clientId - O identificador único do cliente cujas transações serão recuperadas.
   * @param getTransactionQuery - Um objeto contendo opções de paginação, busca e ordenação:
   *   - page: O número da página atual (começando em 1).
   *   - limit: A quantidade de transações por página.
   *   - search: (Opcional) Uma string de busca para filtrar transações por nome ou email.
   *   - orderBy: (Opcional) O campo pelo qual ordenar os resultados.
   *   - order: (Opcional) A direção da ordenação, "asc" ou "desc".
   * @returns Um objeto contendo:
   *   - meta: Metadados de paginação incluindo página, limite, total de transações e total de páginas.
   *   - results: Um array de objetos de transação, cada um incluindo detalhes de alocação e ativo.
   * @throws Retorna um erro interno do servidor caso a busca falhe.
   */
  async findTransactionsByClientId(
    clientId: string,
    getTransactionQuery: {
      page: number;
      limit: number;
      orderBy?: string;
      search?: string;
      order?: "asc" | "desc";
    }
  ) {
    try {
      // Set default value for orderBy if not provided
      if (!getTransactionQuery.orderBy) {
        getTransactionQuery.orderBy = "date";
      }
      const query = new QueryBuilder(getTransactionQuery)
        .paginate()
        .order()
        .build();

      const total = await this.fastify.prisma.transaction.count({
        where: {
          ...query.where,
          clientId,
        },
      });

      const totalPages = Math.ceil(total / getTransactionQuery.limit);

      const results = await this.fastify.prisma.transaction.findMany({
        ...query,
        where: {
          ...query.where,
          clientId,
        },
        include: {
          asset: true,
        },
      });

      return {
        meta: {
          page: getTransactionQuery.page,
          limit: getTransactionQuery.limit,
          total,
          totalPages,
        },
        results,
      };
    } catch (error) {
      this.fastify.log.error("Erro ao buscar transações:", error);
      return this.fastify.httpErrors.internalServerError(JSON.stringify(error));
    }
  }
}
