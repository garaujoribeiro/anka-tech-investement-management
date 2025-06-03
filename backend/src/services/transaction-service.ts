import { Prisma, PrismaClient } from "../../generated/prisma";
import { FastifyInstance } from "fastify";
import { AllocationService } from "./allocations-service";

interface TransactionServiceDeps {
  prisma: PrismaClient;
  httpErrors: FastifyInstance["httpErrors"];
  allocationService: AllocationService;
  log: FastifyInstance["log"];
}

export class TransactionService {
  constructor(private readonly deps: TransactionServiceDeps) {}

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
    price: number;
  }) {
    try {
      return await this.deps.prisma.$transaction(async (tx) => {
        const allocation = await this.deps.allocationService.handleAllocation({
          clientId: data.clientId,
          assetId: data.assetId,
          quantity: data.quantity,
          tx,
          type: data.type,
        });

        const transaction = await tx.transaction.create({
          data: {
            price: data.price,
            quantity: data.quantity,
            type: data.type,
            allocationId: allocation.id,
          },
        });

        return { transaction, allocation };
      });
    } catch (error) {
      this.deps.log.error("Erro ao criar transação:", error);
      return this.deps.httpErrors.internalServerError(
        "Falha ao criar transação"
      );
    }
  }
}
