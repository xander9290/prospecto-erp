import TopNav from "@/components/top-nav/TopNav";
import { SessionProvider } from "next-auth/react";

function LayoutApp({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <TopNav />
      <main className="container vh-100">{children}</main>
    </SessionProvider>
  );
}

export default LayoutApp;
