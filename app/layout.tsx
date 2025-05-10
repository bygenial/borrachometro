import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Borrachómetro",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="font-zain bg-background">{children}</body>
    </html>
  );
}
