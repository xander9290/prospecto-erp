import { Suspense, lazy } from "react";
import LoadingPage from "@/app/LoadingPage";

const PageUsersMainView = lazy(() => import("./views/UsersMainView"));

async function PageUsers({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { view_mode, page, search } = await searchParams;

  return (
    <Suspense fallback={<LoadingPage />}>
      <PageUsersMainView
        page={parseInt(page)}
        view_mode={view_mode}
        search={search}
      />
    </Suspense>
  );
}

export default PageUsers;
