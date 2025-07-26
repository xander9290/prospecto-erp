"use client";

import ListViewTemplate from "@/components/templates/ListViewTemplate";
import { PartnerContacts } from "@/libs/definitions";
// import Link from "next/link";
// import TableContacts from "./TableContacts";
import KanbanContacts from "./KanbanContacts";

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
      basePath={`/app/contacts?view_mode=list&filter=${filter}&page=1`}
      page={page} // Default to page 1
      perPage={perPage} // Default to 50 items per page
      total={total} // Default to 0 total items
    >
      {/* <TableContacts filter={filter} partners={contacts} /> */}
      <KanbanContacts filter={filter} partners={contacts} />
    </ListViewTemplate>
  );
}

export default ContactViewList;
