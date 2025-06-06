import fp from "fastify-plugin";
import { PrismaClient } from "../../../generated/prisma";
import { FastifyPluginAsync } from "fastify";

const prismaPlugin: FastifyPluginAsync = async (fastify) => {
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    fastify.log.info("✅ Conectado ao banco com Prisma");
  } catch (err) {
    fastify.log.error(err);
    throw new Error("Falha ao conectar com o banco de dados");
  }

  fastify.decorate("prisma", prisma);

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
