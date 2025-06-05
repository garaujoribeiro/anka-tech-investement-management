"use client";

import { Transaction } from "@/services/transaction";
import { ColumnDef } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import Big from "big.js";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "Data",
    header: "Nome",
    size: 100,
    id: "Data",
    cell: ({
      row: {
        original: { date },
      },
    }) => {
      const newDate = new Date(date);
      return isValid(newDate) ? format(newDate, "dd/MM/yyyy") : "Data inválida";
    },
  },
  {
    accessorKey: "asset.name",
    header: "Ativo",
    id: "Ativo",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    id: "Tipo",
  },
  {
    accessorKey: "price",
    header: "Preço/Unidade",
    cell: ({
      row: {
        original: { price },
      },
    }) => {
      return isNaN(Number(price))
        ? "R$ " + price
        : "R$ " + new Big(price).toFixed(2);
    },
    id: "Preço/Unidade",
  },
  {
    accessorKey: "quantity",
    header: "Quantidade",
    cell: ({
      row: {
        original: { quantity },
      },
    }) => {
      return isNaN(Number(quantity)) ? quantity : new Big(quantity).toFixed(2);
    },
    id: "Quantidade",
  },
  {
    accessorKey: "",
    header: "Valor total",
    cell: ({
      row: {
        original: { quantity, price },
      },
    }) => {
      return isNaN(Number(quantity)) && isNaN(Number(price))
        ? "Valor inválido"
        : `R$ ${new Big(parseFloat(quantity)).times(price).toFixed(2)}`;
    },
    id: "Valor total",
  },
];
