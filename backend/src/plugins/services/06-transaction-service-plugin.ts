import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { TransactionService } from "../../services/transaction-service";

const transactionServicePlugin: FastifyPluginAsync = async (fastify) => {
  const transactionService = new TransactionService(fastify);

  fastify.decorate("transactionService", transactionService);
};

export default fp(transactionServicePlugin, {
  name: "transactionService",
  dependencies: ["prisma", "allocationService", "@fastify/sensible"],
});

declare module "fastify" {
  interface FastifyInstance {
    transactionService: TransactionService;
  }
}
