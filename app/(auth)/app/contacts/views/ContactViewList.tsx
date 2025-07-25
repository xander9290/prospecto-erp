"use client";

import ImageAvatar from "@/components/templates/ImageAvatar";
import ListViewTable, {
  ListItem,
  ListItemLink,
} from "@/components/templates/ListViewTable";
import ListViewTemplate from "@/components/templates/ListViewTemplate";
import { PartnerContacts } from "@/libs/definitions";
import Link from "next/link";
import { Dropdown, DropdownButton } from "react-bootstrap";

const displayTypes = {
  CUSTOMER: "clientes",
  SUPPLIER: "proveedores",
  INTERNAL: "empleados",
};

export type ContactFilter = "CUSTOMER" | "SUPPLIER" | "INTERNAL";

function ContactViewList({
  filter,
  page,
  perPage,
  total,
  contacts,
}: {
  filter: ContactFilter;
  page: number;
  perPage: number;
  total: number;
  contacts: PartnerContacts[] | null;
}) {
  return (
    <ListViewTemplate
      title={displayTypes[filter]}
      viewForm={`/app/contacts?view_mode=form&id=null&filter=${filter}`}
      basePath="/app/contacts?view_mode=list&filter=INTERNAL&page=1"
      page={page} // Default to page 1
      perPage={perPage} // Default to 50 items per page
      total={total} // Default to 0 total items
    >
      <ListViewTable>
        <ListViewTable.Header>
          <ListViewTable.Column name="usersActions" className="text-center">
            <i className="bi bi-gear-fill"></i>
          </ListViewTable.Column>
          <ListViewTable.Column name="name">nombre</ListViewTable.Column>
          <ListViewTable.Column name="email">correo</ListViewTable.Column>
          <ListViewTable.Column name="phone">teléfono</ListViewTable.Column>
          <ListViewTable.Column name="street">calle</ListViewTable.Column>
          <ListViewTable.Column name="colony">colonia</ListViewTable.Column>
          <ListViewTable.Column name="city">ciudad</ListViewTable.Column>
        </ListViewTable.Header>
        <ListViewTable.Content>
          {contacts?.map((partner) => (
            <ListItemLink
              key={partner.id}
              path={`/app/contacts?view_mode=form&id=${partner.id}&filter=${filter}`}
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
                    href={`/app/contacts?view_mode=form&id=${partner.id}`}
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
              <ListItem name="Partner.name">
                <div className="d-flex gap-1 align-items-center">
                  <ImageAvatar imageUrl={partner.Image?.url || null} />
                  {partner.name}
                </div>
              </ListItem>
              <ListItem name="email">{partner.email}</ListItem>
              <ListItem name="phone">{partner.phone}</ListItem>
              <ListItem name="street">{partner.street}</ListItem>
              <ListItem name="colony">{partner.colony}</ListItem>
              <ListItem name="city">{partner.city}</ListItem>
            </ListItemLink>
          ))}
        </ListViewTable.Content>
      </ListViewTable>
    </ListViewTemplate>
  );
}

export default ContactViewList;
