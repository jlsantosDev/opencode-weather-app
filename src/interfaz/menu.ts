import type { Unidad } from "../datos/configuracion.ts";
import { formatearTemperatura, type DiaPronostico } from "../servicios/clima.ts";
import { amarillo, cian, negrita, verde } from "./colores.ts";

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
    "  6. Pronóstico 7 días",
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

const formateadorFecha = new Intl.DateTimeFormat("es", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

// "2026-10-13" → "lun 13 oct". Se construye con Date.UTC para no cambiar de
// día por el desfase horario local.
function formatearFechaCorta(iso: string): string {
  const [anio, mes, dia] = iso.split("-");
  const fecha = new Date(Date.UTC(Number(anio), Number(mes) - 1, Number(dia)));
  return formateadorFecha.format(fecha).replace(/\./g, "").trim();
}

export function renderPronostico(
  nombreCiudad: string,
  dias: readonly DiaPronostico[],
  unidad: Unidad,
): string {
  const lineas = dias.map((dia) => {
    const fecha = formatearFechaCorta(dia.fecha).padEnd(11);
    const temperaturas = amarillo(
      `${formatearTemperatura(dia.maxima, unidad)} / ${formatearTemperatura(dia.minima, unidad)}`.padEnd(18),
    );
    const lluvia = (dia.probLluvia === null ? "—" : `${dia.probLluvia}%`).padEnd(5);
    return `  ${negrita(fecha)}${temperaturas}${lluvia}${dia.descripcion}`;
  });

  return [
    LINEA,
    `  ${negrita(`Pronóstico 7 días — ${nombreCiudad}`)}`,
    LINEA,
    ...lineas,
    LINEA,
  ].join("\n");
}
