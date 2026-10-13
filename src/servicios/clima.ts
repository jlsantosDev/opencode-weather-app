import type { Ciudad, Unidad } from "../datos/configuracion.ts";

export interface DiaPronostico {
  fecha: string; // "YYYY-MM-DD" (día local de la ciudad)
  maxima: number;
  minima: number;
  probLluvia: number | null;
  descripcion: string; // condición en español (código WMO)
}

// Paso 2: obtiene la temperatura actual para las coordenadas de una ciudad.
export async function obtenerTemperatura(ciudad: Ciudad, unidad: Unidad): Promise<number> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(ciudad.latitud));
  url.searchParams.set("longitude", String(ciudad.longitud));
  url.searchParams.set("current", "temperature_2m");
  if (unidad === "F") {
    url.searchParams.set("temperature_unit", "fahrenheit");
  }

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`Error al obtener el clima (HTTP ${respuesta.status})`);
  }

  const datos = (await respuesta.json()) as { current?: { temperature_2m?: number | null } };
  const temperatura = datos.current?.temperature_2m;
  if (typeof temperatura !== "number") {
    throw new Error("La respuesta del servidor no incluye la temperatura");
  }
  return temperatura;
}

export function formatearTemperatura(temperatura: number, unidad: Unidad): string {
  return `${temperatura.toFixed(1)}°${unidad}`;
}

// Códigos WMO de Open-Meteo → descripción en español.
const DESCRIPCIONES_CODIGO: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna",
  55: "Llovizna densa",
  56: "Llovizna helada",
  57: "Llovizna helada densa",
  61: "Lluvia ligera",
  63: "Lluvia",
  65: "Lluvia intensa",
  66: "Lluvia helada",
  67: "Lluvia helada intensa",
  71: "Nevada ligera",
  73: "Nevada",
  75: "Nevada intensa",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos",
  82: "Chubascos intensos",
  85: "Chubascos de nieve",
  86: "Chubascos de nieve intensos",
  95: "Tormenta",
  96: "Tormenta con granizo",
  99: "Tormenta con granizo intenso",
};

function describirCodigoClima(codigo: number | null): string {
  if (codigo === null) return "—";
  return DESCRIPCIONES_CODIGO[codigo] ?? `Código ${codigo}`;
}

// Obtiene el pronóstico diario de los próximos 7 días para una ciudad.
export async function obtenerPronostico7Dias(
  ciudad: Ciudad,
  unidad: Unidad,
): Promise<DiaPronostico[]> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(ciudad.latitud));
  url.searchParams.set("longitude", String(ciudad.longitud));
  url.searchParams.set(
    "daily",
    "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
  );
  url.searchParams.set("forecast_days", "7");
  url.searchParams.set("timezone", "auto");
  if (unidad === "F") {
    url.searchParams.set("temperature_unit", "fahrenheit");
  }

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`Error al obtener el pronóstico (HTTP ${respuesta.status})`);
  }

  const datos = (await respuesta.json()) as {
    daily?: Record<string, unknown>;
  };
  const diario = datos.daily;
  if (!diario) {
    throw new Error("La respuesta del servidor no incluye el pronóstico");
  }

  const fechas = diario.time;
  const maximas = diario.temperature_2m_max;
  const minimas = diario.temperature_2m_min;
  const lluvias = diario.precipitation_probability_max;
  const codigos = diario.weather_code;

  if (
    !Array.isArray(fechas) ||
    !Array.isArray(maximas) ||
    !Array.isArray(minimas) ||
    !Array.isArray(lluvias) ||
    !Array.isArray(codigos) ||
    fechas.length === 0
  ) {
    throw new Error("La respuesta del servidor no incluye el pronóstico");
  }
  if (
    maximas.length !== fechas.length ||
    minimas.length !== fechas.length ||
    lluvias.length !== fechas.length ||
    codigos.length !== fechas.length
  ) {
    throw new Error("La respuesta del servidor está incompleta");
  }

  const dias: DiaPronostico[] = [];
  for (let i = 0; i < fechas.length; i++) {
    const fecha = fechas[i];
    const maxima = maximas[i];
    const minima = minimas[i];
    const lluvia = lluvias[i];
    const codigo = codigos[i];

    if (
      typeof fecha !== "string" ||
      typeof maxima !== "number" ||
      typeof minima !== "number"
    ) {
      throw new Error("La respuesta del servidor no incluye el pronóstico");
    }

    dias.push({
      fecha,
      maxima,
      minima,
      probLluvia: typeof lluvia === "number" ? lluvia : null,
      descripcion: describirCodigoClima(typeof codigo === "number" ? codigo : null),
    });
  }
  return dias;
}
