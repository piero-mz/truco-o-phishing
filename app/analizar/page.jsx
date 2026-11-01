"use client";

import { useState } from "react";
import Link from "next/link";

const EJEMPLO = `De: Soporte FantasChat <soporte@fantaschat-verificacion-cuentas.top>
Asunto: Tu cuenta será eliminada HOY

Hola usuario,
Detectamos que tu cuenta incumple nuestras normas. Si no confirmas tus datos en las próximas 3 horas, será eliminada permanentemente.
Confirma aquí: http://fantaschat-seguro.verificar-ahora.top/login
Ingresa tu número, tu código de verificación de 6 dígitos y tu PIN.

Equipo de Seguridad`;

const ESTILO = {
  TRUCO: { emoji: "🎃", texto: "TRUCO", clase: "truco" },
  DULCE: { emoji: "🍬", texto: "DULCE", clase: "dulce" },
  SOSPECHOSO: { emoji: "👀", texto: "SOSPECHOSO", clase: "sospechoso" },
};

export default function Analizar() {
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  async function analizar(e) {
    e.preventDefault();
    setCargando(true);
    setError("");
    setResultado(null);
    try {
      const res = await fetch("/api/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error desconocido");
      setResultado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  const est = resultado ? ESTILO[resultado.veredicto] : null;

  return (
    <main className="contenedor estrecho">
      <Link href="/" className="volver">← Inicio</Link>
      <h1 className="titulo">Revisar un correo real</h1>
      <p className="lead">
        ¿Te llegó un correo raro? Pégalo aquí (remitente, asunto, cuerpo y links) y la IA te dirá si es dulce o truco.
      </p>
      <p className="muted">⚠️ No pegues contraseñas ni datos personales tuyos. Borra lo que no sea necesario.</p>

      <form onSubmit={analizar}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="De: ...&#10;Asunto: ...&#10;&#10;Cuerpo del correo..."
          rows={10}
          maxLength={6000}
        />
        <div className="acciones">
          <button className="btn" type="button" onClick={() => setTexto(EJEMPLO)}>
            Probar con un ejemplo
          </button>
          <button className="btn btn-primario" type="submit" disabled={cargando || texto.trim().length < 20}>
            {cargando ? "Consultando a los espíritus…" : "🔮 Analizar"}
          </button>
        </div>
      </form>

      {error && <div className="aviso aviso-malo">{error}</div>}

      {resultado && (
        <section className={`analisis analisis-${est.clase}`}>
          <div className="veredicto">
            <span className="veredicto-emoji">{est.emoji}</span>
            <div>
              <div className="veredicto-texto">{est.texto}</div>
              <div className="muted">Riesgo {resultado.riesgo}/10</div>
            </div>
          </div>
          <div className="medidor">
            <div style={{ width: `${resultado.riesgo * 10}%` }} />
          </div>
          <p>{resultado.resumen}</p>
          {resultado.senales.length > 0 && (
            <>
              <h4>Lo que encontré:</h4>
              <ul className="senales-ia">
                {resultado.senales.map((s, i) => (
                  <li key={i}>
                    <b>{s.titulo}</b>
                    <span>{s.detalle}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="recomendacion">💡 {resultado.recomendacion}</div>
        </section>
      )}
    </main>
  );
}
