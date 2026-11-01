"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Calabaza } from "@/components/Logo";
import { sfx } from "@/lib/sonido";

// ───────────── Sobre cerrado ─────────────
// Al hacer clic, la solapa gira, sale un murciélago y luego se muestra la carta.
export function Sobre({ correo, numero, onAbrir }) {
  const [abriendo, setAbriendo] = useState(false);

  function abrir() {
    if (abriendo) return;
    setAbriendo(true);
    sfx.abrir();
    const reducido = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(onAbrir, reducido ? 0 : 750);
  }

  return (
    <button
      className={`sobre ${abriendo ? "abriendo" : ""}`}
      onClick={abrir}
      data-abrir-sobre
      aria-label={`Abrir carta ${numero} de ${correo.remitente_nombre}`}
    >
      <span className="sobre-hoja" aria-hidden />
      <span className="sobre-cuerpo" aria-hidden />
      <span className="sobre-solapa" aria-hidden />
      <span className="sobre-murcielago" aria-hidden>🦇</span>
      <span className="sobre-sello" aria-hidden><Calabaza size={34} /></span>
      <span className="sobre-matasellos" aria-hidden>OFICINA DEL MÁS ALLÁ<br />31 OCT · 23:59</span>
      <span className="sobre-de">
        <small>Carta {numero}, de</small>
        {correo.remitente_nombre}
      </span>
      <span className="sobre-pista">Clic para abrir <kbd>Enter</kbd></span>
    </button>
  );
}

// ───────────── Resaltado de pistas ─────────────
// Busca en `texto` las marcas [{n, txt}] y las envuelve en <mark> numerados.
function resaltar(texto, marcas, activa) {
  if (!marcas?.length || !texto) return texto;
  const partes = [];
  let i = 0;
  while (i < texto.length) {
    let mejor = null;
    for (const m of marcas) {
      const pos = texto.indexOf(m.txt, i);
      if (pos === -1) continue;
      if (!mejor || pos < mejor.pos || (pos === mejor.pos && m.txt.length > mejor.m.txt.length)) mejor = { pos, m };
    }
    if (!mejor) break;
    if (mejor.pos > i) partes.push(texto.slice(i, mejor.pos));
    partes.push(
      <mark key={partes.length} className={`pista-marca ${activa === mejor.m.n ? "activa" : ""}`} data-n={mejor.m.n}>
        {mejor.m.txt}
        <sup>{mejor.m.n}</sup>
      </mark>
    );
    i = mejor.pos + mejor.m.txt.length;
  }
  if (i < texto.length) partes.push(texto.slice(i));
  return partes;
}

// ───────────── Carta abierta ─────────────
// Los links NUNCA navegan: el hover muestra la URL real en una barra de estado.
// Con `revelado`, se marcan las trampas (o señales de confianza) dentro de la carta.
export default function EmailCard({
  correo,
  nombre,
  onLinkClick,
  linksClicados = [],
  revelado = false,
  pistaActiva = null,
  estado = null, // "ok" | "mal" | null → color del borde
  sacudir = 0, // cambia de valor → la carta tiembla
}) {
  const [hoverUrl, setHoverUrl] = useState("");
  const ref = useRef(null);
  const primeraVez = useRef(sacudir);

  useEffect(() => {
    const el = ref.current;
    if (!el || sacudir === primeraVez.current) return;
    el.classList.remove("sacudida");
    void el.offsetWidth; // reinicia la animación
    el.classList.add("sacudida");
  }, [sacudir]);
  const quien = nombre || "vecino";
  const cuerpo = correo.cuerpo.replaceAll("{nombre}", quien);
  const marcas = revelado
    ? (correo.marcas || [])
        .map((txt, k) => (txt ? { n: k + 1, txt: txt.replaceAll("{nombre}", quien) } : null))
        .filter(Boolean)
    : [];
  const R = (t) => resaltar(t, marcas, pistaActiva);
  const partes = cuerpo.split(/(\{\{\d+\}\})/g);

  return (
    <article
      ref={ref}
      className={`carta ${estado ? `carta-${estado}` : ""} ${revelado ? (correo.es_phishing ? "tono-peligro" : "tono-seguro") : ""}`}
    >
      <div className="carta-campos">
        <div className="campo">
          <span className="campo-etq">De</span>
          <span>
            <strong>{correo.remitente_nombre}</strong>{" "}
            <span className="mono">&lt;{R(correo.remitente_email)}&gt;</span>
          </span>
        </div>
        <div className="campo">
          <span className="campo-etq">Para</span>
          <span>{quien}</span>
        </div>
        <div className="campo campo-asunto">
          <span className="campo-etq">Asunto</span>
          <strong>{R(correo.asunto)}</strong>
        </div>
      </div>

      <div className="cuerpo">
        {partes.map((p, i) => {
          const m = p.match(/^\{\{(\d+)\}\}$/);
          if (!m) return <Fragment key={i}>{R(p)}</Fragment>;
          const idx = Number(m[1]);
          const link = correo.links[idx];
          if (!link) return null;
          const clicado = linksClicados.includes(idx);
          return (
            <span key={i} className="link-envoltura">
              <a
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
                {R(link.texto)}
              </a>
              {revelado && <span className="link-real mono">↳ {R(link.url)}</span>}
            </span>
          );
        })}
      </div>

      {correo.adjunto && <div className="adjunto mono">📎 {R(correo.adjunto)}</div>}

      <div className={`barra-estado mono ${hoverUrl && !revelado ? "visible" : ""}`} aria-live="polite">
        {hoverUrl || " "}
      </div>
    </article>
  );
}
