import type * as readline from "node:readline/promises";
import type { Configuracion } from "../types/Settings.ts";
import { buscarCiudad } from "../api/geocoding.ts";
import { agregarCiudad, ciudadExiste } from "../storage/citiesStorage.ts";
import { guardarCiudadPredeterminada } from "../storage/settingsStorage.ts";
import { pedirTexto } from "../presentation/input.ts";
import {
  mostrarAdvertencia,
  mostrarError,
  mostrarExito,
} from "../presentation/output.ts";
import { negrita } from "../utils/colors.ts";

// Busca y agrega una ciudad a la lista (opción 3)
export async function addCity(
  rl: readline.Interface,
  config: Configuracion,
): Promise<void> {
  const nombre = await pedirTexto(rl, "\n  Ingresa el nombre de la ciudad: ");
  if (!nombre) {
    mostrarError("El nombre no puede estar vacío.");
    return;
  }
  const ciudad = await buscarCiudad(nombre);
  if (!ciudad) {
    mostrarError(`No se encontró la ciudad "${nombre}".`);
    return;
  }
  const yaExiste = await ciudadExiste(ciudad);
  if (yaExiste) {
    mostrarAdvertencia(`${ciudad.nombre} ya está registrada.`);
    return;
  }
  config.ciudades.push(ciudad);
  await agregarCiudad(ciudad);
  if (!config.ciudadPredeterminada) {
    config.ciudadPredeterminada = ciudad.nombre;
    await guardarCiudadPredeterminada(ciudad.nombre);
  }
  const pais = ciudad.pais ? ` (${ciudad.pais})` : "";
  mostrarExito(`Ciudad agregada: ${negrita(ciudad.nombre)}${pais}`);
}
