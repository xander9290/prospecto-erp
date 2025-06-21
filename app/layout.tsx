import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
