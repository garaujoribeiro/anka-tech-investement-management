import { Client, PrismaClient } from "../../generated/prisma";
import { CreateClientDto } from "../dto/create-client-dto";
import { UpdateClientDto } from "../dto/update-client-dto";

/**
 * A classe ClientModel fornece métodos de acesso a dados para gerenciar registros de clientes no banco de dados.
 * Esta classe encapsula todas as operações CRUD e lógica de negócio relacionadas às entidades de cliente.
 * 
 * @class ClientModel
 * @description Lida com operações de banco de dados para gerenciamento de clientes incluindo criação, recuperação, atualizações e gerenciamento de status
 * 
 * @example
 * ```typescript
 * const prisma = new PrismaClient();
 * const clientModel = new ClientModel(prisma);
 * 
 * // Criar um novo cliente
 * const newClient = await clientModel.create({
 *   name: "João Silva",
 *   email: "joao@exemplo.com"
 * });
 * 
 * // Buscar todos os clientes
 * const allClients = await clientModel.findAll();
 * 
 * // Alternar status do cliente
 * await clientModel.toggleStatus(newClient.id);
 * ```
 */
export class ClientModel {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Cria um novo cliente no banco de dados.
   * 
   * @param data - Os dados do cliente contendo informações de nome e email
   * @returns Uma promise que resolve para o objeto cliente criado
   * @throws {Error} Lança um erro se a criação do cliente falhar
   * 
   * @example
   * ```typescript
   * const newClient = await clientModel.create({
   *   name: "João Silva",
   *   email: "joao.silva@exemplo.com"
   * });
   * ```
   */
  async create(data: CreateClientDto) {
    try {
      return await this.prisma.client.create({
        data: {
          name: data.name,
          email: data.email,
        },
      });
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw new Error("Falha ao criar cliente");
    }
  }

  /**
   * Recupera todos os clientes do banco de dados.
   * 
   * @returns {Promise<Client[]>} Uma promise que resolve para um array de todos os registros de cliente
   * @throws {Error} Lança um erro com a mensagem "Falha ao buscar clientes" se a operação do banco de dados falhar
   * 
   * @example
   * ```typescript
   * const clients = await clientModel.findAll();
   * console.log(clients); // Array de objetos cliente
   * ```
   */
  async findAll(): Promise<Client[]> {
    try {
      return await this.prisma.client.findMany();
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
      throw new Error("Falha ao buscar clientes");
    }
  }

  /**
   * Encontra um cliente pelo seu identificador único.
   * 
   * @param id - O identificador único do cliente a ser recuperado
   * @returns Uma Promise que resolve para o objeto cliente se encontrado, ou null se não encontrado
   * @throws {Error} Lança um erro com a mensagem "Falha ao buscar cliente" se a operação do banco de dados falhar
   * 
   * @example
   * ```typescript
   * const client = await clientModel.findById("client-123");
   * if (client) {
   *   console.log(client.name);
   * }
   * ```
   */
  async findById(id: string) {
    try {
      return await this.prisma.client.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("Erro ao buscar cliente por ID:", error);
      throw new Error("Falha ao buscar cliente");
    }
  }

  /**
   * Encontra um cliente pelo seu endereço de email.
   * 
   * @param email - O endereço de email a ser pesquisado
   * @returns Uma Promise que resolve para o objeto cliente se encontrado, ou null se não encontrado
   * @throws {Error} Lança um erro com a mensagem "Falha ao buscar cliente" se a operação do banco de dados falhar
   * 
   * @example
   * ```typescript
   * const client = await clientModel.findByEmail("usuario@exemplo.com");
   * if (client) {
   *   console.log("Cliente encontrado:", client.name);
   * } else {
   *   console.log("Cliente não encontrado");
   * }
   * ```
   */
  async findByEmail(email: string) {
    try {
      return await this.prisma.client.findUnique({
        where: { email },
      });
    } catch (error) {
      console.error("Erro ao buscar cliente por email:", error);
      throw new Error("Falha ao buscar cliente");
    }
  }

  /**
   * Atualiza um registro de cliente existente no banco de dados.
   * 
   * @param id - O identificador único do cliente a ser atualizado
   * @param data - Os dados do cliente a serem atualizados, contendo apenas os campos que devem ser modificados
   * @returns Uma promise que resolve para o objeto cliente atualizado
   * @throws {Error} Lança um erro com a mensagem "Falha ao atualizar cliente" se a operação de atualização falhar
   * 
   * @example
   * ```typescript
   * const updatedClient = await clientModel.update("client-123", {
   *   name: "João Silva",
   *   email: "joao.silva@exemplo.com"
   * });
   * ```
   */
  async update(id: string, data: UpdateClientDto) {
    try {
      return await this.prisma.client.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      throw new Error("Falha ao atualizar cliente");
    }
  }

  /**
   * Alterna o status de um cliente entre ATIVO e INATIVO.
   * 
   * @param id - O identificador único do cliente para alternar o status
   * @returns Promise que resolve para o objeto cliente atualizado com o novo status
   * @throws {Error} Quando o cliente com o ID especificado não é encontrado
   * @throws {Error} Quando a operação de atualização de status falha
   * 
   * @example
   * ```typescript
   * const updatedClient = await clientModel.toggleStatus('client-123');
   * console.log(updatedClient.status); // 'ACTIVE' ou 'INACTIVE'
   * ```
   */
  async toggleStatus(id: string) {
    try {
      // Assumindo que queremos alternar um campo de status, ex.: 'isActive'
      const client = await this.prisma.client.findUnique({
        where: { id },
      });
      if (!client) {
        throw new Error("Cliente não encontrado");
      }
      return await this.prisma.client.update({
        where: { id },
        data: {
          status: client.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        },
      });
    } catch (error) {
      console.error("Erro ao alterar status do cliente:", error);
      throw new Error("Falha ao alterar status do cliente");
    }
  }
}
