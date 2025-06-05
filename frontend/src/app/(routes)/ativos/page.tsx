import { AssetsTable } from "@/screens/assets/table/asset-table";
import { columns } from "@/screens/assets/table/assets-table-columns";
import { fetchAsset } from "@/services/asset";

export default async function Home() {
  const res = await fetchAsset();
  return (
    <section>
      <AssetsTable
        initialData={res?.results ?? []}
        columns={columns}
        metaData={res?.meta ?? { page: 1, limit: 10, total: 0 }}
      />
    </section>
  );
}
