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
import { Client, ClientStatus, deleteClient } from "@/services/client";
import { getErrorMessage } from "@/utils/get-error-message";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function DeleteClientDialog({ client }: { client: Client }) {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm();

  const mutation = useMutation({
    mutationFn: async () => {
      return await deleteClient(client.id);
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
    <Dialog onOpenChange={setModalOpen} open={modalOpen}>
      <DialogTrigger asChild>
        <Button
          className="font-normal w-full justify-start text-destructive hover:bg-destructive/10 focus:bg-destructive/10 hover:text-destructive"
          size="sm"
          variant="ghost"
        >
          Excluir
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Cliente</DialogTitle>
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
        >
          <span className="block text-sm text-muted-foreground">
            Tem certeza de que deseja excluir este cliente?
          </span>
          <DialogFooter>
            <Button
              className="text-destructive hover:text-destructive hover:bg-destructive/20"
              variant="ghost"
              type="submit"
            >
              Excluir
            </Button>

            <DialogClose asChild>
              <Button variant="default">Cancelar</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
