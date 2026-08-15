import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "El Método de las 3 Claves | Mapa Parental",
  description:
    "De las noches en vela al descanso real. Plan guiado de 7 días para el sueño de tu bebé (0-24 meses).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        {/* Botón fijo a la guía de emergencia nocturna: siempre visible, un toque, sin buscar */}
        <Link
          href="/emergencia"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
        >
          🌙 Emergencia
        </Link>
      </body>
    </html>
  );
}
