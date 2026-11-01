import Link from "next/link";
import Ranking from "@/components/Ranking";

export default function Home() {
  return (
    <main className="contenedor estrecho">
      <header className="hero">
        <div className="luna" aria-hidden />
        <span className="murcielago" aria-hidden>🦇</span>
        <h1 className="titulo-hero">
          Truco
          <span className="o">o</span>
          Phishing
        </h1>
        <p className="lead">
          Esta noche los monstruos no tocan la puerta: te escriben. Abre tu buzón, lee cada carta y decide
          quién es tu vecino y quién quiere robarte la contraseña.
        </p>
      </header>

      <nav className="buzon" aria-label="Elige un modo">
        <Link href="/jugar" className="modo modo-principal">
          <span className="modo-icono" aria-hidden>✉️</span>
          <h2>Abrir el buzón</h2>
          <p>8 cartas, 25 segundos cada una. Sella cada una como dulce o truco y entra al registro.</p>
        </Link>
        <Link href="/analizar" className="modo">
          <span className="modo-icono" aria-hidden>🔮</span>
          <h2>Revisar un correo real</h2>
          <p>Pega un correo sospechoso que te llegó y la IA te señala dónde está la trampa.</p>
        </Link>
      </nav>

      <Ranking />
    </main>
  );
}
