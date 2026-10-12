import { homedir } from "node:os";
import { join } from "node:path";

export type Unidad = "C" | "F";

export interface Ciudad {
  nombre: string;
  latitud: number;
  longitud: number;
  pais?: string;
}

export interface Configuracion {
  ciudadPredeterminada: string | null;
  ciudades: Ciudad[];
  unidad: Unidad;
}

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
