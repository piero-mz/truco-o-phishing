"use client";

import { useState } from "react";

// Muestra un correo como si fuera un cliente de email (en pergamino).
// Los links NUNCA navegan: al pasar el mouse se ve la URL real en una barra
// de estado (como en el navegador) y al hacer clic se avisa al juego.
export default function EmailCard({ correo, nombre, onLinkClick, revelado, linksClicados = [] }) {
  const [hoverUrl, setHoverUrl] = useState("");

  const cuerpo = correo.cuerpo.replaceAll("{nombre}", nombre || "vecino");
  const partes = cuerpo.split(/(\{\{\d+\}\})/g);

  return (
    <article className={`carta ${revelado ? (correo.es_phishing ? "carta-truco" : "carta-dulce") : ""}`}>
      <header className="carta-header">
        <div className="avatar" aria-hidden>
          {correo.remitente_nombre.charAt(0)}
        </div>
        <div className="carta-meta">
          <div className="remitente">
            <strong>{correo.remitente_nombre}</strong>{" "}
            <span className="remitente-email">&lt;{correo.remitente_email}&gt;</span>
          </div>
          <div className="para">para: {nombre || "ti"}</div>
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

      {correo.adjunto && (
        <div className="adjunto">📎 {correo.adjunto}</div>
      )}

      <div className={`barra-estado ${hoverUrl ? "visible" : ""}`} aria-live="polite">
        {hoverUrl || " "}
      </div>
    </article>
  );
}
