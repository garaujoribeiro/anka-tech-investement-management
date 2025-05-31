import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

// Models
TODO

// Services
TODO

// Controllers
TODO



const dependenciesPlugin: FastifyPluginAsync = async (fastify) => {
  // 1. Database (primeira camada)
  const prisma = new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

  // Registrar Prisma como decorator
  fastify.decorate("prisma", prisma);

  // 2. Models (segunda camada - dependem do banco)
  const clientModel = new ClientModel(prisma);
  const assetModel = new AssetModel();

  fastify.decorate("clientModel", clientModel);
  fastify.decorate("assetModel", assetModel);

  // 3. Services (terceira camada - dependem dos models)
  const clientService = new ClientService(clientModel);
  const assetService = new AssetService(assetModel);

  fastify.decorate("clientService", clientService);
  fastify.decorate("assetService", assetService);

  // 4. Controllers (quarta camada - dependem dos services)
  const clientController = new ClientController(clientService);
  const assetController = new AssetController(assetService);

  fastify.decorate("clientController", clientController);
  fastify.decorate("assetController", assetController);

  // Hooks para gerenciar conexão do banco
  fastify.addHook("onReady", async () => {
    try {
      await fastify.prisma.$connect();
      fastify.log.info("✅ Database connected successfully");
    } catch (error) {
      fastify.log.error("❌ Failed to connect to database:", error);
      throw error;
    }
  });

  fastify.addHook("onClose", async (instance) => {
    try {
      await instance.prisma.$disconnect();
      fastify.log.info("✅ Database disconnected successfully");
    } catch (error) {
      fastify.log.error("❌ Error disconnecting from database:", error);
    }
  });
};

export default fp(dependenciesPlugin, {
  name: "dependencies",
  dependencies: [],
});

// Tipagens para os decorators
declare module "fastify" {
  interface FastifyInstance {
    // Database
    prisma: PrismaClient;

    // Models
    clientModel: ClientModel;
    assetModel: AssetModel;

    // Services
    clientService: ClientService;
    assetService: AssetService;

    // Controllers
    clientController: ClientController;
    assetController: AssetController;
  }
}