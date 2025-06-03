import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { TransactionService } from "../../services/transaction-service";

const transactionServicePlugin: FastifyPluginAsync = async (fastify) => {
  const transationService = new TransactionService({
    prisma: fastify.prisma,
    httpErrors: fastify.httpErrors,
    log: fastify.log,
    allocationService: fastify.allocationService,
  });

  fastify.decorate("transationService", transationService);
};

export default fp(transactionServicePlugin, {
  name: "transationService",
  dependencies: ["prisma", "allocationService"],
});

declare module "fastify" {
  interface FastifyInstance {
    transationService: TransactionService;
  }
}
