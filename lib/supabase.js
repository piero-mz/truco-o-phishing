import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Si no hay credenciales, la app sigue funcionando con los correos locales
// (útil para desarrollar), pero el ranking queda desactivado.
export const supabase = url && key ? createClient(url, key) : null;
