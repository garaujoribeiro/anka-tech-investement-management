import { FastifyInstance } from "fastify";
import { Allocation, Prisma, Transaction } from "../../generated/prisma"; // Adjust the import path as necessary
import { GetTransactionsQuery } from "../schemas/transactions/query-transaction-schema";
import { QueryBuilder } from "../utils/queryBuilder";
import { HttpError } from "@fastify/sensible";
import { GetAllocationsByClientSchema } from "../schemas/clients/query-allocations-by-client.schema";

interface HandleTransactionArgs {
  clientId: string;
  assetId: string;
  quantity: Prisma.Decimal;
  type: "BUY" | "SELL";
  tx: Prisma.TransactionClient;
}

export class AllocationService {
  constructor(private fastify: FastifyInstance) {}

  /**
   * Recupera uma lista paginada de transações associadas a uma alocação específica.
   *
   * @param getTransactionsQuery - Os parâmetros de consulta para paginação, ordenação e busca de transações.
   * @param allocationId - O identificador único da alocação cujas transações devem ser recuperadas.
   * @returns Um objeto contendo metadados de paginação e a lista de transações.
   * @throws {NotFound} Se a alocação com o ID fornecido não existir.
   * @throws {InternalServerError} Se ocorrer um erro ao buscar as transações.
   */
  async findAllTransactions(
    getTransactionsQuery: GetTransactionsQuery,
    allocationId: string
  ): Promise<
    | {
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        results: Transaction[];
      }
    | HttpError
  > {
    try {
      const query = new QueryBuilder(getTransactionsQuery)
        .paginate()
        .order()
        .search(["type"])
        .build();

      const allocation = await this.fastify.prisma.allocation.findUnique({
        where: { id: allocationId },
      });

      if (!allocation) {
        return this.fastify.httpErrors.notFound("Alocação não encontrada");
      }

      const total = await this.fastify.prisma.allocation.count({
        where: {
          id: allocation.id,
          ...query.where,
        },
      });

      const totalPages = Math.ceil(total / getTransactionsQuery.limit);

      const results = await this.fastify.prisma.transaction.findMany({
        skip: query.skip,
        take: query.take,
        where: {
          allocationId: allocation.id,
          ...query.where,
        },
        orderBy: query.orderBy,
      });

      return {
        meta: {
          page: getTransactionsQuery.page,
          limit: getTransactionsQuery.limit,
          total,
          totalPages
        },
        results,
      };
    } catch (error) {
      this.fastify.log.error("Erro ao buscar transacoes:", error);
      return this.fastify.httpErrors.internalServerError(
        "Falha ao buscar transações"
      );
    }
  }

  /**
   * Recupera uma lista paginada de alocações para um cliente específico pelo seu ID.
   *
   * @param clientId - O identificador único do cliente cujas alocações devem ser recuperadas.
   * @param  - Os parâmetros de consulta para busca, paginação e ordenação das alocações.
   * @returns Uma promise que resolve para um objeto contendo metadados de paginação e a lista de alocações,
   *          ou um HttpError se a operação falhar.
   *
   * @throws {HttpError} Se ocorrer um erro ao buscar as alocações.
   */
  async findByClientId(
    clientId: string,
    params: GetAllocationsByClientSchema
  ): Promise<
    | {
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        results: Allocation[];
      }
    | HttpError
  > {
    try {
      const query = new QueryBuilder(params)
        .search(["name", "email"])
        .paginate()
        .order()
        .build();

      const total = await this.fastify.prisma.allocation.count({
        where: { ...query.where, clientId },
      });

      const totalPages = Math.ceil(total / params.limit);

      const results = await this.fastify.prisma.allocation.findMany({
        ...query,
        where: {
          ...query.where,
          id: clientId,
        },
      });

      return {
        meta: {
          page: params.page,
          limit: params.limit,
          total,
          totalPages,
        },
        results,
      };
    } catch (error) {
      this.fastify.log.error("Erro ao buscar alocacoes:", error);
      return this.fastify.httpErrors.internalServerError(
        "Falha ao buscar alocações"
      );
    }
  }

  /**
   * Manipula uma transação com base no seu tipo.
   *
   * Dependendo da propriedade `type` dos argumentos fornecidos, este método delega
   * a transação para o manipulador de compra ou venda. Lança um erro se o tipo de transação
   * for inválido.
   *
   * @param args - Os argumentos necessários para manipular a transação, incluindo seu tipo.
   * @returns O resultado do manipulador de transação de compra ou venda.
   * @throws {HttpError} Se o tipo de transação for inválido.
   */
  async handleAllocation(args: HandleTransactionArgs) {
    switch (args.type) {
      case "BUY":
        return this.handleBuyAsset(args);
      case "SELL":
        return this.handleSellAsset(args);
      default:
        return this.fastify.httpErrors.badRequest("Invalid transaction type");
    }
  }

  /**
   * Manipula uma transação de compra para um ativo e cliente específicos.
   *
   * Este método verifica se já existe uma alocação para o ativo e cliente informados.
   * - Se a alocação não existir, cria uma nova alocação com a quantidade especificada.
   * - Se a alocação existir, incrementa a quantidade existente pelo valor informado.
   *
   * @param args - Os argumentos necessários para manipular a transação, incluindo assetId, quantity, contexto da transação (`tx`) e clientId.
   * @returns Uma promise que resolve para o registro de alocação criado ou atualizado.
   */
  private async handleBuyAsset(args: HandleTransactionArgs) {
    const { assetId, quantity, tx, clientId } = args;

    const allocation = await tx.allocation.findUnique({
      where: {
        clientId_assetId: {
          assetId,
          clientId,
        },
      },
    });

    // Se nao existir a alocação, cria uma nova
    if (!allocation) {
      return await tx.allocation.create({
        data: {
          assetId,
          clientId,
          quantity,
        },
      });
    }

    // Se existir, atualiza a quantidade
    return await tx.allocation.update({
      where: {
        clientId_assetId: {
          assetId,
          clientId,
        },
      },
      data: {
        quantity: {
          increment: quantity,
        },
      },
    });
  }

  /**
   * Manipula a lógica para processar uma transação de venda de uma alocação de ativo.
   *
   * Este método verifica se existe uma alocação para o cliente e ativo informados.
   * Se a alocação não existir, lança um erro de "não encontrado".
   * Se a quantidade a ser vendida exceder a quantidade alocada, lança um erro de "requisição inválida".
   * Caso contrário, decrementa a quantidade da alocação pelo valor vendido.
   *
   * @param args - Os argumentos necessários para manipular a transação de venda, incluindo assetId, quantity, contexto da transação e clientId.
   * @throws {NotFound} Se a alocação não existir para o cliente e ativo informados.
   * @throws {BadRequest} Se a quantidade a ser vendida for maior que a quantidade alocada.
   * @returns A alocação atualizada após decrementar a quantidade.
   */
  private async handleSellAsset(args: HandleTransactionArgs) {
    const { assetId, quantity, tx, clientId } = args;

    const allocation = await tx.allocation.findUnique({
      where: {
        clientId_assetId: {
          assetId,
          clientId,
        },
      },
    });

    // Se nao existir a alocação, lança um erro
    if (!allocation) {
      throw this.fastify.httpErrors.notFound("Alocação não encontrada!");
    }

    // Se a quantidade vendida for maior que a quantidade alocada, lança um erro
  if (!allocation.quantity.greaterThanOrEqualTo(quantity)) {
      throw this.fastify.httpErrors.badRequest(
        "Quantidade insuficiente para venda!"
      );
    }

    // Atualiza a quantidade da alocação
    return await tx.allocation.update({
      where: {
        clientId_assetId: {
          assetId,
          clientId,
        },
      },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });
  }
}
