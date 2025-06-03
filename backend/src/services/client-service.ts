import { Client, PrismaClient } from "../../generated/prisma";
import { CreateClientDto } from "../schemas/clients/create-client-schema";
import { GetClientsQuery } from "../schemas/clients/query-client-schema";
import { FastifyInstance } from "fastify";
import { UpdateClientDto } from "../schemas/clients/update-client-schema";
import { QueryBuilder } from "../utils/queryBuilder";
import { HttpError } from "@fastify/sensible";

export interface ClientServiceDeps {
  prisma: PrismaClient;
  httpErrors: FastifyInstance["httpErrors"];
  log: FastifyInstance["log"];
}

/**
 * Serviço responsável por gerenciar operações relacionadas aos clientes,
 * incluindo criação, recuperação, atualização, alteração de status e exclusão.
 * Utiliza o PrismaClient para interagir com o banco de dados.
 */
export class ClientService {
  constructor(private readonly fastify: FastifyInstance) {}

  /**
   * Cria um novo cliente no banco de dados.
   *
   * @param data - Dados do cliente contendo nome e e-mail.
   * @returns Uma promise que resolve para o objeto do cliente criado.
   * @throws Lança um erro se a criação do cliente falhar.
   */
  async create(data: CreateClientDto) {
    const existingClient = await this.fastify.prisma.client.findUnique({
      where: { email: data.email },
    });
    if (existingClient) {
      return this.fastify.httpErrors.conflict("Cliente com este e-mail já existe");
    }

    try {
      const client = await this.fastify.prisma.client.create({
        data: {
          name: data.name,
          email: data.email,
        },
      });

      return {
        client,
        message: "Cliente criado com sucesso",
      };
    } catch (error) {
      console.log(this.fastify.log);
      this.fastify.log.error("Erro ao criar cliente:", error);
      return this.fastify.httpErrors.internalServerError("Falha ao criar cliente");
    }
  }

  /**
   * Recupera todos os clientes do banco de dados.
   *
   * @returns Uma promise que resolve para um array de clientes.
   * @throws Lança um erro se a busca pelos clientes falhar.
   */
  /**
   * Recupera uma lista paginada de clientes com base nos parâmetros de consulta fornecidos.
   *
   * @param getClientsQuery - Parâmetros de consulta para recuperação dos clientes, incluindo paginação, ordenação e opções de busca.
   * @returns Um objeto contendo metadados de paginação e a lista de clientes encontrados.
   *
   * @throws {Error} Lança um erro se não for possível recuperar os clientes.
   */
  async findAll(getClientsQuery: GetClientsQuery): Promise<
    | {
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        results: Client[];
      }
    | HttpError
  > {
    try {
      console.log("getClientsQuery", getClientsQuery);
      const query = new QueryBuilder(getClientsQuery)
        .search(["name", "email"])
        .paginate()
        .order()
        .build();

      const total = await this.fastify.prisma.client.count({
        where: query.where,
      });

      const totalPages = Math.ceil(total / getClientsQuery.limit);

      const results = await this.fastify.prisma.client.findMany(query);

      return {
        meta: {
          page: getClientsQuery.page,
          limit: getClientsQuery.limit,
          total,
          totalPages,
        },
        results,
      };
    } catch (error) {
      this.fastify.log.error("Erro ao buscar clientes:", error);
      return this.fastify.httpErrors.internalServerError(
        "Falha ao buscar clientes"
      );
    }
  }

  /**
   * Recupera um cliente pelo seu identificador único.
   *
   * @param id - Identificador único do cliente.
   * @returns Uma promise que resolve para o cliente encontrado ou `null` se não encontrado.
   * @throws Lança um erro se a busca falhar.
   */
  async findById(id: string) {
    try {
      const client = await this.fastify.prisma.client.findUnique({
        where: { id },
      });
      // Verifica se o cliente foi encontrado
      if (!client) {
        return this.fastify.httpErrors.notFound("Cliente não encontrado");
      }
      return client;
    } catch (error) {
      this.fastify.log.error("Erro ao buscar cliente por ID:", error);
      throw this.fastify.httpErrors.internalServerError(
        "Falha ao buscar cliente"
      );
    }
  }

  async findClientAssets(id: string) {
    try {
      const client = await this.fastify.prisma.client.findUnique({
        where: { id },
      });
      if (!client) {
        return this.fastify.httpErrors.notFound("Cliente não encontrado");
      }
      return client;
    } catch (error) {
      this.fastify.log.error("Erro ao buscar cliente por ID:", error);
      return this.fastify.httpErrors.internalServerError(
        "Falha ao buscar cliente"
      );
    }
  }

  /**
   * Recupera um cliente pelo e-mail.
   *
   * @param email - E-mail do cliente.
   * @returns Uma promise que resolve para o cliente encontrado ou `null` se não existir.
   * @throws Lança um erro se a busca falhar.
   */
  async findByEmail(email: string) {
    try {
      const client = await this.fastify.prisma.client.findUnique({
        where: { email },
      });
      if (!client) {
        return this.fastify.httpErrors.notFound("Cliente não encontrado");
      }
      return client;
    } catch (error) {
      this.fastify.log.error("Erro ao buscar cliente por e-mail:", error);
      return this.fastify.httpErrors.internalServerError(
        "Falha ao buscar cliente"
      );
    }
  }

  /**
   * Atualiza um cliente existente com os dados fornecidos.
   *
   * @param id - Identificador único do cliente.
   * @param data - Dados para atualização do cliente.
   * @returns Uma promise que resolve para o cliente atualizado.
   * @throws Lança um erro se a atualização falhar.
   */
  async update(id: string, data: UpdateClientDto) {
    try {
      const existingClient = await this.fastify.prisma.client.findUnique({
        where: { id },
      });
      if (!existingClient) {
        return this.fastify.httpErrors.notFound("Cliente não encontrado");
      }
      // Verifica se o e-mail já está em uso por outro cliente
      if (data.email) {
        const emailExists = await this.fastify.prisma.client.findUnique({
          where: { email: data.email },
        });

        if (emailExists && emailExists.id !== id) {
          return this.fastify.httpErrors.conflict(
            "E-mail já está em uso por outro cliente"
          );
        }
      }

      const clientUpdated = this.fastify.prisma.client.update({
        where: { id },
        data,
      });
      return {
        client: clientUpdated,
        message: "Cliente atualizado com sucesso",
      };
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      return this.fastify.httpErrors.internalServerError(
        "Falha ao atualizar cliente"
      );
    }
  }

  /**
   * Alterna o status de um cliente entre "ACTIVE" e "INACTIVE".
   *
   * @param id - Identificador único do cliente.
   * @returns Uma promise que resolve para o cliente com status atualizado.
   * @throws Lança um erro se o cliente não for encontrado ou se a atualização falhar.
   */
  async toggleStatus(id: string) {
    try {
      const client = await this.fastify.prisma.client.findUnique({
        where: { id },
      });

      if (!client) {
        return this.fastify.httpErrors.notFound("Cliente não encontrado");
      }

      const clientUpdated = await this.fastify.prisma.client.update({
        where: { id },
        data: {
          status: client.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        },
      });
      return {
        client: clientUpdated,
        message: `Status do cliente alterado para ${clientUpdated.status}`,
      };
    } catch (error) {
      return this.fastify.httpErrors.internalServerError(
        "Falha ao alterar status do cliente"
      );
    }
  }

  /**
   * Exclui um cliente pelo seu identificador único.
   *
   * @param id - Identificador único do cliente.
   * @returns Uma promise que resolve para o cliente excluído.
   * @throws Lança um erro se o cliente não for encontrado ou se a exclusão falhar.
   */
  async delete(id: string) {
    try {
      const client = await this.fastify.prisma.client.findUnique({
        where: { id },
      });
      if (!client) {
        return this.fastify.httpErrors.notFound("Cliente não encontrado");
      }
      await this.fastify.prisma.client.delete({
        where: { id },
      });
      return {
        message: "Cliente excluído com sucesso",
      };
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      return this.fastify.httpErrors.internalServerError(
        "Falha ao excluir cliente"
      );
    }
  }
}
