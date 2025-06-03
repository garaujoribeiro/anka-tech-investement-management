import fp from "fastify-plugin";
import { PrismaClient } from "../../../generated/prisma";
import { FastifyPluginAsync } from "fastify";

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    fastify.log.info("✅ Conectado ao banco com Prisma");
  } catch (err) {
    fastify.log.error("❌ Erro ao conectar com o banco via Prisma:", err);
    throw new Error("Falha ao conectar com o banco de dados");
  }

  // Register the Prisma client as a decorator
  fastify.decorate("prisma", prisma);

  // Ensure the Prisma client is closed when the Fastify instance is closed
  fastify.addHook("onClose", async (fastify) => {
    try {
      await fastify.prisma.$disconnect();
      fastify.log.info("✅ Database disconnected successfully");
    } catch (error) {
      fastify.log.error("❌ Error disconnecting from database:", error);
    }
  });
};

export default fp(prismaPlugin, {
  name: "prisma",
  dependencies: [],
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
