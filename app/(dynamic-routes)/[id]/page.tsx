import AppOverview from "@/pages/AppOverview";
import { get } from "ditwaru-aws-helpers";
import { notFound } from "next/navigation";

interface AppPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AppPage({ params }: AppPageProps) {
  const { id } = await params;

  try {
    const pages = await get(id);

    return <AppOverview data={pages} tableName={id} />;
  } catch (error) {
    console.error(`Error fetching data for app ${id}:`, error);
    notFound();
  }
}
