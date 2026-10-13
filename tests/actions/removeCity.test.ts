import { describe, expect, test } from "bun:test";
import { ciudadBuenosAires, ciudadMadrid } from "../helpers/fixtures.ts";
import type { Configuracion } from "../../src/types/Settings.ts";

const { removeCity } = await import("../../src/actions/removeCity.ts");
const { crearRL } = await import("../helpers/rl.ts");
const { guardarConfiguracion } = await import("../../src/storage/settingsStorage.ts");

describe("removeCity", () => {
  test("elimina ciudad seleccionada", async () => {
    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid, ciudadBuenosAires],
      unidad: "C",
    };
    await guardarConfiguracion(config);

    const rl = crearRL(["1"]);
    await removeCity(rl, config);

    expect(config.ciudades).toHaveLength(1);
    expect(config.ciudadPredeterminada).toBe("Buenos Aires");
  });

  test("no hace nada cuando selección es inválida", async () => {
    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid],
      unidad: "C",
    };
    await guardarConfiguracion(config);

    const rl = crearRL(["99"]);
    await removeCity(rl, config);

    expect(config.ciudades).toHaveLength(1);
  });
});
