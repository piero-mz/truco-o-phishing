import Link from "next/link";
import Ranking from "@/components/Ranking";

export default function Home() {
  return (
    <main className="contenedor estrecho">
      <div className="hero">
        <div className="hero-emoji" aria-hidden>📬🎃</div>
        <h1 className="titulo grande">Truco o Phishing</h1>
        <p className="lead">
          Los zombis ya no tocan la puerta: <b>mandan correos</b>. ¿Sabrías distinguir a tu vecino de un monstruo
          que quiere robarte la contraseña?
        </p>
      </div>

      <div className="modos">
        <Link href="/jugar" className="modo">
          <span className="modo-emoji">🕹️</span>
          <h2>Jugar</h2>
          <p>Revisa tu buzón embrujado y decide: ¿dulce o truco? Compite en el ranking.</p>
        </Link>
        <Link href="/analizar" className="modo">
          <span className="modo-emoji">🔮</span>
          <h2>Analizar un correo</h2>
          <p>Pega un correo sospechoso real y una IA te explica sus señales de alerta.</p>
        </Link>
      </div>

      <Ranking />
    </main>
  );
}
