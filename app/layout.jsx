import "./globals.css";
import MusicaFondo from "@/components/MusicaFondo";

export const metadata = {
  title: "Truco o Phishing 🎃",
  description: "Juego de Halloween para aprender a detectar correos de phishing — Halloween as a Service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Inter:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="niebla" aria-hidden />
        <MusicaFondo />
        {children}
        <footer className="pie">Hecho con Vercel, Supabase y Gemini para Halloween as a Service.</footer>
      </body>
    </html>
  );
}
