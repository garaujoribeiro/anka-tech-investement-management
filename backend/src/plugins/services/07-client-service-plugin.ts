import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { ClientService } from "../../services/client-service";

const clientServicePlugin: FastifyPluginAsync = async (fastify) => {
  console.log("Iniciando plugin clientServicePlugin");
  if (!fastify.prisma) {
    throw new Error("Prisma client is not available");
  }
  if (!fastify.httpErrors) {
    throw new Error("HTTP Errors plugin is not available");
  }
  if (!fastify.log) {
    throw new Error("Logger plugin is not available");
  }
  if (!fastify.transactionService) {
    throw new Error("Transaction Service plugin is not available");
  }
  console.log("Todos os plugins necessários estão disponíveis");
  fastify.decorate("clientService", new ClientService(fastify));

  fastify.addHook("onReady", () => {
    console.log("Plugins carregados:");
    console.log("httpErrors:", typeof fastify.httpErrors);
    console.log("log:", typeof fastify.log);
    console.log("prisma:", typeof fastify.prisma);
  });
};

export default fp(clientServicePlugin, {
  name: "clientService",
  dependencies: ["prisma", "@fastify/sensible", "transactionService"],
});

declare module "fastify" {
  interface FastifyInstance {
    clientService: ClientService;
  }
}
