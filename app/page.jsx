import Link from "next/link";
import Ranking from "@/components/Ranking";
import Logo from "@/components/Logo";

export default function Home() {
  return (
    <main className="contenedor estrecho">
      <header className="hero">
        <div>
          <div className="marca">
            <Logo size={30} />
            Halloween as a Service
          </div>
          <h1 className="titulo-hero">
            Truco
            <span>o</span>
            Phishing
          </h1>
          <p className="lead">
            Esta noche los monstruos no tocan la puerta: te escriben. Abre cada carta, investiga los links y decide
            quién es tu vecino y quién quiere robarte la contraseña.
          </p>
        </div>
        <div className="hero-logo" aria-hidden>
          <Logo />
        </div>
      </header>

      <nav className="modos" aria-label="Elige un modo">
        <Link href="/jugar" className="modo principal">
          <span className="modo-icono" aria-hidden>✉️</span>
          <h2>Abrir el buzón</h2>
          <p>8 cartas, 25 segundos cada una. Acierta seguido para sumar racha y subir en el registro.</p>
          <span className="modo-ir">Jugar</span>
        </Link>
        <Link href="/analizar" className="modo">
          <span className="modo-icono" aria-hidden>🔮</span>
          <h2>Revisar un correo real</h2>
          <p>Pega un correo sospechoso que te llegó y la IA te señala dónde está la trampa.</p>
          <span className="modo-ir">Analizar</span>
        </Link>
      </nav>

      <Ranking />
    </main>
  );
}
