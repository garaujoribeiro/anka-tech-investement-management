"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Client, ClientStatus } from "@/services/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import EditClientDialog from "../dialogs/edit-client-dialog";
import ClientToggleStatusDialog from "../dialogs/toggle-status-dialog";
import DeleteClientDialog from "../dialogs/delete-dialog";
import Link from "next/link";

export enum ModalType {
  "EDITAR" = 1,
  "ATIVAR" = 2,
  "DELETAR" = 3,
  "CONECTAR" = 4,
}

export const columns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    size: 400,
    id: "Nome",
    cell: function ({
      row: {
        original: { name, id },
      },
    }) {
      return (
        <Button asChild variant="link">
          <Link href={`/clientes/${id}`}>{name}</Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    id: "E-mail",
    header: "E-mail",
    size: 400,
  },
  {
    accessorKey: "status",
    id: "Status",
    header: "Status",
    size: 100,
    cell: function ({
      row: {
        original: { status },
      },
    }) {
      return (
        <span>{status === ClientStatus.ACTIVE ? "Ativo" : "Inativo"}</span>
      );
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row: { original: client } }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem asChild>
              <EditClientDialog client={client} />
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <ClientToggleStatusDialog client={client} />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <DeleteClientDialog client={client} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
