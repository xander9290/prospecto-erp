"use server";

import NotFound from "@/app/not-found";
// import prisma from "@/libs/prisma";
import UserViewList from "./UsersViewList";
import UserViewForm from "./UsersViewForm";
import prisma from "@/libs/prisma";

async function PageUsersMainView({
  view_mode,
  page = 1, // Default to page 1 if not provided
  search = undefined, // Default to undefined if not provided
}: {
  page: number;
  search: string | undefined;
  view_mode: string;
}) {
  const p = page || 1;
  const perPage = 50;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { userName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          {
            relatedPartner: { name: { contains: search, mode: "insensitive" } },
          },
        ],
      },
      skip: (p - 1) * perPage,
      take: perPage,
      orderBy: { id: "asc" },
      include: {
        relatedPartner: true,
      },
    }),
    prisma.user.count(),
  ]);

  if (view_mode === "list") {
    return (
      <UserViewList page={page} perPage={perPage} total={total} users={users} />
    );
  } else if (view_mode === "form") {
    return <UserViewForm />;
  } else {
    return <NotFound />;
  }
}

export default PageUsersMainView;
