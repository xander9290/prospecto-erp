"use client";

import ListViewTemplate from "@/components/templates/ListViewTemplate";

function UserViewList({
  page,
  perPage,
  total,
}: {
  page: number;
  perPage: number;
  total: number;
}) {
  const handleSearch = (key: string | undefined) => {
    console.log(key || "no hay busqueda");
  };
  return (
    <ListViewTemplate
      title="usuarios"
      viewForm="/app/settings/users?view_mode=form"
      basePath="/app/settings/users?view_mode=list"
      search={handleSearch}
      page={page} // Default to page 1
      perPage={perPage} // Default to 50 items per page
      total={total} // Default to 0 total items
    >
      <div className="p-3">
        <h1>Users List</h1>
        {/* Add your user list content here */}
        <p>This is where the user list will be displayed.</p>
      </div>
    </ListViewTemplate>
  );
}

export default UserViewList;
