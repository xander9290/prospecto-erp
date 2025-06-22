import LandingPage from "@/components/LandinPage";
import { auth } from "@/libs/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/app");
  }

  return <LandingPage />;
}
