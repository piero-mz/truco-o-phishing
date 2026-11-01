"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Top 10 en tiempo real: se suscribe a los INSERT de la tabla `partidas`.
export default function Ranking({ resaltarId }) {
  const [filas, setFilas] = useState([]);
  const [estado, setEstado] = useState(supabase ? "cargando" : "sin-config");

  useEffect(() => {
    if (!supabase) return;

    async function cargar() {
      const { data, error } = await supabase
        .from("partidas")
        .select("id, nombre, puntaje, aciertos, total, monstruos")
        .order("puntaje", { ascending: false })
        .order("creado_en", { ascending: true })
        .limit(10);
      if (error) {
        console.error(error);
        setEstado("error");
        return;
      }
      setFilas(data);
      setEstado("ok");
    }

    cargar();

    const canal = supabase
      .channel("ranking-en-vivo")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "partidas" }, cargar)
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  return (
    <section className="ranking">
      <h3>🏆 Ranking de cazadores de phishing <span className="en-vivo">● en vivo</span></h3>
      {estado === "sin-config" && <p className="muted">Configura Supabase en .env.local para activar el ranking.</p>}
      {estado === "error" && <p className="muted">No se pudo cargar el ranking.</p>}
      {estado === "cargando" && <p className="muted">Invocando puntajes…</p>}
      {estado === "ok" && filas.length === 0 && <p className="muted">Nadie ha jugado todavía. ¡Sé el primero!</p>}
      {filas.length > 0 && (
        <ol>
          {filas.map((f, i) => (
            <li key={f.id} className={f.id === resaltarId ? "yo" : ""}>
              <span className="pos">{["🥇", "🥈", "🥉"][i] || i + 1}</span>
              <span className="nom">{f.nombre}</span>
              <span className="det">
                {f.aciertos}/{f.total} · {f.monstruos} 🧟
              </span>
              <span className="pts">{f.puntaje}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
