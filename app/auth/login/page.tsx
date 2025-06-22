import FormLogin from "@/components/forms/FormLogin";
import { initAdminUser } from "@/libs/initAdmin";

async function PageLogin() {
  await initAdminUser();

  return <FormLogin />;
}

export default PageLogin;
