import type * as readline from "node:readline/promises";
import type { Configuracion } from "../types/Settings.ts";
import { guardarCiudadPredeterminada } from "../storage/settingsStorage.ts";
import { elegirCiudad } from "../presentation/input.ts";
import { mostrarExito } from "../presentation/output.ts";
import { negrita } from "../utils/colors.ts";

// Establece la ciudad default (opción 5)
export async function setDefaultCity(
  rl: readline.Interface,
  config: Configuracion,
): Promise<void> {
  const ciudad = await elegirCiudad(rl, config);
  if (!ciudad) return;
  config.ciudadPredeterminada = ciudad.nombre;
  await guardarCiudadPredeterminada(ciudad.nombre);
  mostrarExito(`Ciudad default: ${negrita(ciudad.nombre)}`);
}
