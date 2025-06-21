import type { Metadata } from "next";
import "./globals.css";
import "bootswatch/dist/brite/bootstrap.css";
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
    <html lang="es" data-bs-theme="dark">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
