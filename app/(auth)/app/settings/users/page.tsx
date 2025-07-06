import React, { Suspense } from "react";
import PageUsersMainView from "./views/UsersMainView";
import LoadingPage from "@/app/LoadingPage";

async function PageUsers({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { view_mode, page } = await searchParams;

  return (
    <Suspense fallback={<LoadingPage />}>
      <PageUsersMainView page={parseInt(page)} view_mode={view_mode} />
    </Suspense>
  );
}

export default PageUsers;
