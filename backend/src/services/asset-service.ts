import { FastifyInstance } from "fastify";
import { Asset, PrismaClient } from "../../generated/prisma";
import { GetAssetsQuery } from "../schemas/assets/query-assets-schema";
import { QueryBuilder } from "../utils/queryBuilder";
import { HttpError } from "@fastify/sensible";

export interface AssetServiceDeps {
  prisma: PrismaClient;
  httpErrors: FastifyInstance["httpErrors"];
  log: FastifyInstance["log"];
}

/**
 * Classe AssetService para gerenciar entidades Asset no banco de dados.
 * Fornece métodos para consultar e recuperar dados de ativos usando Prisma ORM.
 */
export class AssetService {
  /**
   * Cria uma instância de AssetService.
   * @param prisma - A instância do cliente Prisma para operações de banco de dados
   */
  constructor(private deps: AssetServiceDeps) {}

  /**
   * Recupera todos os ativos do banco de dados.
   * @returns Uma promise que resolve para um array de todos os registros de ativos
   */
  async findAll(getAssetQuery: GetAssetsQuery): Promise<
    | {
        meta: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
        results: Asset[];
      }
    | HttpError
  > {
    try {
      const query = new QueryBuilder(getAssetQuery)
        .search(["name"])
        .paginate()
        .order()
        .build();

      const total = await this.deps.prisma.client.count({ where: query.where });

      const totalPages = Math.ceil(total / getAssetQuery.limit);

      const results = await this.deps.prisma.asset.findMany(query);

      return {
        meta: {
          page: getAssetQuery.page,
          limit: getAssetQuery.limit,
          total,
          totalPages,
        },
        results,
      };
    } catch (error) {
      this.deps.log.error("Erro ao buscar clientes:", error);
      return this.deps.httpErrors.internalServerError(
        "Falha ao buscar clientes"
      );
    }
  }

  /**
   * Recupera um ativo específico pelo seu identificador único.
   * @param id - O identificador único do ativo a ser recuperado
   * @returns Uma promise que resolve para o registro do ativo se encontrado, ou null se não encontrado
   */
  async findById(id: string) {
    try {
      const asset = await this.deps.prisma.asset.findUnique({
        where: { id },
      });
      if (!asset) {
        return this.deps.httpErrors.notFound("Ativo não encontrado");
      }
      return asset;
    } catch (error) {
      this.deps.log.error("Erro ao buscar cliente por ID:", error);
      return this.deps.httpErrors.internalServerError(
        "Falha ao buscar cliente"
      );
    }
  }
}
