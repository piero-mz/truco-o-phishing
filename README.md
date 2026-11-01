# 🎃 Truco o Phishing — Halloween as a Service

Juego web de Halloween para aprender a detectar correos de phishing.
Te llegan correos al buzón: algunos son de vecinos, otros de monstruos que quieren robarte la contraseña.
Decides **🍬 Dulce** (legítimo) o **🎃 Truco** (phishing). Además, un modo con IA analiza correos reales.

## Servicios XaaS

| Servicio | Modelo | Uso en la app |
|---|---|---|
| **Vercel** | PaaS | Hosting del frontend (Next.js) y función serverless `/api/analizar` |
| **Supabase** | BaaS | PostgreSQL con el banco de correos, partidas y ranking en tiempo real (Realtime) |
| **Google Gemini API** | AIaaS | Analiza correos pegados por el usuario y explica las señales de alerta |

```
Navegador ──► Vercel (Next.js)
   │              └── /api/analizar (serverless) ──► Gemini API   (API key solo en el servidor)
   └──────────────────────────────────────────────► Supabase      (correos, partidas, realtime)
```

## Estructura

```
app/
  page.jsx              Inicio (modos + ranking)
  jugar/page.jsx        El juego
  analizar/page.jsx     Analizador de correos con IA
  api/analizar/route.js Función serverless que llama a Gemini
components/
  EmailCard.jsx         El correo en pergamino (links con barra de estado)
  Ranking.jsx           Top 10 en tiempo real
data/correos.js         Los 12 correos del juego (7 trucos, 5 dulces)
lib/supabase.js         Cliente de Supabase
supabase/schema.sql     Tablas + Row Level Security + Realtime
supabase/seed.sql       Inserta los correos (generado con npm run seed)
```

## Paso a paso

### 1. Correr en local
```bash
npm install
cp .env.example .env.local
npm run dev
```
Abre http://localhost:3000. Sin configurar nada, el juego ya funciona con los correos locales
(el ranking y la IA se activan con los pasos siguientes).

### 2. Supabase (BaaS)
1. Crea un proyecto gratis en https://supabase.com
2. Ve a **SQL Editor → New query**, pega `supabase/schema.sql` y dale **Run**.
3. Nueva query: pega `supabase/seed.sql` y **Run**.
4. En **Project Settings → API** copia la *Project URL* y la *anon public key* a `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```

### 3. Gemini (AIaaS)
1. Crea una API key en https://aistudio.google.com/apikey
2. Ponla en `.env.local` como `GEMINI_API_KEY=...` (sin `NEXT_PUBLIC_`, así nunca llega al navegador).
3. Si el modelo por defecto da error, cambia `GEMINI_MODEL` por uno vigente de la lista de Google AI Studio.

Reinicia `npm run dev` después de editar `.env.local`.

### 4. Desplegar en Vercel (PaaS)
1. Sube el proyecto a un repositorio de GitHub.
2. En https://vercel.com → **Add New → Project** → importa el repo.
3. En **Environment Variables** agrega las mismas 3–4 variables de `.env.local`.
4. **Deploy**. Listo: tendrás un link `https://...vercel.app` para compartir.

## Agregar más correos
Edita `data/correos.js` (usa `{nombre}` para el nombre del jugador y `{{0}}`, `{{1}}` para los links),
ejecuta `npm run seed` y vuelve a correr `supabase/seed.sql` en Supabase.

## Seguridad (vale la pena mencionarlo en la exposición)
- **API key de IA solo en el servidor**: la llamada a Gemini pasa por una función serverless.
- **Row Level Security**: la anon key de Supabase es pública, así que las políticas solo permiten leer
  correos/ranking e insertar partidas. Nadie puede editar ni borrar puntajes.
- **Restricciones en la BD**: `check` sobre nombre y rango de puntaje para frenar valores absurdos.
- **Defensa contra prompt injection**: el prompt le indica a la IA que el correo es *dato*, no instrucciones.
- **Links inofensivos**: los links del juego nunca navegan; solo muestran la URL.
- **Marcas inventadas**: ningún correo imita a una empresa real.

Limitación conocida: como el puntaje se envía desde el navegador, alguien con conocimientos podría
insertar un puntaje falso dentro del rango permitido. La mejora sería calcular el puntaje en una
función serverless.
