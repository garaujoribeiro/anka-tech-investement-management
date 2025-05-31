import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const healthPlugin: FastifyPluginAsync = async (fastify) => {
  // Health check usando decorators
  fastify.get("/health", async (request, reply) => {
    try {
      // Usar Prisma via decorator
      await fastify.prisma.$queryRaw`SELECT 1`;

      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        database: "connected",
        version: "1.0.0",
      };
    } catch (error) {
      return reply.status(503).send({
        status: "error",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: "Database connection failed",
      });
    }
  });

  // Rota de debug para listar dependências disponíveis
  fastify.get("/debug/dependencies", async () => {
    return {
      availableDependencies: [
        "prisma",
        "clientModel",
        "assetModel",
        "clientService",
        "assetService",
        "clientController",
        "assetController",
      ],
      message: "Todas as dependências estão registradas via decorators",
    };
  });
};

// Plugin de health check
export default fp(healthPlugin, {
  name: "health",
  dependencies: ["dependencies"], // Depende do plugin de dependências
});
