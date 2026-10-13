import { homedir } from "node:os";
import { join } from "node:path";
import type { Configuracion, Unidad } from "../types/Settings.ts";

const RUTA_ARCHIVO = join(homedir(), ".weather-cli.json");

function configuracionVacia(): Configuracion {
  return { ciudadPredeterminada: null, ciudades: [], unidad: "C" };
}

// Carga la configuración desde ~/.weather-cli.json.
// Si el archivo no existe o está corrupto, devuelve una configuración inicial.
export async function cargarConfiguracion(): Promise<Configuracion> {
  const archivo = Bun.file(RUTA_ARCHIVO);
  if (!(await archivo.exists())) return configuracionVacia();

  try {
    const datos = await archivo.json();
    return {
      ciudadPredeterminada:
        typeof datos.ciudadPredeterminada === "string" ? datos.ciudadPredeterminada : null,
      ciudades: Array.isArray(datos.ciudades) ? datos.ciudades : [],
      unidad: datos.unidad === "F" ? "F" : "C",
    };
  } catch {
    return configuracionVacia();
  }
}

export async function guardarConfiguracion(config: Configuracion): Promise<void> {
  await Bun.write(RUTA_ARCHIVO, JSON.stringify(config, null, 2));
}

// --- Funciones de persistencia específicas para ciudades ---

export async function guardarCiudades(ciudades: Configuracion["ciudades"]): Promise<void> {
  const config = await cargarConfiguracion();
  config.ciudades = ciudades;
  await guardarConfiguracion(config);
}

export async function guardarCiudadPredeterminada(ciudad: string | null): Promise<void> {
  const config = await cargarConfiguracion();
  config.ciudadPredeterminada = ciudad;
  await guardarConfiguracion(config);
}

export async function guardarUnidad(unidad: Unidad): Promise<void> {
  const config = await cargarConfiguracion();
  config.unidad = unidad;
  await guardarConfiguracion(config);
}
