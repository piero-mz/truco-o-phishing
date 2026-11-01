"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import EmailCard, { Sobre } from "@/components/EmailCard";
import Ranking from "@/components/Ranking";
import { supabase } from "@/lib/supabase";
import { CORREOS } from "@/data/correos";

const CORREOS_POR_PARTIDA = 8;
const SEGUNDOS = 25;
const PTS_ACIERTO = 100;
const PTS_RAPIDEZ = 50;
const PENALIDAD_LINK = 50;
const MONSTRUOS = ["🧟", "🧛", "👻", "🧙", "🕷️", "💀", "🦇", "🎃"];

function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function cargarCorreos() {
  if (supabase) {
    const { data, error } = await supabase.from("correos").select("*");
    if (!error && data?.length) return data;
    if (error) console.warn("Usando correos locales:", error.message);
  }
  return CORREOS;
}

function rango(monstruos, aciertos, total) {
  if (aciertos === total && monstruos === 0) return "Guardián de la cripta";
  if (monstruos === 0) return "Casa intacta";
  if (monstruos <= 2) return "Cazador con cicatrices";
  if (monstruos <= 4) return "Casa embrujada";
  return "Fiesta de monstruos en tu sala";
}

export default function Jugar() {
  // inicio → sobre → jugando → feedback → (sobre … ) → fin
  const [fase, setFase] = useState("inicio");
  const [nombre, setNombre] = useState("");
  const [mazo, setMazo] = useState([]);
  const [i, setI] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [resultados, setResultados] = useState([]); // true/false por carta
  const [monstruos, setMonstruos] = useState([]);
  const [restante, setRestante] = useState(SEGUNDOS);
  const [linksClicados, setLinksClicados] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [sacudir, setSacudir] = useState(0);
  const [miId, setMiId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const timer = useRef(null);

  const correo = mazo[i];
  const aciertos = resultados.filter(Boolean).length;

  useEffect(() => {
    try {
      const n = localStorage.getItem("top-nombre");
      if (n) setNombre(n);
    } catch {}
  }, []);

  // Cuenta regresiva: solo con la carta abierta
  useEffect(() => {
    if (fase !== "jugando") return;
    timer.current = setInterval(() => setRestante((s) => s - 1), 1000);
    return () => clearInterval(timer.current);
  }, [fase, i]);

  function agregarMonstruo() {
    setMonstruos((m) => [...m, MONSTRUOS[m.length % MONSTRUOS.length]]);
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
    setMiId(null);
    setLinksClicados([]);
    setResultado(null);
    setRestante(SEGUNDOS);
    setFase("sobre");
  }

  function abrir() {
    setRestante(SEGUNDOS);
    setFase("jugando");
  }

  function clicEnLink(idx, link) {
    if (fase !== "jugando" || linksClicados.includes(idx)) return;
    setLinksClicados((l) => [...l, idx]);
    if (link.malicioso) {
      setPuntaje((p) => p - PENALIDAD_LINK);
      agregarMonstruo();
      setSacudir((s) => s + 1);
      setAviso({ tipo: "malo", texto: `¡Te atraparon! Ese link iba a ${link.url}. Pierdes ${PENALIDAD_LINK} puntos.` });
    } else {
      setAviso({ tipo: "bueno", texto: "Ese link es seguro, pero revisa el resto de la carta." });
    }
    setTimeout(() => setAviso(null), 2800);
  }

  // eleccion: "truco" | "dulce" | null (se acabó el tiempo)
  const responder = useCallback(
    (eleccion) => {
      if (fase !== "jugando") return;
      clearInterval(timer.current);
      const correcta = correo.es_phishing ? "truco" : "dulce";
      const acerto = eleccion === correcta;
      let ganados = 0;
      if (acerto) {
        ganados = PTS_ACIERTO + Math.round((PTS_RAPIDEZ * Math.max(restante, 0)) / SEGUNDOS);
        setPuntaje((p) => p + ganados);
      } else if (correo.es_phishing) {
        agregarMonstruo(); // le abriste la puerta a un monstruo
      }
      setResultados((r) => [...r, acerto]);
      setResultado({ eleccion, acerto, ganados });
      setFase("feedback");
    },
    [fase, correo, restante]
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

  // Atajos de teclado: Enter abre / continúa, D = dulce, T = truco
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      const k = e.key.toLowerCase();
      if (fase === "sobre" && (k === "enter" || k === " ")) { e.preventDefault(); abrir(); }
      else if (fase === "jugando" && (k === "d" || k === "arrowleft")) responder("dulce");
      else if (fase === "jugando" && (k === "t" || k === "arrowright")) responder("truco");
      else if (fase === "feedback" && k === "enter") { e.preventDefault(); siguiente(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ───────── Pantallas ─────────

  if (fase === "inicio") {
    return (
      <main className="contenedor estrecho">
        <Link href="/" className="volver">← Inicio</Link>
        <h1 className="titulo">Te llegaron {CORREOS_POR_PARTIDA} cartas</h1>
        <p className="lead">
          Algunas son de tus vecinos. Otras son de monstruos que quieren entrar a tu casa.
        </p>
        <ul className="reglas">
          <li><span className="ic">🍬</span><span><b>Dulce</b> si la carta es legítima, <b>Truco</b> si es phishing.</span></li>
          <li><span className="ic">🔍</span><span>Pasa el mouse sobre los links para ver a dónde llevan de verdad.</span></li>
          <li><span className="ic">⏳</span><span>Tienes {SEGUNDOS} segundos por carta. Mientras más rápido aciertes, más puntos (hasta {PTS_ACIERTO + PTS_RAPIDEZ}).</span></li>
          <li><span className="ic">🧟</span><span>Cada error o clic en un link malicioso deja entrar a un monstruo.</span></li>
        </ul>
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

  if (fase === "fin") {
    return (
      <main className="contenedor estrecho">
        <div className="resumen">
          <p className="rango">{rango(monstruos.length, aciertos, mazo.length)}</p>
          <p className="big">{puntaje}</p>
          <p>puntos · {aciertos} de {mazo.length} cartas bien selladas</p>
          <div className="casa" aria-label={`${monstruos.length} monstruos en tu casa`}>
            🏚️ {monstruos.length ? monstruos.join(" ") : "sin visitas"}
          </div>
          {guardando && <p className="muted">Anotando tu nombre en el registro…</p>}
        </div>
        <div className="acciones" style={{ justifyContent: "center" }}>
          <button className="btn btn-primario" onClick={() => setFase("inicio")}>Jugar otra vez</button>
          <Link className="btn" href="/analizar">Revisar un correo real</Link>
        </div>
        <Ranking resaltarId={miId} />
      </main>
    );
  }

  const urgente = fase === "jugando" && restante <= 5;

  return (
    <main className="contenedor">
      <div className="hud">
        <ol className="progreso" aria-label={`Carta ${i + 1} de ${mazo.length}`}>
          {mazo.map((_, k) => (
            <li
              key={k}
              className={k < resultados.length ? (resultados[k] ? "ok" : "mal") : k === i ? "actual" : ""}
            />
          ))}
        </ol>
        <div className="hud-datos">
          <span className="casa-mini" title="Monstruos dentro de tu casa">🏚️ {monstruos.join("") || "0"}</span>
          <span className="puntos" aria-label="Puntos">{puntaje}</span>
          <span className={`reloj ${urgente ? "urgente" : ""}`} aria-label="Segundos restantes">
            {fase === "jugando" ? `${restante}s` : "—"}
          </span>
        </div>
      </div>
      <div className={`mecha ${urgente ? "urgente" : ""}`}>
        <div style={{ width: `${fase === "jugando" ? (Math.max(restante, 0) / SEGUNDOS) * 100 : fase === "sobre" ? 100 : 0}%` }} />
      </div>

      {aviso && <div className={`aviso aviso-${aviso.tipo}`} role="status">{aviso.texto}</div>}

      {fase === "sobre" ? (
        <Sobre key={`sobre-${i}`} correo={correo} numero={i + 1} onAbrir={abrir} />
      ) : (
        <EmailCard
          key={`carta-${i}-${sacudir}`}
          correo={correo}
          nombre={nombre}
          onLinkClick={clicEnLink}
          sello={fase === "feedback" ? (correo.es_phishing ? "truco" : "dulce") : null}
          linksClicados={linksClicados}
          sacudir={sacudir > 0 && fase === "jugando"}
        />
      )}

      {fase === "jugando" && (
        <div className="decision">
          <button className="btn btn-dulce" onClick={() => responder("dulce")}>🍬 Dulce<kbd>D</kbd></button>
          <button className="btn btn-truco" onClick={() => responder("truco")}>🎃 Truco<kbd>T</kbd></button>
        </div>
      )}

      {fase === "feedback" && resultado && (
        <section className={`feedback ${resultado.acerto ? "ok" : "mal"}`}>
          <h3>
            {resultado.acerto
              ? `Bien sellada. Ganas ${resultado.ganados} puntos.`
              : resultado.eleccion === null
              ? "Se acabó el tiempo."
              : correo.es_phishing
              ? "Le abriste la puerta a un monstruo."
              : "Era tu vecino y lo dejaste afuera."}
          </h3>
          <p>{correo.explicacion}</p>
          <h4>{correo.es_phishing ? "Señales de la trampa" : "Por qué era de confianza"}</h4>
          <ul>
            {correo.senales.map((s, k) => (
              <li key={k}>{s}</li>
            ))}
          </ul>
          <button className="btn btn-primario" onClick={siguiente} autoFocus>
            {i + 1 < mazo.length ? "Abrir la siguiente carta" : "Ver cómo terminó la noche"}
            <kbd>Enter</kbd>
          </button>
        </section>
      )}
    </main>
  );
}
