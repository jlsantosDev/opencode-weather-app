import { describe, expect, test } from "bun:test";
import { ciudadBuenosAires, ciudadMadrid } from "../helpers/fixtures.ts";
import type { Configuracion } from "../../src/types/Settings.ts";

const { setDefaultCity } = await import("../../src/actions/setDefaultCity.ts");
const { crearRL } = await import("../helpers/rl.ts");
const { cargarConfiguracion } = await import("../../src/storage/settingsStorage.ts");

describe("setDefaultCity", () => {
  test("establece ciudad default y persiste", async () => {
    const config: Configuracion = {
      ciudadPredeterminada: null,
      ciudades: [ciudadMadrid, ciudadBuenosAires],
      unidad: "C",
    };

    const rl = crearRL(["2"]);
    await setDefaultCity(rl, config);

    expect(config.ciudadPredeterminada).toBe("Buenos Aires");

    const cargada = await cargarConfiguracion();
    expect(cargada.ciudadPredeterminada).toBe("Buenos Aires");
  });
});
