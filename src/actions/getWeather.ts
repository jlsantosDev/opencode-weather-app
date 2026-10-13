import type * as readline from "node:readline/promises";
import type { Configuracion } from "../types/Settings.ts";
import { obtenerTemperatura } from "../api/weather.ts";
import { formatearTemperatura } from "../utils/format.ts";
import {
  mostrarAdvertencia,
  mostrarClimaActual,
  mostrarClimaCiudad,
  mostrarErrorCiudad,
} from "../presentation/output.ts";

// Obtiene el clima de la ciudad default (opción 1)
export async function getWeatherDefault(
  config: Configuracion,
): Promise<void> {
  const ciudad = config.ciudades.find((c) => c.nombre === config.ciudadPredeterminada);
  if (!ciudad) {
    mostrarAdvertencia("No hay ciudad default. Agrega una con la opción 3.");
    return;
  }
  const temperatura = await obtenerTemperatura(ciudad, config.unidad);
  mostrarClimaActual(
    ciudad.nombre,
    formatearTemperatura(temperatura, config.unidad),
  );
}

// Obtiene el clima de todas las ciudades (opción 2)
export async function getWeatherAll(
  config: Configuracion,
): Promise<void> {
  if (config.ciudades.length === 0) {
    mostrarAdvertencia("No hay ciudades registradas. Agrega una con la opción 3.");
    return;
  }
  console.log("");
  for (const ciudad of config.ciudades) {
    try {
      const temperatura = await obtenerTemperatura(ciudad, config.unidad);
      mostrarClimaCiudad(
        ciudad.nombre,
        formatearTemperatura(temperatura, config.unidad),
      );
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "desconocido";
      mostrarErrorCiudad(ciudad.nombre, mensaje);
    }
  }
}
