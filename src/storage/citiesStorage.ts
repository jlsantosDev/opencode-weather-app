import type { Ciudad } from "../types/City.ts";
import { cargarConfiguracion, guardarConfiguracion } from "./settingsStorage.ts";

// Lista todas las ciudades guardadas
export async function listarCiudades(): Promise<Ciudad[]> {
  const config = await cargarConfiguracion();
  return config.ciudades;
}

// Agrega una ciudad a la lista
export async function agregarCiudad(ciudad: Ciudad): Promise<void> {
  const config = await cargarConfiguracion();
  config.ciudades.push(ciudad);
  await guardarConfiguracion(config);
}

// Elimina una ciudad por su índice
export async function eliminarCiudad(indice: number): Promise<Ciudad | null> {
  const config = await cargarConfiguracion();
  const [eliminada] = config.ciudades.splice(indice, 1);
  if (eliminada && eliminada.nombre === config.ciudadPredeterminada) {
    config.ciudadPredeterminada = config.ciudades[0]?.nombre ?? null;
  }
  await guardarConfiguracion(config);
  return eliminada ?? null;
}

// Verifica si una ciudad ya está registrada
export async function ciudadExiste(ciudad: Ciudad): Promise<boolean> {
  const config = await cargarConfiguracion();
  return config.ciudades.some(
    (c) => c.nombre === ciudad.nombre && c.latitud === ciudad.latitud,
  );
}
