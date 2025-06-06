import { FastifyPluginAsync } from "fastify";
import {
  GetClientsQuery,
  getClientsQuerySchema,
} from "../schemas/clients/query-client-schema";
import { z } from "zod";
import {
  CreateClientDto,
  createClientSchema,
} from "../schemas/clients/create-client-schema";
import { UpdateClientDto } from "../schemas/clients/update-client-schema";
import { HttpError } from "@fastify/sensible";
import {
  GetTransactionsQuery,
  getTransactionsQuerySchema,
} from "../schemas/transactions/query-transaction-schema";
import {
  CreateTransactionDto,
  createTransactionSchema,
} from "../schemas/transactions/create-transaction-schema";
import { Prisma } from "../../generated/prisma";

const clients: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
  fastify.get(
    "/",
    {
      schema: {
        querystring: getClientsQuerySchema,
        response: {
          200: z.object({
            meta: z.object({
              page: z.number(),
              limit: z.number(),
              total: z.number(),
            }),

            // criar um esquema para o client
            results: z.array(z.any()),
          }),
        },
      },
    },
    async function (request, reply) {
      const getClientsQuery = request.query as GetClientsQuery;
      const results = await fastify.clientService.findAll(getClientsQuery);
      return reply.send(results);
    }
  );

  // rota para receber um cliente específico
  fastify.get("/:id", async function (request, reply) {
    const { id } = request.params as { id: string };
    const response = await fastify.clientService.findById(id);
    return reply.send(response);
  });

  // rota para criar um novo cliente
  fastify.post(
    "/",
    {
      schema: {
        body: createClientSchema,
        response: {
          201: z.object({
            user: z.any(), // Defina o esquema do cliente aqui
            message: z.string(),
          }),
        },
      },
    },
    async function (request, reply) {
      const clientData = request.body as CreateClientDto;
      const newClientResponse = await fastify.clientService.create(clientData);
      if (newClientResponse instanceof HttpError) {
        return reply
          .status(newClientResponse.statusCode)
          .send(newClientResponse);
      }
      return reply.status(201).send(newClientResponse);
    }
  );

  // rota para atualizar um cliente existente
  fastify.put(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "O id do cliente é obrigatório"),
        }),
        response: {
          200: z.object({
            client: z.any(), // Defina o esquema do cliente atualizado aqui
            message: z.string(),
          }),
        },
      },
    },
    async function (request, reply) {
      const { id } = request.params as { id: string };
      const clientData = request.body as UpdateClientDto;
      console.log(clientData);
      try {
        const updateClientResponse = await fastify.clientService.update(
          id,
          clientData
        );
        return reply.send(updateClientResponse);
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: "Falha ao atualizar o cliente" });
      }
    }
  );

  // rota para alternar o status de um cliente
  fastify.put(
    "/toggle-status/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "O id do cliente é obrigatório"),
        }),
        response: {
          200: z.object({
            client: z.any(), // Defina o esquema do cliente atualizado aqui
            message: z.string(),
          }),
        },
      },
    },
    async function (request, reply) {
      const { id } = request.params as { id: string };
      try {
        const toggleClientResponse = await fastify.clientService.toggleStatus(
          id
        );
        return reply.send(toggleClientResponse);
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: "Failed to toggle client status" });
      }
    }
  );

  fastify.get(
    "/:id/transactions",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "O id do cliente é obrigatório"),
        }),
        querystring: getTransactionsQuerySchema,
      },
    },
    async function (request, reply) {
      const { id } = request.params as { id: string };
      const query = request.query as GetTransactionsQuery;
      try {
        const response = await fastify.clientService.findClientTransactions({
          id,
          params: query,
        });
        return reply.send(response);
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: "Falha ao puxar transacao" });
      }
    }
  );

  fastify.post(
    "/:id/transactions",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "O id do cliente é obrigatório"),
        }),
        body: createTransactionSchema,
      },
    },
    async function (request, reply) {
      const { id } = request.params as { id: string };
      const body = request.body as CreateTransactionDto;
      try {
        const response = await this.transactionService.create({
          assetId: body.assetId,
          clientId: id,
          type: body.type,
          quantity: new Prisma.Decimal(body.quantity),
        });
        return reply.send(response);
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: "Falha ao criar transacao" });
      }
    }
  );

  // rota para deletar um cliente
  fastify.delete(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().min(1, "O id do cliente é obrigatório"),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async function (request, reply) {
      const { id } = request.params as { id: string };
      try {
        const deleteClientResponse = await fastify.clientService.delete(id);
        return reply.status(200).send(deleteClientResponse);
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({ error: "Failed to delete client" });
      }
    }
  );
};

export default clients;

// prefixo para as rotas
module.exports.autoPrefix = "/clients";
