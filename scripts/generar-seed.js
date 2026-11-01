// Genera supabase/seed.sql a partir de data/correos.js
// Uso: npm run seed
import { writeFileSync } from "node:fs";
import { CORREOS } from "../data/correos.js";

const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replaceAll("'", "''")}'`);
const j = (v) => `${q(JSON.stringify(v))}::jsonb`;

const filas = CORREOS.map(
  (c) =>
    `  (${q(c.id)}, ${q(c.remitente_nombre)}, ${q(c.remitente_email)}, ${q(c.asunto)}, ${q(c.cuerpo)}, ${j(
      c.links
    )}, ${q(c.adjunto)}, ${c.es_phishing}, ${j(c.senales)}, ${q(c.explicacion)})`
);

const sql = `-- Generado automáticamente con \`npm run seed\`. No editar a mano: edita data/correos.js.
-- Pégalo en Supabase → SQL Editor DESPUÉS de schema.sql.

insert into public.correos
  (id, remitente_nombre, remitente_email, asunto, cuerpo, links, adjunto, es_phishing, senales, explicacion)
values
${filas.join(",\n")}
on conflict (id) do update set
  remitente_nombre = excluded.remitente_nombre,
  remitente_email  = excluded.remitente_email,
  asunto           = excluded.asunto,
  cuerpo           = excluded.cuerpo,
  links            = excluded.links,
  adjunto          = excluded.adjunto,
  es_phishing      = excluded.es_phishing,
  senales          = excluded.senales,
  explicacion      = excluded.explicacion;
`;

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log(`seed.sql generado con ${CORREOS.length} correos`);
