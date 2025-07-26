import type { Metadata } from "next";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
// import "bootswatch/dist/zephyr/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Prospecto ERP",
  description: "Este proyecto es un prototipo de ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" style={{ overflow: "auto" }}>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
