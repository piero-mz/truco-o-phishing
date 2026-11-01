"use client";

import { useState } from "react";

// Sobre cerrado: el jugador lo abre para ver la carta (y empieza el reloj).
export function Sobre({ correo, numero, onAbrir }) {
  return (
    <button className="sobre" onClick={onAbrir} aria-label={`Abrir carta ${numero} de ${correo.remitente_nombre}`}>
      <span className="estampilla" aria-hidden>🦇</span>
      <span className="matasellos" aria-hidden>
        OFICINA DEL<br />MÁS ALLÁ<br />31·OCT
      </span>
      <span className="lacre" aria-hidden>{correo.remitente_nombre.charAt(0)}</span>
      <span className="sobre-pista">
        Haz clic para abrir<kbd>Enter</kbd>
      </span>
      <span className="sobre-de">
        <small>De</small>
        {correo.remitente_nombre}
      </span>
    </button>
  );
}

// Carta abierta. Los links NUNCA navegan: al pasar el mouse se ve la URL real
// en una barra de estado (como en el navegador) y al hacer clic se avisa al juego.
// `sello` ("truco" | "dulce" | null) estampa el veredicto encima de la carta.
export default function EmailCard({ correo, nombre, onLinkClick, sello = null, linksClicados = [], sacudir = false }) {
  const [hoverUrl, setHoverUrl] = useState("");

  const cuerpo = correo.cuerpo.replaceAll("{nombre}", nombre || "vecino");
  const partes = cuerpo.split(/(\{\{\d+\}\})/g);

  return (
    <article className={`carta ${sacudir ? "sacudida" : ""}`}>
      {sello && (
        <div className={`sello sello-${sello}`} aria-hidden>
          {sello === "truco" ? "Truco" : "Dulce"}
        </div>
      )}

      <header className="carta-header">
        <div className="avatar" aria-hidden>{correo.remitente_nombre.charAt(0)}</div>
        <div className="carta-meta">
          <div className="remitente">
            <strong>{correo.remitente_nombre}</strong>{" "}
            <span className="remitente-email">&lt;{correo.remitente_email}&gt;</span>
          </div>
          <div className="para">para {nombre || "ti"}</div>
        </div>
      </header>

      <h2 className="asunto">{correo.asunto}</h2>

      <div className="cuerpo">
        {partes.map((p, i) => {
          const m = p.match(/^\{\{(\d+)\}\}$/);
          if (!m) return <span key={i}>{p}</span>;
          const idx = Number(m[1]);
          const link = correo.links[idx];
          if (!link) return null;
          const clicado = linksClicados.includes(idx);
          return (
            <a
              key={i}
              href="#"
              className={`link-correo ${clicado ? (link.malicioso ? "link-malo" : "link-bueno") : ""}`}
              onMouseEnter={() => setHoverUrl(link.url)}
              onMouseLeave={() => setHoverUrl("")}
              onFocus={() => setHoverUrl(link.url)}
              onBlur={() => setHoverUrl("")}
              onClick={(e) => {
                e.preventDefault();
                setHoverUrl(link.url); // en móvil no hay hover: el clic también la muestra
                onLinkClick?.(idx, link);
              }}
            >
              {link.texto}
            </a>
          );
        })}
      </div>

      {correo.adjunto && <div className="adjunto">📎 {correo.adjunto}</div>}

      <div className={`barra-estado ${hoverUrl ? "visible" : ""}`} aria-live="polite">
        {hoverUrl || " "}
      </div>
    </article>
  );
}
