import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { AssetService } from "../../services/asset-service";

const assetServicePlugin: FastifyPluginAsync = async (fastify) => {
  const assetService = new AssetService(fastify);
  fastify.log.info("AssetService initialized");
  fastify.log.info("Fastify instance:", fastify);

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
