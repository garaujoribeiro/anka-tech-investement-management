"use client";

import { Asset } from "@/services/asset";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    id: "Nome",
    size: 400,
  },
  {
    accessorKey: "symbol",
    header: "Sigla",
    id: "Sigla"
  },
  {
    accessorKey: "type",
    header: "Tipo",
    id: "Tipo",
  },

  {
    accessorKey: "currentValue",
    header: "Preço Atual",
    id: "Preço Atual",
  },
];
