-- Truco o Phishing — esquema de base de datos (Supabase / PostgreSQL)
-- Pégalo en Supabase → SQL Editor → New query → Run.

-- Banco de correos del juego
create table if not exists public.correos (
  id               text primary key,
  remitente_nombre text not null,
  remitente_email  text not null,
  asunto           text not null,
  cuerpo           text not null,
  links            jsonb not null default '[]'::jsonb,  -- [{texto, url, malicioso}]
  adjunto          text,
  es_phishing      boolean not null,
  senales          jsonb not null default '[]'::jsonb,  -- ["señal 1", ...]
  explicacion      text not null,
  marcas           jsonb not null default '[]'::jsonb   -- texto a resaltar por señal
);

-- Partidas jugadas (ranking)
create table if not exists public.partidas (
  id         bigint generated always as identity primary key,
  nombre     text not null check (char_length(nombre) between 1 and 20),
  puntaje    int  not null check (puntaje between -1000 and 3000),
  aciertos   int  not null check (aciertos >= 0),
  total      int  not null check (total between 1 and 20),
  monstruos  int  not null default 0 check (monstruos between 0 and 50),
  creado_en  timestamptz not null default now(),
  check (aciertos <= total)
);

create index if not exists partidas_puntaje_idx on public.partidas (puntaje desc, creado_en asc);

-- Migración para proyectos creados con la versión anterior
alter table public.correos add column if not exists marcas jsonb not null default '[]'::jsonb;
alter table public.partidas drop constraint if exists partidas_puntaje_check;
alter table public.partidas add constraint partidas_puntaje_check check (puntaje between -1000 and 3000);

-- ── Row Level Security ──
-- Sin RLS, cualquiera con la anon key (que es pública) podría borrar o editar todo.
alter table public.correos  enable row level security;
alter table public.partidas enable row level security;

drop policy if exists "correos: lectura pública" on public.correos;
create policy "correos: lectura pública" on public.correos
  for select to anon, authenticated using (true);

drop policy if exists "partidas: lectura pública" on public.partidas;
create policy "partidas: lectura pública" on public.partidas
  for select to anon, authenticated using (true);

drop policy if exists "partidas: insertar" on public.partidas;
create policy "partidas: insertar" on public.partidas
  for insert to anon, authenticated with check (true);

-- No hay políticas de UPDATE ni DELETE → nadie puede modificar ni borrar puntajes.

-- ── Realtime para el ranking en vivo ──
do $$
begin
  alter publication supabase_realtime add table public.partidas;
exception when duplicate_object then null;
end $$;
