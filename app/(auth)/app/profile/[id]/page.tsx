import { fetchUser } from "@/app/actions/user-actions";
import FormUserProfile from "@/components/forms/FormUserProfile";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await fetchUser({ id });
  const user = res.data ?? null;
  return <FormUserProfile user={user} />;
}

export default page;
