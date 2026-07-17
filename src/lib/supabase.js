import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* mapea errores comunes de Supabase Auth a mensajes en español */
export function errorAuthEnEspanol(error) {
  if (!error) return "";
  const msg = error.message || "";

  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return "No hay conexión a internet. Revisá tu red e intentá de nuevo.";
  }
  if (msg.includes("already registered") || msg.includes("already exists") || error.code === "user_already_exists") {
    return "Ese email ya tiene una cuenta creada. Iniciá sesión en vez de registrarte.";
  }
  if (msg.includes("Password should be at least") || error.code === "weak_password") {
    return "La contraseña es muy corta. Usá al menos 6 caracteres.";
  }
  if (msg.includes("Invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (msg.includes("Email not confirmed")) {
    return "Todavía no confirmaste tu email. Revisá tu casilla de entrada.";
  }
  if (msg.includes("Unable to validate email") || msg.includes("invalid") && msg.includes("email")) {
    return "Ese email no es válido.";
  }
  if (error.status === 429 || msg.includes("rate limit") || msg.includes("Too Many")) {
    return "Se registraron muchas cuentas seguidas y se alcanzó el límite temporal del servidor. Esperá unos minutos e intentá de nuevo.";
  }
  return "Algo salió mal. Intentá de nuevo en unos segundos.";
}
