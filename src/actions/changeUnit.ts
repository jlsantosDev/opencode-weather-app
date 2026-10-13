import type { Configuracion } from "../types/Settings.ts";
import { guardarUnidad } from "../storage/settingsStorage.ts";
import { mostrarExito } from "../presentation/output.ts";

// Cambia la unidad de temperatura (opción 8)
export async function changeUnit(
  config: Configuracion,
): Promise<void> {
  config.unidad = config.unidad === "C" ? "F" : "C";
  await guardarUnidad(config.unidad);
  mostrarExito(`Ajustes: temperatura en °${config.unidad}`);
}
