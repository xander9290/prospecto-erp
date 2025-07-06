import NotFound from "@/app/not-found";
import prisma from "@/libs/prisma";
import UserViewList from "./UsersViewList";
import UserViewForm from "./UsersViewForm";

async function PageUsersMainView({
  page,
  view_mode,
}: {
  page: number;
  view_mode: string;
}) {
  const p = page;
  const perPage = 50;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip: (p - 1) * perPage,
      take: perPage,
      orderBy: { id: "asc" },
      include: {
        Partner: true,
        Request: true,
      },
    }),
    prisma.user.count(),
  ]);

  if (view_mode === "list") {
    return <UserViewList users={users ?? []} />;
  } else if (view_mode === "form") {
    return <UserViewForm />;
  } else {
    return <NotFound />;
  }
}

export default PageUsersMainView;
