"use client";

import { TFormState } from "@/components/templates/FormViewTemplate";
import ListViewTable, {
  ListItem,
  ListItemLink,
} from "@/components/templates/ListViewTable";
import ListViewTemplate from "@/components/templates/ListViewTemplate";
import { User } from "@/libs/definitions";
import { formatDate } from "@/libs/helpers";
import Link from "next/link";
import { Dropdown, DropdownButton } from "react-bootstrap";

const formStates: TFormState[] = [
  {
    name: "no_active",
    label: "inactivo",
  },
  {
    name: "active",
    label: "activo",
  },
];

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
      <ListViewTable>
        <ListViewTable.Header>
          <ListViewTable.Column name="usersActions" className="text-center">
            <i className="bi bi-gear-fill"></i>
          </ListViewTable.Column>
          <ListViewTable.Column name="userName">usuario</ListViewTable.Column>
          <ListViewTable.Column name="Partner.name">
            nombre
          </ListViewTable.Column>
          <ListViewTable.Column name="email">correo</ListViewTable.Column>
          <ListViewTable.Column name="state">Estado</ListViewTable.Column>
          <ListViewTable.Column name="lastLogin">
            último acceso
          </ListViewTable.Column>
          <ListViewTable.Column name="updatedAt">
            última modificación
          </ListViewTable.Column>
          <ListViewTable.Column name="createdAt">
            creado el
          </ListViewTable.Column>
        </ListViewTable.Header>
        <ListViewTable.Content>
          {users.map((user) => (
            <ListItemLink
              key={user.id}
              path={`/app/settings/users?view_mode=form&id=${user.id}`}
            >
              <ListItem name="usersActions" className="text-center">
                <DropdownButton
                  variant="light"
                  size="sm"
                  title={<i className="bi bi-gear-fill"></i>}
                  className="p-0"
                >
                  <Dropdown.Item
                    as={Link}
                    href={`/app/settings/users?view_mode=form&id=${user.id}`}
                  >
                    <i className="bi bi-pencil-square me-1"></i>
                    Editar
                  </Dropdown.Item>
                  <Dropdown.Item as={"button"}>
                    <i className="bi bi-archive-fill me-1"></i>
                    Archivar
                  </Dropdown.Item>
                  <Dropdown.Item as={"button"}>
                    <i className="bi bi-trash-fill me-1"></i>
                    Eliminar
                  </Dropdown.Item>
                </DropdownButton>
              </ListItem>
              <ListItem name="userName">{user.userName}</ListItem>
              <ListItem name="Partner.name">
                {user.Partner ? user.Partner.name : "N/A"}
              </ListItem>
              <ListItem name="email">{user.email}</ListItem>
              <ListItem name="state">
                {formStates?.find((st) => st.name === user.state)?.label ||
                  "estado"}
              </ListItem>
              <ListItem name="updatedAt">
                {user.lastLogin ? formatDate(user.lastLogin) : ""}
              </ListItem>
              <ListItem name="lastLogin">
                {user.updatedAt ? formatDate(user.updatedAt) : ""}
              </ListItem>
              <ListItem name="createdAt">{formatDate(user.createdAt)}</ListItem>
            </ListItemLink>
          ))}
        </ListViewTable.Content>
      </ListViewTable>
    </ListViewTemplate>
  );
}

export default UserViewList;
