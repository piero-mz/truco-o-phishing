// Efectos de sonido sintetizados con Web Audio (no requieren archivos).
// Respetan el botón de sonido: si el usuario silenció la música, tampoco suenan.

let ctx = null;

function audio() {
  try {
    if (localStorage.getItem("top-musica") === "off") return null;
  } catch {}
  if (typeof window === "undefined") return null;
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function nota(c, { frec, desde = 0, dur = 0.15, tipo = "sine", vol = 0.18, hasta }) {
  const t = c.currentTime + desde;
  const osc = c.createOscillator();
  const gan = c.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frec, t);
  if (hasta) osc.frequency.exponentialRampToValueAtTime(hasta, t + dur);
  gan.gain.setValueAtTime(0.0001, t);
  gan.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  gan.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gan).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export const sfx = {
  abrir() {
    const c = audio(); if (!c) return;
    nota(c, { frec: 300, hasta: 900, dur: 0.18, tipo: "triangle", vol: 0.12 });
  },
  acierto(racha = 1) {
    const c = audio(); if (!c) return;
    const base = 523 * Math.pow(2, Math.min(racha - 1, 4) / 12); // sube un semitono por racha
    [0, 4, 7, 12].forEach((s, k) =>
      nota(c, { frec: base * Math.pow(2, s / 12), desde: k * 0.07, dur: 0.22, tipo: "triangle", vol: 0.16 })
    );
  },
  fallo() {
    const c = audio(); if (!c) return;
    nota(c, { frec: 330, hasta: 220, dur: 0.28, tipo: "sawtooth", vol: 0.1 });
    nota(c, { frec: 233, hasta: 110, desde: 0.26, dur: 0.5, tipo: "sawtooth", vol: 0.1 });
  },
  trampa() {
    const c = audio(); if (!c) return;
    nota(c, { frec: 90, dur: 0.35, tipo: "square", vol: 0.12 });
    nota(c, { frec: 70, desde: 0.12, dur: 0.35, tipo: "square", vol: 0.1 });
  },
  tic() {
    const c = audio(); if (!c) return;
    nota(c, { frec: 1200, dur: 0.05, tipo: "square", vol: 0.05 });
  },
};
