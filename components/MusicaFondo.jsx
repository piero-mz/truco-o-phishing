"use client";

import { useEffect, useRef, useState } from "react";

// Música de fondo en bucle. Los navegadores bloquean el autoplay con sonido,
// así que arranca con la primera interacción del usuario (clic o tecla).
// Como vive en el layout, sigue sonando al cambiar de página.
const VOLUMEN = 0.35;

export default function MusicaFondo() {
  const audio = useRef(null);
  const [sonando, setSonando] = useState(false);
  const [silenciado, setSilenciado] = useState(false);

  useEffect(() => {
    let prefiereSilencio = false;
    try {
      prefiereSilencio = localStorage.getItem("top-musica") === "off";
    } catch {}
    setSilenciado(prefiereSilencio);
    if (audio.current) audio.current.volume = VOLUMEN;
    if (prefiereSilencio) return;

    const arrancar = () => {
      audio.current
        ?.play()
        .then(() => setSonando(true))
        .catch(() => {});
      quitar();
    };
    const quitar = () => {
      window.removeEventListener("pointerdown", arrancar);
      window.removeEventListener("keydown", arrancar);
    };
    window.addEventListener("pointerdown", arrancar);
    window.addEventListener("keydown", arrancar);
    return quitar;
  }, []);

  function alternar(e) {
    e.stopPropagation(); // que este clic no dispare también el "arrancar"
    const a = audio.current;
    if (!a) return;
    if (sonando) {
      a.pause();
      setSonando(false);
      setSilenciado(true);
      try { localStorage.setItem("top-musica", "off"); } catch {}
    } else {
      a.play().then(() => setSonando(true)).catch(() => {});
      setSilenciado(false);
      try { localStorage.setItem("top-musica", "on"); } catch {}
    }
  }

  return (
    <>
      <audio ref={audio} src="/ivory-bones.mp3" loop preload="auto" />
      <button
        className={`boton-musica ${sonando ? "activo" : ""}`}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={alternar}
        aria-label={sonando ? "Silenciar música" : "Activar música"}
        title={sonando ? "Silenciar música" : silenciado ? "Activar música" : "La música empieza con tu primer clic"}
      >
        {sonando ? "🔊" : "🔇"}
      </button>
    </>
  );
}
