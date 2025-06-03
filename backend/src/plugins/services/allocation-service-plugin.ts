import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { AllocationService } from "../../services/allocations-service";

const allocationServicePlugin: FastifyPluginAsync = async (fastify) => {
  const allocationService = new AllocationService({
    prisma: fastify.prisma,
    httpErrors: fastify.httpErrors,
    log: fastify.log,
  });

  fastify.decorate("allocationService", allocationService);
};

export default fp(allocationServicePlugin, {
  name: "allocationService",
  dependencies: ["prisma"],
});

declare module "fastify" {
  interface FastifyInstance {
    allocationService: AllocationService;
  }
}
