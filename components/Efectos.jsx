"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Explosión de partículas (emojis) desde el centro de su contenedor.
export function Explosion({ emojis, cantidad = 22 }) {
  const piezas = useMemo(
    () =>
      Array.from({ length: cantidad }, (_, k) => {
        const ang = (Math.PI * 2 * k) / cantidad + Math.random() * 0.5;
        const dist = 120 + Math.random() * 160;
        return {
          e: emojis[k % emojis.length],
          dx: Math.cos(ang) * dist,
          dy: Math.sin(ang) * dist - 60,
          rot: Math.random() * 540 - 270,
          retraso: Math.random() * 0.08,
          tam: 1.2 + Math.random() * 1.1,
        };
      }),
    [emojis, cantidad]
  );
  return (
    <div className="explosion" aria-hidden>
      {piezas.map((p, k) => (
        <span
          key={k}
          style={{
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            "--rot": `${p.rot}deg`,
            animationDelay: `${p.retraso}s`,
            fontSize: `${p.tam}rem`,
          }}
        >
          {p.e}
        </span>
      ))}
    </div>
  );
}

// Número que se anima hasta su nuevo valor (como un marcador de arcade).
export function Contador({ valor, className }) {
  const [mostrado, setMostrado] = useState(valor);
  const desde = useRef(valor);

  useEffect(() => {
    const inicio = desde.current;
    if (inicio === valor) return;
    const t0 = performance.now();
    const dur = 600;
    let raf;
    const paso = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      const v = Math.round(inicio + (valor - inicio) * (1 - Math.pow(1 - p, 3)));
      setMostrado(v);
      if (p < 1) raf = requestAnimationFrame(paso);
      else desde.current = valor;
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [valor]);

  return <span className={className}>{mostrado}</span>;
}

// Anillo de cuenta regresiva.
export function Reloj({ restante, total, activo }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const p = activo ? Math.max(restante, 0) / total : 1;
  const urgente = activo && restante <= 5;
  return (
    <div className={`reloj ${urgente ? "urgente" : ""}`} aria-label={activo ? `${restante} segundos` : "Reloj en pausa"}>
      <svg width="48" height="48" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} className="reloj-fondo" />
        <circle
          cx="22" cy="22" r={r}
          className="reloj-avance"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          transform="rotate(-90 22 22)"
        />
      </svg>
      <span>{activo ? restante : "–"}</span>
    </div>
  );
}
