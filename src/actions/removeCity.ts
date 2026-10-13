import type * as readline from "node:readline/promises";
import type { Configuracion } from "../types/Settings.ts";
import { eliminarCiudad } from "../storage/citiesStorage.ts";
import { elegirCiudad } from "../presentation/input.ts";
import { mostrarExito } from "../presentation/output.ts";

// Elimina una ciudad de la lista (opción 4)
export async function removeCity(
  rl: readline.Interface,
  config: Configuracion,
): Promise<void> {
  const ciudad = await elegirCiudad(rl, config);
  if (!ciudad) return;
  const indice = config.ciudades.indexOf(ciudad);
  const eliminada = await eliminarCiudad(indice);
  config.ciudades.splice(indice, 1);
  if (eliminada && eliminada.nombre === config.ciudadPredeterminada) {
    config.ciudadPredeterminada = config.ciudades[0]?.nombre ?? null;
  }
  mostrarExito(`Se eliminó ${eliminada?.nombre ?? "la ciudad"}.`);
}
