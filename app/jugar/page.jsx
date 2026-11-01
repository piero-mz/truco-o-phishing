"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import EmailCard from "@/components/EmailCard";
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

export default function Jugar() {
  const [fase, setFase] = useState("inicio"); // inicio | jugando | feedback | fin
  const [nombre, setNombre] = useState("");
  const [mazo, setMazo] = useState([]);
  const [i, setI] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [monstruos, setMonstruos] = useState([]);
  const [restante, setRestante] = useState(SEGUNDOS);
  const [linksClicados, setLinksClicados] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [miId, setMiId] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    try {
      const n = localStorage.getItem("top-nombre");
      if (n) setNombre(n);
    } catch {}
  }, []);

  // Cuenta regresiva por correo
  useEffect(() => {
    if (fase !== "jugando") return;
    timer.current = setInterval(() => setRestante((s) => s - 1), 1000);
    return () => clearInterval(timer.current);
  }, [fase, i]);

  useEffect(() => {
    if (fase === "jugando" && restante <= 0) responder(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restante, fase]);

  const correo = mazo[i];

  function agregarMonstruo() {
    setMonstruos((m) => [...m, MONSTRUOS[m.length % MONSTRUOS.length]]);
  }

  async function empezar(e) {
    e.preventDefault();
    const n = nombre.trim().slice(0, 20);
    if (!n) return;
    try {
      localStorage.setItem("top-nombre", n);
    } catch {}
    setNombre(n);
    const todos = await cargarCorreos();
    setMazo(barajar(todos).slice(0, CORREOS_POR_PARTIDA));
    setI(0);
    setPuntaje(0);
    setAciertos(0);
    setMonstruos([]);
    setMiId(null);
    setLinksClicados([]);
    setRestante(SEGUNDOS);
    setFase("jugando");
  }

  function clicEnLink(idx, link) {
    if (fase !== "jugando" || linksClicados.includes(idx)) return;
    setLinksClicados((l) => [...l, idx]);
    if (link.malicioso) {
      setPuntaje((p) => p - PENALIDAD_LINK);
      agregarMonstruo();
      setAviso({ tipo: "malo", texto: `¡Te atraparon! Ese link iba a ${link.url} (−${PENALIDAD_LINK})` });
    } else {
      setAviso({ tipo: "bueno", texto: "Link seguro. Pero ¿y el resto del correo?" });
    }
    setTimeout(() => setAviso(null), 2600);
  }

  // eleccion: "truco" | "dulce" | null (se acabó el tiempo)
  function responder(eleccion) {
    if (fase !== "jugando") return;
    clearInterval(timer.current);
    const correcta = correo.es_phishing ? "truco" : "dulce";
    const acerto = eleccion === correcta;
    let ganados = 0;
    if (acerto) {
      ganados = PTS_ACIERTO + Math.round((PTS_RAPIDEZ * Math.max(restante, 0)) / SEGUNDOS);
      setAciertos((a) => a + 1);
      setPuntaje((p) => p + ganados);
    } else if (correo.es_phishing) {
      agregarMonstruo(); // le abriste la puerta a un monstruo
    }
    setResultado({ eleccion, acerto, ganados });
    setFase("feedback");
  }

  async function siguiente() {
    if (i + 1 < mazo.length) {
      setI(i + 1);
      setLinksClicados([]);
      setResultado(null);
      setRestante(SEGUNDOS);
      setFase("jugando");
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

  // ───────── Pantallas ─────────

  if (fase === "inicio") {
    return (
      <main className="contenedor estrecho">
        <Link href="/" className="volver">← Volver</Link>
        <h1 className="titulo">Truco o Phishing</h1>
        <p className="lead">
          Es noche de Halloween y te llegan {CORREOS_POR_PARTIDA} correos. Algunos son de tus vecinos;
          otros son de monstruos que quieren entrar a tu casa. Tienes {SEGUNDOS} segundos por correo.
        </p>
        <ul className="reglas">
          <li>🍬 <b>Dulce</b> si el correo es legítimo, 🎃 <b>Truco</b> si es phishing.</li>
          <li>Pasa el mouse sobre los links para ver a dónde llevan de verdad.</li>
          <li>Hacer clic en un link malicioso resta {PENALIDAD_LINK} puntos y deja entrar a un monstruo.</li>
          <li>+{PTS_ACIERTO} por acierto y hasta +{PTS_RAPIDEZ} extra por rapidez.</li>
        </ul>
        <form onSubmit={empezar} className="form-nombre">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre de cazador"
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
    const total = mazo.length;
    const mensaje =
      monstruos.length === 0
        ? "Casa intacta. Ningún monstruo logró entrar. 🛡️"
        : monstruos.length <= 2
        ? "Algunos monstruos se colaron, pero sobreviviste."
        : "Tu casa está llena de monstruos… revisa las señales y vuelve a intentarlo.";
    return (
      <main className="contenedor estrecho">
        <h1 className="titulo">Fin de la noche</h1>
        <div className="resumen">
          <div className="big">{puntaje}</div>
          <div>puntos · {aciertos}/{total} aciertos</div>
          <div className="casa">
            🏚️ {monstruos.length ? monstruos.join(" ") : "—"}
          </div>
          <p>{mensaje}</p>
          {guardando && <p className="muted">Guardando en la cripta…</p>}
        </div>
        <Ranking resaltarId={miId} />
        <div className="acciones">
          <button className="btn btn-primario" onClick={() => setFase("inicio")}>Jugar otra vez</button>
          <Link className="btn" href="/analizar">Analizar un correo real</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="contenedor">
      <div className="hud">
        <span>📬 {i + 1}/{mazo.length}</span>
        <span>⭐ {puntaje}</span>
        <span className="casa-mini" title="Monstruos dentro de tu casa">🏚️ {monstruos.join("") || "vacía"}</span>
        <span className={`reloj ${restante <= 5 && fase === "jugando" ? "urgente" : ""}`}>
          ⏳ {fase === "jugando" ? restante : "—"}s
        </span>
      </div>
      <div className="barra-tiempo">
        <div style={{ width: `${(Math.max(restante, 0) / SEGUNDOS) * 100}%` }} />
      </div>

      {aviso && <div className={`aviso aviso-${aviso.tipo}`}>{aviso.texto}</div>}

      <EmailCard
        correo={correo}
        nombre={nombre}
        onLinkClick={clicEnLink}
        revelado={fase === "feedback"}
        linksClicados={linksClicados}
      />

      {fase === "jugando" && (
        <div className="decision">
          <button className="btn btn-dulce" onClick={() => responder("dulce")}>🍬 Dulce</button>
          <button className="btn btn-truco" onClick={() => responder("truco")}>🎃 Truco</button>
        </div>
      )}

      {fase === "feedback" && resultado && (
        <section className={`feedback ${resultado.acerto ? "ok" : "mal"}`}>
          <h3>
            {resultado.acerto
              ? `¡Correcto! +${resultado.ganados}`
              : resultado.eleccion === null
              ? "¡Se acabó el tiempo!"
              : correo.es_phishing
              ? "Le abriste la puerta a un monstruo 🧟"
              : "Era un vecino de verdad y lo dejaste afuera"}
          </h3>
          <p>
            Este correo era <b>{correo.es_phishing ? "🎃 TRUCO (phishing)" : "🍬 DULCE (legítimo)"}</b>.{" "}
            {correo.explicacion}
          </p>
          <h4>{correo.es_phishing ? "Señales de trampa:" : "Por qué era seguro:"}</h4>
          <ul>
            {correo.senales.map((s, k) => (
              <li key={k}>{s}</li>
            ))}
          </ul>
          <button className="btn btn-primario" onClick={siguiente}>
            {i + 1 < mazo.length ? "Siguiente correo →" : "Ver resultados"}
          </button>
        </section>
      )}
    </main>
  );
}
