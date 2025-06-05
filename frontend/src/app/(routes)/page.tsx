import { columns } from "@/screens/clients/table/clients-table-columns";
import { ClientsTable } from "@/screens/clients/table/client-table";
import { fetchClients } from "@/services/client";

export default async function Home() {
  const res = await fetchClients();
  return (
    <section>
      <ClientsTable
        initialData={res?.results ?? []}
        columns={columns}
        metaData={res?.meta ?? { page: 1, limit: 10, total: 0 }}
      />
    </section>
  );
}
