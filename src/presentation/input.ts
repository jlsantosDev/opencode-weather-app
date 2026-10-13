import * as readline from "node:readline/promises";
import type { Ciudad } from "../types/City.ts";
import type { Configuracion } from "../types/Settings.ts";
import { listarCiudades } from "./menu.ts";
import { mostrarAdvertencia, mostrarError } from "./output.ts";
import { rojo } from "../utils/colors.ts";

// Pide un número de ítem (1-based) y devuelve el índice, o null si es inválido.
export async function pedirIndice(
  rl: readline.Interface,
  mensaje: string,
): Promise<number | null> {
  const texto = (await rl.question(mensaje)).trim();
  const valor = Number(texto);
  if (!Number.isInteger(valor) || valor < 1) return null;
  return valor - 1;
}

// Pide texto al usuario (no vacío)
export async function pedirTexto(
  rl: readline.Interface,
  mensaje: string,
): Promise<string> {
  return (await rl.question(mensaje)).trim();
}

// Muestra la lista y permite elegir una ciudad. Devuelve null si no hay ciudades
// o la selección es inválida (avisa al usuario en ese caso).
export async function elegirCiudad(
  rl: readline.Interface,
  config: Configuracion,
): Promise<Ciudad | null> {
  if (config.ciudades.length === 0) {
    mostrarAdvertencia("No hay ciudades registradas. Agrega una con la opción 3.");
    return null;
  }
  console.log("\n" + listarCiudades(config.ciudades, config.ciudadPredeterminada));
  const indice = await pedirIndice(rl, "  Selecciona una ciudad: ");
  const ciudad = indice === null ? undefined : config.ciudades[indice];
  if (!ciudad) {
    mostrarError("Opción no válida.");
    return null;
  }
  return ciudad;
}
