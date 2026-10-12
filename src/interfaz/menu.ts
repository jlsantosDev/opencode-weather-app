import type { Unidad } from "../datos/configuracion.ts";
import { cian, verde } from "./colores.ts";

const LINEA = cian("════════════════════════════════════════");

// Renderiza el menú con el formato definido en el README.
export function renderMenu(totalCiudades: number, unidad: Unidad): string {
  return [
    LINEA,
    cian("         WEATHER CLI"),
    LINEA,
    "  1. Clima de ciudad default",
    `  2. Clima de todas las ciudades (${totalCiudades})`,
    "  3. Buscar y agregar ciudad",
    "  4. Eliminar ciudad",
    "  5. Establecer ciudad default",
    `  8. Ajustes (°${unidad})`,
    "  9. Salir",
    LINEA,
  ].join("\n");
}

export function listarCiudades(
  ciudades: { nombre: string; pais?: string }[],
  ciudadPredeterminada: string | null,
): string {
  return ciudades
    .map(
      (ciudad, indice) =>
        `  ${indice + 1}. ${ciudad.nombre}${ciudad.pais ? ` (${ciudad.pais})` : ""}` +
        (ciudad.nombre === ciudadPredeterminada ? verde(" [default]") : ""),
    )
    .join("\n");
}
