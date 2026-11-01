"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import EmailCard, { Sobre } from "@/components/EmailCard";
import Ranking from "@/components/Ranking";
import { Contador, Explosion, Reloj } from "@/components/Efectos";
import Tutorial from "@/components/Tutorial";
import { supabase } from "@/lib/supabase";
import { sfx } from "@/lib/sonido";
import { CORREOS, MARCAS } from "@/data/correos";

const CORREOS_POR_PARTIDA = 8;
const SEGUNDOS = 25;
const PTS_ACIERTO = 100;
const PTS_RAPIDEZ = 50;
const PTS_RACHA = 25; // por cada acierto seguido (máx. +100)
const PENALIDAD_LINK = 50;
const MONSTRUOS = ["🧟", "🧛", "👻", "🧙", "🕷️", "💀", "🦇", "👹"];
const DULCES = ["🍬", "🍭", "🍫", "✨", "🍬", "🍭"];

function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function cargarCorreos() {
  let lista = CORREOS;
  if (supabase) {
    const { data, error } = await supabase.from("correos").select("*");
    if (!error && data?.length) lista = data;
    if (error) console.warn("Usando correos locales:", error.message);
  }
  // si la base aún no tiene las marcas, se toman del archivo local
  return lista.map((c) => ({ ...c, marcas: c.marcas?.length ? c.marcas : MARCAS[c.id] || [] }));
}

function rango(monstruos, aciertos, total) {
  if (aciertos === total) return { icono: "🛡️", titulo: "Guardián de la cripta", texto: "Ninguna trampa pudo contigo." };
  if (monstruos === 0) return { icono: "🏰", titulo: "Casa intacta", texto: "Algún vecino se quedó afuera, pero ningún monstruo entró." };
  if (monstruos <= 2) return { icono: "🔦", titulo: "Cazador con cicatrices", texto: "Se te colaron algunos monstruos. Revisa sus trucos." };
  if (monstruos <= 4) return { icono: "🏚️", titulo: "Casa embrujada", texto: "Los monstruos ya conocen tu dirección." };
  return { icono: "🧟", titulo: "Fiesta de monstruos en tu sala", texto: "Vuelve a jugar y fíjate en los dominios." };
}

// Qué mostrar según cómo terminó cada carta
function desenlace({ eleccion, acerto, esPhishing, monstruo }) {
  if (acerto && esPhishing) return { tipo: "ok", titulo: "¡Trampa descubierta!", sub: "Le cerraste la puerta en la cara al monstruo." };
  if (acerto) return { tipo: "ok", titulo: "¡Vecino a salvo!", sub: "Era una carta de confianza." };
  if (eleccion === null && esPhishing) return { tipo: "mal", titulo: "¡Se acabó el tiempo!", sub: `Mientras dudabas, un ${monstruo} se metió por la ventana.` };
  if (eleccion === null) return { tipo: "aviso", titulo: "¡Se acabó el tiempo!", sub: "Tu vecino se cansó de esperar en la puerta." };
  if (esPhishing) return { tipo: "mal", titulo: "¡Caíste en la trampa!", sub: `Un ${monstruo} acaba de entrar a tu casa.` };
  return { tipo: "aviso", titulo: "Falsa alarma", sub: "Era tu vecino y lo dejaste afuera. Tu racha se rompe." };
}

export default function Jugar() {
  // inicio → tutorial → sobre → jugando → feedback → (sobre …) → fin
  const [fase, setFase] = useState("inicio");
  const [nombre, setNombre] = useState("");
  const [mazo, setMazo] = useState([]);
  const [i, setI] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [resultados, setResultados] = useState([]);
  const [monstruos, setMonstruos] = useState([]);
  const [racha, setRacha] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const [restante, setRestante] = useState(SEGUNDOS);
  const [linksClicados, setLinksClicados] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [golpe, setGolpe] = useState(0); // cambia para re-disparar flash/temblor
  const [pistaActiva, setPistaActiva] = useState(null);
  const [miId, setMiId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const timer = useRef(null);

  const correo = mazo[i];
  const aciertos = resultados.filter(Boolean).length;
  const trampasEvitadas = mazo.filter((c, k) => c.es_phishing && resultados[k]).length;

  useEffect(() => {
    try {
      const n = localStorage.getItem("top-nombre");
      if (n) setNombre(n);
    } catch {}
  }, []);

  useEffect(() => {
    if (fase !== "jugando") return;
    timer.current = setInterval(() => setRestante((s) => s - 1), 1000);
    return () => clearInterval(timer.current);
  }, [fase, i]);

  useEffect(() => {
    if (fase === "jugando" && restante > 0 && restante <= 5) sfx.tic();
  }, [restante, fase]);

  function nuevoMonstruo() {
    const m = MONSTRUOS[monstruos.length % MONSTRUOS.length];
    setMonstruos((lista) => [...lista, m]);
    return m;
  }

  async function empezar(e) {
    e.preventDefault();
    const n = nombre.trim().slice(0, 20);
    if (!n) return;
    try { localStorage.setItem("top-nombre", n); } catch {}
    setNombre(n);
    const todos = await cargarCorreos();
    setMazo(barajar(todos).slice(0, CORREOS_POR_PARTIDA));
    setI(0);
    setPuntaje(0);
    setResultados([]);
    setMonstruos([]);
    setRacha(0);
    setMejorRacha(0);
    setMiId(null);
    setLinksClicados([]);
    setResultado(null);
    setRestante(SEGUNDOS);
    setFase("tutorial");
  }

  function abrir() {
    setRestante(SEGUNDOS);
    setFase("jugando");
  }

  function clicEnLink(idx, link) {
    if (fase !== "jugando" || linksClicados.includes(idx)) return;
    setLinksClicados((l) => [...l, idx]);
    if (link.malicioso) {
      const m = nuevoMonstruo();
      setPuntaje((p) => p - PENALIDAD_LINK);
      setGolpe((g) => g + 1);
      sfx.trampa();
      setAviso({ tipo: "malo", texto: `${m} ¡Hiciste clic en una trampa! Ese link iba a ${link.url}  −${PENALIDAD_LINK}` });
    } else {
      setAviso({ tipo: "bueno", texto: "Ese link es seguro. ¿Y el resto de la carta?" });
    }
    setTimeout(() => setAviso(null), 3000);
  }

  // eleccion: "truco" | "dulce" | null (se acabó el tiempo)
  const responder = useCallback(
    (eleccion) => {
      if (fase !== "jugando") return;
      clearInterval(timer.current);
      const esPhishing = correo.es_phishing;
      const acerto = eleccion === (esPhishing ? "truco" : "dulce");
      let desglose = [];
      let monstruo = null;

      if (acerto) {
        const nuevaRacha = racha + 1;
        const rapidez = Math.round((PTS_RAPIDEZ * Math.max(restante, 0)) / SEGUNDOS);
        const bonusRacha = Math.min(nuevaRacha - 1, 4) * PTS_RACHA;
        desglose = [
          { txt: "acierto", pts: PTS_ACIERTO },
          { txt: "rapidez", pts: rapidez },
          ...(bonusRacha ? [{ txt: `racha ×${nuevaRacha}`, pts: bonusRacha }] : []),
        ];
        setPuntaje((p) => p + PTS_ACIERTO + rapidez + bonusRacha);
        setRacha(nuevaRacha);
        setMejorRacha((m) => Math.max(m, nuevaRacha));
        sfx.acierto(nuevaRacha);
      } else {
        setRacha(0);
        if (esPhishing) monstruo = nuevoMonstruo();
        setGolpe((g) => g + 1);
        sfx.fallo();
      }

      setResultados((r) => [...r, acerto]);
      setResultado({ eleccion, acerto, desglose, monstruo, ...desenlace({ eleccion, acerto, esPhishing, monstruo }) });
      setPistaActiva(null);
      setFase("feedback");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fase, correo, restante, racha, monstruos]
  );

  useEffect(() => {
    if (fase === "jugando" && restante <= 0) responder(null);
  }, [restante, fase, responder]);

  async function siguiente() {
    if (i + 1 < mazo.length) {
      setI(i + 1);
      setLinksClicados([]);
      setResultado(null);
      setFase("sobre");
      return;
    }
    setFase("fin");
    if (!supabase) return;
    setGuardando(true);
    const { data, error } = await supabase
      .from("partidas")
      .insert({ nombre, puntaje, aciertos, total: mazo.length, monstruos: monstruos.length })
      .select("id")
      .single();
    setGuardando(false);
    if (error) console.error(error);
    else setMiId(data.id);
  }

  // Atajos: Enter abre / continúa · D o ← = Dulce · T o → = Truco
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const k = e.key.toLowerCase();
      if (fase === "sobre" && (k === "enter" || k === " ")) {
        e.preventDefault();
        document.querySelector("[data-abrir-sobre]")?.click();
      } else if (fase === "jugando" && (k === "d" || k === "arrowleft")) responder("dulce");
      else if (fase === "jugando" && (k === "t" || k === "arrowright")) responder("truco");
      else if (fase === "feedback" && k === "enter") {
        e.preventDefault();
        siguiente();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ───────── Inicio ─────────
  if (fase === "inicio") {
    return (
      <main className="contenedor estrecho">
        <Link href="/" className="volver">← Inicio</Link>
        <h1 className="titulo">Te llegaron {CORREOS_POR_PARTIDA} cartas</h1>
        <p className="lead">Algunas son de tus vecinos. Otras, de monstruos que quieren entrar a tu casa.</p>

        <ol className="como-jugar">
          <li>
            <span className="cj-icono">✉️</span>
            <b>Abre la carta</b>
            <span>El reloj de {SEGUNDOS} s empieza al romper el sello.</span>
          </li>
          <li>
            <span className="cj-icono">🔍</span>
            <b>Investiga</b>
            <span>Pasa el mouse por los links para ver a dónde llevan. ¡No hagas clic en las trampas!</span>
          </li>
          <li>
            <span className="cj-icono">🍬🎃</span>
            <b>Decide</b>
            <span>Dulce si es legítima, Truco si es phishing. Acierta seguido para sumar racha.</span>
          </li>
        </ol>

        <form onSubmit={empezar} className="form-nombre">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre para el registro"
            aria-label="Tu nombre"
            maxLength={20}
            required
            autoFocus
          />
          <button className="btn btn-primario" type="submit">Abrir el buzón</button>
        </form>
      </main>
    );
  }

  // ───────── Tutorial (antes de cada partida) ─────────
  if (fase === "tutorial") {
    return (
      <main className="contenedor">
        <Tutorial onTerminar={() => setFase("sobre")} />
      </main>
    );
  }

  // ───────── Fin ─────────
  if (fase === "fin") {
    const r = rango(monstruos.length, aciertos, mazo.length);
    const precision = Math.round((aciertos / mazo.length) * 100);
    return (
      <main className="contenedor estrecho">
        <section className="fin">
          <div className="fin-icono" aria-hidden>{r.icono}</div>
          <h1 className="fin-titulo">{r.titulo}</h1>
          <p className="fin-texto">{r.texto}</p>
          <div className="fin-puntos"><Contador valor={puntaje} /> <span>puntos</span></div>

          <dl className="estadisticas">
            <div><dt>Precisión</dt><dd>{precision}%</dd></div>
            <div><dt>Mejor racha</dt><dd>🔥 {mejorRacha}</dd></div>
            <div><dt>Trampas evitadas</dt><dd>{trampasEvitadas}</dd></div>
            <div><dt>Monstruos en casa</dt><dd>{monstruos.length ? monstruos.join("") : "0"}</dd></div>
          </dl>
          {guardando && <p className="muted">Anotando tu nombre en el registro…</p>}

          <div className="acciones centrado">
            <button className="btn btn-primario" onClick={() => setFase("inicio")}>Jugar otra vez</button>
            <Link className="btn btn-secundario" href="/analizar">Revisar un correo real</Link>
          </div>
        </section>
        <Ranking resaltarId={miId} />
      </main>
    );
  }

  // ───────── Partida ─────────
  return (
    <main className="contenedor">
      {golpe > 0 && <div key={`flash-${golpe}`} className="flash-peligro" aria-hidden />}

      <div className="hud">
        <ol className="progreso" aria-label={`Carta ${i + 1} de ${mazo.length}`}>
          {mazo.map((_, k) => (
            <li key={k} className={k < resultados.length ? (resultados[k] ? "ok" : "mal") : k === i ? "actual" : ""} />
          ))}
        </ol>
        <div className="hud-datos">
          {racha >= 2 && <span key={`racha-${racha}`} className="racha">🔥 ×{racha}</span>}
          <span key={`casa-${monstruos.length}`} className="casa-mini" title="Monstruos dentro de tu casa">
            🏚️ <b>{monstruos.length}</b>
          </span>
          <Contador valor={puntaje} className="puntos" />
          <Reloj restante={restante} total={SEGUNDOS} activo={fase === "jugando"} />
        </div>
      </div>

      {aviso && <div className={`aviso aviso-${aviso.tipo}`} role="status">{aviso.texto}</div>}

      <div className="mesa">
        {fase === "sobre" ? (
          <Sobre key={`sobre-${i}`} correo={correo} numero={i + 1} onAbrir={abrir} />
        ) : (
          <EmailCard
            key={`carta-${i}`}
            correo={correo}
            nombre={nombre}
            onLinkClick={clicEnLink}
            linksClicados={linksClicados}
            revelado={fase === "feedback"}
            pistaActiva={pistaActiva}
            estado={fase === "feedback" ? resultado?.tipo : null}
            sacudir={golpe}
          />
        )}

        {fase === "feedback" && resultado && (
          <div key={`banner-${i}`} className={`banner banner-${resultado.tipo}`} aria-hidden>
            {resultado.acerto && <Explosion emojis={DULCES} />}
            {resultado.monstruo && <span className="monstruo-entra">{resultado.monstruo}</span>}
            <span className="banner-texto">{resultado.titulo}</span>
            {resultado.acerto && (
              <span className="banner-puntos">+{resultado.desglose.reduce((s, d) => s + d.pts, 0)}</span>
            )}
          </div>
        )}
      </div>

      {fase === "jugando" && (
        <div className="decision">
          <button className="btn-decision dulce" onClick={() => responder("dulce")}>
            <span className="bd-icono">🍬</span>
            <span className="bd-texto">Dulce<small>es legítimo</small></span>
            <kbd>D</kbd>
          </button>
          <button className="btn-decision truco" onClick={() => responder("truco")}>
            <span className="bd-icono">🎃</span>
            <span className="bd-texto">Truco<small>es phishing</small></span>
            <kbd>T</kbd>
          </button>
        </div>
      )}

      {fase === "feedback" && resultado && (
        <section className={`informe informe-${resultado.tipo}`}>
          <header className="informe-cabecera">
            <div>
              <h2>{resultado.titulo}</h2>
              <p>{resultado.sub}</p>
            </div>
            {resultado.acerto ? (
              <ul className="desglose">
                {resultado.desglose.map((d) => (
                  <li key={d.txt}><span>+{d.pts}</span> {d.txt}</li>
                ))}
              </ul>
            ) : (
              <span className="veredicto-chip">
                Era {correo.es_phishing ? "🎃 Truco" : "🍬 Dulce"}
              </span>
            )}
          </header>

          <p className="informe-explica">{correo.explicacion}</p>

          <h3 className="pistas-titulo">
            {correo.es_phishing ? "Las pistas de la trampa" : "Por qué era de confianza"}
            <small>Pasa el mouse por cada pista para verla en la carta</small>
          </h3>
          <ol className={`pistas ${correo.es_phishing ? "peligro" : "seguro"}`}>
            {correo.senales.map((s, k) => {
              const tieneMarca = !!correo.marcas?.[k];
              return (
                <li
                  key={k}
                  style={{ animationDelay: `${0.25 + k * 0.12}s` }}
                  className={pistaActiva === k + 1 ? "activa" : ""}
                  onMouseEnter={() => tieneMarca && setPistaActiva(k + 1)}
                  onMouseLeave={() => setPistaActiva(null)}
                  onFocus={() => tieneMarca && setPistaActiva(k + 1)}
                  onBlur={() => setPistaActiva(null)}
                  tabIndex={tieneMarca ? 0 : -1}
                >
                  <span className="pista-num">{k + 1}</span>
                  <span>{s}</span>
                </li>
              );
            })}
          </ol>

          <button className="btn btn-primario" onClick={siguiente}>
            {i + 1 < mazo.length ? "Siguiente carta" : "Ver mi resultado"}
            <kbd>Enter</kbd>
          </button>
        </section>
      )}
    </main>
  );
}
