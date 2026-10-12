import type { Ciudad, Unidad } from "../datos/configuracion.ts";

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
