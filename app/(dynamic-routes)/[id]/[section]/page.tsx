import { notFound } from "next/navigation";
import PageEditor from "@/pages/PageEditor";
import { getPage } from "ditwaru-aws-helpers";

interface PageProps {
  params: Promise<{ id: string; section: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, section } = await params;

  try {
    const pageData = await getPage(id, section);

    if (!pageData) {
      notFound();
    }

    return <PageEditor pageData={pageData} tableName={id} pageId={section} />;
  } catch (error) {
    console.error("Error fetching page:", error);
    notFound();
  }
}
