import type { Configuracion } from "../types/Settings.ts";
import { listarCiudades } from "../storage/citiesStorage.ts";
import { mostrarTitulo } from "../presentation/output.ts";
import { cian } from "../utils/colors.ts";

// Lista todas las ciudades guardadas
export async function listCities(): Promise<void> {
  const ciudades = await listarCiudades();
  if (ciudades.length === 0) {
    mostrarTitulo("No hay ciudades registradas.");
    return;
  }
  console.log(`\n  ${cian("Ciudades guardadas:")}`);
  ciudades.forEach((ciudad, i) => {
    const pais = ciudad.pais ? ` (${ciudad.pais})` : "";
    console.log(`  ${i + 1}. ${ciudad.nombre}${pais}`);
  });
}
