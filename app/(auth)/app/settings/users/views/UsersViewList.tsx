"use client";

import ListViewTemplate from "@/components/templates/ListViewTemplate";
import { User } from "@/libs/definitions";

function UserViewList({
  page,
  perPage,
  total,
  users,
}: {
  page: number;
  perPage: number;
  total: number;
  users: User[];
}) {
  return (
    <ListViewTemplate
      title="usuarios"
      viewForm="/app/settings/users?view_mode=form&id=null"
      basePath="/app/settings/users?view_mode=list&page=1"
      page={page} // Default to page 1
      perPage={perPage} // Default to 50 items per page
      total={total} // Default to 0 total items
    >
      <div className="p-3">
        {users.map((user) => (
          <div key={user.id} className="mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <span>{user.userName}</span>
              <span>{user.email}</span>
            </div>
            <div className="text-muted small">
              {user.Partner ? user.Partner.name : "No Partner"}
            </div>
          </div>
        ))}
      </div>
    </ListViewTemplate>
  );
}

export default UserViewList;
