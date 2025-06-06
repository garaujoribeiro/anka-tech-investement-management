import { join } from "node:path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyServerOptions } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import allocationPluginService from "./plugins/services/04-allocation-service-plugin";
import assetServicePlugin from "./plugins/services/05-asset-service-plugin";
import transactionServicePlugin from "./plugins/services/06-transaction-service-plugin";
import clientServicePlugin from "./plugins/services/07-client-service-plugin";

export interface AppOptions
  extends FastifyServerOptions,
    Partial<AutoloadPluginOptions> {}
// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  logger: true,
};

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);
  fastify.withTypeProvider<ZodTypeProvider>();

  fastify.log.info("Starting Anka Tech Investment Management API...");
  fastify.log.info("Registering plugins...");

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins/core"),
    options: opts,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins/db"),
    options: opts,
  });

  void fastify.register(allocationPluginService);

  void fastify.register(assetServicePlugin);

  void fastify.register(transactionServicePlugin);

  void fastify.register(clientServicePlugin);

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });

  fastify.log.info("fastify instance:", fastify);
};

export default app;
export { app, options };
