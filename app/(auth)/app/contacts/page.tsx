import LoadingPage from "@/app/LoadingPage";
import { Suspense } from "react";
import ContactsMainView from "./views/ContactsMainView";
import { PartnerType } from "@/generate/prisma";

async function PageContacts({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { view_mode, page, search, filter } = await searchParams;

  return (
    <Suspense fallback={<LoadingPage />}>
      <ContactsMainView
        viewMode={view_mode}
        page={parseInt(page)}
        search={search}
        filter={filter as unknown as PartnerType}
      />
    </Suspense>
  );
}

export default PageContacts;
