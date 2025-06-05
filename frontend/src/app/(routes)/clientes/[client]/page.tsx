import { columns } from "@/screens/client-transactions/table/client-transaction-columns";
import { ClientTransactionTable } from "@/screens/client-transactions/table/client-transaction-table";
import { fetchTransactions } from "@/services/transaction";

export default async function Home({
  params,
}: {
  params: Promise<{ client: string }>;
}) {
  const { client } = await params;
  const res = await fetchTransactions(client);
  return (
    <section>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Perfil do Cliente</h2>

        <p className="mb-4">
          Aqui você pode visualizar as transações do cliente selecionado.
        </p>
      </div>
      <ClientTransactionTable
        clientId={client}
        initialData={res?.results ?? []}
        columns={columns}
        metaData={res?.meta ?? { page: 1, limit: 10, total: 0 }}
      />
    </section>
  );
}
