import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import {
  GetAssetsQuery,
  getAssetsQuerySchema,
} from "../schemas/assets/query-assets-schema";

const assets: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  console.log("Initializing assets routes...");
  // List all assets
  fastify.get(
    "/",
    {
      schema: {
        querystring: getAssetsQuerySchema,
        response: {
          200: z.object({
            meta: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
            }),
            results: z.array(z.any()), // Replace z.any() with your asset schema
          }),
        },
      },
    },
    async function (request, reply) {
      const getAssetsQuery = request.query as GetAssetsQuery;
      const results = await fastify.assetService.findAll(getAssetsQuery);
      return reply.send(results);
    }
  );

  // Get asset by id
  fastify.get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "O id do ativo é obrigatório"),
        }),
        response: {
          200: z.any(), // Replace z.any() with your asset schema
        },
      },
    },
    async function (request, reply) {
      const { id } = request.params as { id: string };
      const response = await fastify.assetService.findById(id);
      return reply.send(response);
    }
  );
};

export default assets;

// prefix for the routes
module.exports.autoPrefix = "/assets";
