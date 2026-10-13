import type { Unidad } from "../types/Settings.ts";

export function formatearTemperatura(temperatura: number, unidad: Unidad): string {
  return `${temperatura.toFixed(1)}°${unidad}`;
}

const formateadorFecha = new Intl.DateTimeFormat("es", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  timeZone: "UTC",
});

// "2026-10-13" → "lun 13 oct". Se construye con Date.UTC para no cambiar de
// día por el desfase horario local.
export function formatearFechaCorta(iso: string): string {
  const [anio, mes, dia] = iso.split("-");
  const fecha = new Date(Date.UTC(Number(anio), Number(mes) - 1, Number(dia)));
  return formateadorFecha.format(fecha).replace(/\./g, "").trim();
}
