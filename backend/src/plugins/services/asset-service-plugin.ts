import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { AssetService } from "../../services/asset-service";

const assetServicePlugin: FastifyPluginAsync = async (fastify) => {
  const assetService = new AssetService({
    prisma: fastify.prisma,
    httpErrors: fastify.httpErrors,
    log: fastify.log,
  });

  fastify.decorate("assetService", assetService);
};

export default fp(assetServicePlugin, {
  name: "assetService",
  dependencies: ["prisma"],
});

declare module "fastify" {
  interface FastifyInstance {
    assetService: AssetService;
  }
}
