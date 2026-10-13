import type { Ciudad } from "../types/City.ts";

interface ResultadoGeocodificacion {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

interface RespuestaGeocodificacion {
  results?: ResultadoGeocodificacion[];
}

// Paso 1: busca una ciudad por nombre y devuelve sus coordenadas (o null si no existe).
export async function buscarCiudad(nombre: string): Promise<Ciudad | null> {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", nombre);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const respuesta = await fetch(url);
  if (!respuesta.ok) {
    throw new Error(`Error al buscar la ciudad (HTTP ${respuesta.status})`);
  }

  const datos = (await respuesta.json()) as RespuestaGeocodificacion;
  const resultado = datos.results?.[0];
  if (!resultado) return null;

  return {
    nombre: resultado.name,
    latitud: resultado.latitude,
    longitud: resultado.longitude,
    pais: resultado.country,
  };
}
