import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { ClientService } from "../../services/client-service";

const clientServicePlugin: FastifyPluginAsync = async (fastify) => {
  const clientService = new ClientService(fastify);

  fastify.decorate("clientService", clientService);
};

export default fp(clientServicePlugin, {
  name: "clientService",
  dependencies: ["prisma", "@fastify/sensible"],
});

declare module "fastify" {
  interface FastifyInstance {
    clientService: ClientService;
  }
}
