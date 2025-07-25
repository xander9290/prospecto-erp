import { PartnerType } from "@/generate/prisma";
import { fetchContacts } from "../contacts-actions";
import ContactViewList, { ContactFilter } from "./ContactViewList";

async function ContactsMainView({
  viewMode,
  page = 1, // Default to page 1 if not provided
  search, // Default to undefined if not provided
  filter,
}: {
  page: number;
  search: string;
  viewMode: string;
  filter: PartnerType;
}) {
  const perPage = 50;

  const res = await fetchContacts({ skip: page, perPage, search, filter });
  const contacts = res.data?.contacts || null;
  const total = res.data?.total || 0;

  if (viewMode === "list") {
    return (
      <ContactViewList
        filter={filter as unknown as ContactFilter}
        contacts={contacts}
        page={page}
        perPage={perPage}
        total={total}
      />
    );
  }
}

export default ContactsMainView;
