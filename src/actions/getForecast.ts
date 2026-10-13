import type * as readline from "node:readline/promises";
import type { Configuracion } from "../types/Settings.ts";
import { obtenerPronostico7Dias } from "../api/weather.ts";
import { elegirCiudad } from "../presentation/input.ts";
import { renderPronostico } from "../presentation/menu.ts";
import { cian } from "../utils/colors.ts";

// Obtiene el pronóstico de 7 días para una ciudad (opción 6)
export async function getForecast(
  rl: readline.Interface,
  config: Configuracion,
): Promise<void> {
  const ciudad = await elegirCiudad(rl, config);
  if (!ciudad) return;
  console.log(`\n  ${cian("Consultando pronóstico…")}`);
  const dias = await obtenerPronostico7Dias(ciudad, config.unidad);
  console.log("\n" + renderPronostico(ciudad.nombre, dias, config.unidad));
}
