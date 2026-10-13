import { beforeEach, describe, expect, test } from "bun:test";
import { homedir } from "node:os";
import { join } from "node:path";
import { rm, writeFile } from "node:fs/promises";
import { cargarConfiguracion, guardarConfiguracion, guardarUnidad } from "../../src/storage/settingsStorage.ts";
import type { Configuracion } from "../../src/types/Settings.ts";

const RUTA = join(homedir(), ".weather-cli.json");

async function limpiar() {
  await rm(RUTA, { force: true });
}

describe("settingsStorage", () => {
  beforeEach(limpiar);

  test("devuelve config vacía cuando no existe archivo", async () => {
    const config = await cargarConfiguracion();
    expect(config).toEqual({ ciudadPredeterminada: null, ciudades: [], unidad: "C" });
  });

  test("guarda y carga configuración", async () => {
    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [{ nombre: "Madrid", latitud: 40.4168, longitud: -3.7038 }],
      unidad: "F",
    };
    await guardarConfiguracion(config);

    const cargada = await cargarConfiguracion();
    expect(cargada).toEqual(config);
  });

  test("devuelve defaults cuando JSON está corrupto", async () => {
    await writeFile(RUTA, "esto no es JSON {{{");

    const config = await cargarConfiguracion();
    expect(config).toEqual({ ciudadPredeterminada: null, ciudades: [], unidad: "C" });
  });

  test("guardarUnidad actualiza solo la unidad", async () => {
    await guardarConfiguracion({
      ciudadPredeterminada: "Madrid",
      ciudades: [{ nombre: "Madrid", latitud: 40.4168, longitud: -3.7038 }],
      unidad: "C",
    });

    await guardarUnidad("F");

    const config = await cargarConfiguracion();
    expect(config.unidad).toBe("F");
    expect(config.ciudadPredeterminada).toBe("Madrid");
  });
});
