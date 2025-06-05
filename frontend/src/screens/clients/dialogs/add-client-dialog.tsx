"use client";

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
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateClientDto,
  createClientSchema,
} from "@/schemas/create-client-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/services/client";
import { toast } from "sonner";
import { getErrorMessage } from "@/utils/get-error-message";
import { clientQueryKeys } from "@/queries/client-queryKey";

export default function AddClientDialog() {
  const form = useForm<CreateClientDto>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      email: "",
      name: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateClientDto) => {
      return await createClient(data);
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
        <Button size="sm" variant="outline">
          <PlusIcon />
          <span>Adicionar Cliente</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
          <DialogDescription>
            Preencha os detalhes do cliente para adicionar um novo registro.
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
