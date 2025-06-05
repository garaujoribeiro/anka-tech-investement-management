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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clientQueryKeys } from "@/queries/client-queryKey";
import {
  UpdateClientDto,
  updateClientSchema,
} from "@/schemas/update-client-schema";
import { Client, updateClient } from "@/services/client";
import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditClientDialog({ client }: { client: Client }) {
  const form = useForm<UpdateClientDto>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      email: client.email || "",
      name: client.name || "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdateClientDto) => {
      return await updateClient({ id: client.id, client: data });
    },
    onError(error) {
      toast.error(getErrorMessage(error));
    },
    onSuccess(response) {
      if (response?.data?.message) {
        toast.success(response.data.message);
      }
      queryClient.refetchQueries({
        queryKey: clientQueryKeys.list(),
      });
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="font-normal w-full justify-start"
          size="sm"
          variant="ghost"
        >
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Atualize as informações do cliente.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              mutation.mutate(data);
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel className="base-text text-neutral-1100">
                    Nome
                  </FormLabel>
                  <FormControl {...field}>
                    <Input
                      aria-invalid={error ? "true" : "false"}
                      autoComplete="client-name"
                      placeholder={"John Doe"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <FormItem>
                  <FormLabel className="base-text text-neutral-1100">
                    Email
                  </FormLabel>
                  <FormControl {...field}>
                    <Input
                      aria-invalid={error ? "true" : "false"}
                      autoComplete="client-email"
                      placeholder={"johndoe@mail.com"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Salvar</Button>
              <DialogClose asChild>
                <Button variant="secondary">Cancelar</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
