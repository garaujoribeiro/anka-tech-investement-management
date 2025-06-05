import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { clientQueryKeys } from "@/queries/client-queryKey";
import { Client, ClientStatus, toggleClientStatus } from "@/services/client";
import { getErrorMessage } from "@/utils/get-error-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ClientToggleStatusDialog({
  client,
}: {
  client: Client;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm();

  const mutation = useMutation({
    mutationFn: async () => {
      return await toggleClientStatus(client.id);
    },
    onError(error) {
      toast.error(getErrorMessage(error));
    },
    onSuccess(response) {
      if (response?.data?.message) {
        setModalOpen(false);
        toast.success(response.data.message);
      }
      queryClient.refetchQueries({
        queryKey: clientQueryKeys.list(),
      });
    },
  });

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button
          className="font-normal w-full justify-start"
          size="sm"
          variant="ghost"
        >
          {client.status === ClientStatus.ACTIVE ? "Desativar" : "Ativar"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {client.status === ClientStatus.ACTIVE ? "Desativar" : "Ativar"}{" "}
            Cliente
          </DialogTitle>
          <DialogDescription className="sr-only">
            {client.status === ClientStatus.ACTIVE
              ? "Desative este cliente para impedir o acesso aos serviços."
              : "Ative este cliente para permitir o acesso aos serviços."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(() => {
            mutation.mutate();
          })}
          className="space-y-4"
        >
          <span className="block text-sm text-muted-foreground">
            {client.status === ClientStatus.ACTIVE
              ? "Tem certeza de que deseja desativar este cliente?"
              : "Tem certeza de que deseja ativar este cliente?"}
          </span>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
