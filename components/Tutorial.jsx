"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/lib/sonido";

// ───────── Piezas visuales ─────────

// Muestra una URL separada en partes y resalta quién es el dueño (el dominio real).
function UrlDesarmada({ protocolo, sub, dueno, ruta, tipo }) {
  const partes = [
    { cls: "u-proto", txt: protocolo, etq: "protocolo" },
    sub && { cls: "u-sub", txt: sub, etq: tipo === "falso" ? "disfraz" : "subdominio" },
    { cls: "u-dueno", txt: dueno, etq: "dueño real" },
    { cls: "u-ruta", txt: ruta, etq: "ruta" },
  ].filter(Boolean);
  return (
    <div className={`url-desarmada ${tipo}`}>
      {partes.map((p) => (
        <span key={p.cls} className={`seg ${p.cls}`}>
          <span className="seg-txt mono">{p.txt}</span>
          <span className="seg-etq">{p.etq}</span>
        </span>
      ))}
    </div>
  );
}

function PasoDueno() {
  return (
    <>
      <p className="tuto-regla">
        Busca el primer <b className="mono">/</b> después de <span className="mono">https://</span>. Lo que está
        justo antes es el <b>dueño</b> de la página. Todo lo de la izquierda es disfraz.
      </p>
      <div className="tuto-ejemplos">
        <div className="tuto-ejemplo">
          <span className="tuto-veredicto ok">✓ Es del banco</span>
          <UrlDesarmada tipo="real" protocolo="https://" sub="app." dueno="bancodelmasalla.com" ruta="/cuenta" />
        </div>
        <div className="tuto-ejemplo">
          <span className="tuto-veredicto mal">✗ Es de otro, aunque diga "banco"</span>
          <UrlDesarmada tipo="falso" protocolo="https://" sub="bancodelmasalla.com." dueno="verificar-cripta.ru" ruta="/cuenta" />
        </div>
      </div>
      <p className="tuto-nota">
        Truco: en dominios de país como <span className="mono">.com.pe</span> o <span className="mono">.edu.pe</span>,
        el dueño incluye una parte más: <span className="mono u-dueno-inline">universidad-tenebrosa.edu.pe</span>
      </p>
    </>
  );
}

const PARES = [
  { real: "calabaza-express.com", falso: "ca1abaza-express.com", pos: 2, pista: "un 1 en vez de la l" },
];
const TRUCOS_LETRAS = [
  { txt: "ca1abaza-express.com", i: 2, nota: "1 por l" },
  { txt: "netfrlght.com", i: 5, nota: "l por i" },
  { txt: "bancodelmasala.com", i: 12, nota: "falta una l" },
  { txt: "calabaza-expres.com", i: 14, nota: "falta una s" },
];

function Letra({ txt, i, clase = "" }) {
  return (
    <span className="mono">
      {txt.slice(0, i)}
      <mark className={`letra-trampa ${clase}`}>{txt[i] === "." ? "·" : txt[i]}</mark>
      {txt.slice(i + 1)}
    </span>
  );
}

function PasoLetras() {
  const par = PARES[0];
  const [orden] = useState(() => (Math.random() < 0.5 ? ["real", "falso"] : ["falso", "real"]));
  const [elegido, setElegido] = useState(null);

  function elegir(cual) {
    if (elegido) return;
    setElegido(cual);
    cual === "falso" ? sfx.acierto(1) : sfx.fallo();
  }

  return (
    <>
      <p className="tuto-regla">Los estafadores registran dominios casi iguales al real. Uno de estos es falso. ¿Cuál?</p>
      <div className="reto">
        {orden.map((cual) => {
          const dom = par[cual];
          const estado = elegido ? (cual === "falso" ? "es-falso" : "es-real") : "";
          return (
            <button key={cual} className={`reto-opcion ${estado} ${elegido === cual ? "elegido" : ""}`} onClick={() => elegir(cual)}>
              {elegido && cual === "falso" ? <Letra txt={dom} i={par.pos} /> : <span className="mono">{dom}</span>}
              {elegido && <small>{cual === "falso" ? `Falso: ${par.pista}` : "Real"}</small>}
            </button>
          );
        })}
      </div>
      {elegido && (
        <p className={`reto-resultado ${elegido === "falso" ? "ok" : "mal"}`}>
          {elegido === "falso" ? "¡Bien visto! Así de pequeño puede ser el cambio." : "Casi. Mira de nuevo la tercera letra."}
        </p>
      )}
      <div className="trucos-letras">
        <span className="tuto-mini">Otros trucos comunes:</span>
        {TRUCOS_LETRAS.slice(1).map((t) => (
          <span key={t.txt} className="truco-letra">
            <Letra txt={t.txt} i={t.i} /> <small>{t.nota}</small>
          </span>
        ))}
      </div>
    </>
  );
}

function PasoLink() {
  const [visto, setVisto] = useState(false);
  const ver = () => {
    if (!visto) sfx.abrir();
    setVisto(true);
  };
  return (
    <>
      <p className="tuto-regla">
        El texto de un link puede decir cualquier cosa. Antes de hacer clic, <b>pasa el mouse encima</b> (o
        mantén presionado en el celular) y lee la dirección real.
      </p>
      <div className="mini-correo">
        <p>Hola, no pudimos procesar tu pago. Actualiza tu tarjeta aquí:</p>
        <a
          href="#"
          className={`link-correo ${visto ? "" : "pulso"}`}
          onMouseEnter={ver}
          onFocus={ver}
          onClick={(e) => { e.preventDefault(); ver(); }}
        >
          netfright.com/mi-cuenta
        </a>
        <div className={`barra-estado mono ${visto ? "visible" : ""}`}>http://netfright-billing.support/actualizar-tarjeta</div>
      </div>
      {visto ? (
        <div className="comparacion">
          <div><span className="tuto-mini">Dice</span><span className="mono">netfright.com/mi-cuenta</span></div>
          <div className="flecha" aria-hidden>→</div>
          <div><span className="tuto-mini">Lleva a</span><span className="mono"><b className="u-dueno-inline mal">netfright-billing.support</b>/actualizar-tarjeta</span></div>
        </div>
      ) : (
        <p className="tuto-pista">👆 Pasa el mouse por el link naranja</p>
      )}
    </>
  );
}

const ALARMAS = [
  { ic: "⏰", t: "Urgencia o amenaza", d: "\"en 2 horas\", \"será eliminada\"" },
  { ic: "🔑", t: "Pide claves o datos", d: "contraseña, PIN, tarjeta, códigos" },
  { ic: "🎁", t: "Premio o cobro raro", d: "\"ganaste\", \"paga S/ 2 de envío\"" },
  { ic: "📎", t: "Adjunto peligroso", d: "archivos .exe, .zip o \"pdf.exe\"" },
];

function PasoAlarmas() {
  return (
    <>
      <p className="tuto-regla">Además de los links, el mensaje mismo te delata. Estas son las 4 alarmas más comunes:</p>
      <div className="alarmas-grid">
        <div className="mini-correo ejemplo-alarmas">
          <div className="mono mini-de">De: premios@ca1abaza-express.com</div>
          <p>
            Estimado cliente: <span className="alarma" style={{ "--d": ".2s" }}>¡ganaste 1000 kg de dulces!<sup>🎁</sup></span>{" "}
            Confirma tu <span className="alarma" style={{ "--d": ".5s" }}>clave y tu tarjeta<sup>🔑</sup></span> para el envío{" "}
            <span className="alarma" style={{ "--d": ".8s" }}>antes de 2 horas<sup>⏰</sup></span>.
          </p>
          <span className="adjunto mono alarma" style={{ "--d": "1.1s" }}>📎 premio.pdf.exe<sup>📎</sup></span>
        </div>
        <ul className="alarmas-lista">
          {ALARMAS.map((a, k) => (
            <li key={a.t} style={{ animationDelay: `${0.2 + k * 0.3}s` }}>
              <span className="alarma-ic">{a.ic}</span>
              <span><b>{a.t}</b><small>{a.d}</small></span>
            </li>
          ))}
        </ul>
      </div>
      <p className="tuto-oro">
        <b>Regla de oro:</b> si dudas, no hagas clic. Entra a la página escribiendo tú mismo la dirección.
      </p>
    </>
  );
}

const PASOS = [
  { titulo: "¿De quién es este link?", icono: "🔍", Comp: PasoDueno },
  { titulo: "Lee letra por letra", icono: "🧐", Comp: PasoLetras },
  { titulo: "El texto del link puede mentir", icono: "🎭", Comp: PasoLink },
  { titulo: "Las 4 alarmas del mensaje", icono: "🚨", Comp: PasoAlarmas },
];

// ───────── Tutorial ─────────
export default function Tutorial({ onTerminar }) {
  const [paso, setPaso] = useState(0);
  const ultimo = paso === PASOS.length - 1;
  const { titulo, icono, Comp } = PASOS[paso];

  const siguiente = () => (ultimo ? onTerminar() : setPaso((p) => p + 1));
  const anterior = () => setPaso((p) => Math.max(0, p - 1));

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Enter" || e.key === "ArrowRight") { e.preventDefault(); siguiente(); }
      else if (e.key === "ArrowLeft") anterior();
      else if (e.key === "Escape") onTerminar();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <section className="tutorial" aria-label="Tutorial para detectar phishing">
      <header className="tuto-cabecera">
        <span className="tuto-etapa">Entrenamiento rápido, paso {paso + 1} de {PASOS.length}</span>
        <button className="tuto-saltar" onClick={onTerminar}>Saltar tutorial <kbd>Esc</kbd></button>
      </header>
      <div className="tuto-barra" aria-hidden>
        {PASOS.map((_, k) => <span key={k} className={k <= paso ? "lleno" : ""} />)}
      </div>

      <div key={paso} className="tuto-paso">
        <h2 className="tuto-titulo"><span aria-hidden>{icono}</span> {titulo}</h2>
        <Comp />
      </div>

      <footer className="tuto-pie">
        <button className="btn" onClick={anterior} disabled={paso === 0}>Atrás</button>
        <button className="btn btn-primario" onClick={siguiente}>
          {ultimo ? "Abrir el buzón" : "Siguiente"} <kbd>Enter</kbd>
        </button>
      </footer>
    </section>
  );
}
