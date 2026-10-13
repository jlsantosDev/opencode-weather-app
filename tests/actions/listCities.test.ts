import { describe, expect, test } from "bun:test";
import { listCities } from "../../src/actions/listCities.ts";
import { guardarConfiguracion } from "../../src/storage/settingsStorage.ts";
import { ciudadMadrid } from "../helpers/fixtures.ts";

describe("listCities", () => {
  test("muestra mensaje cuando no hay ciudades", async () => {
    await guardarConfiguracion({ ciudadPredeterminada: null, ciudades: [], unidad: "C" });
    await listCities();
  });

  test("lista ciudades guardadas", async () => {
    await guardarConfiguracion({
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid],
      unidad: "C",
    });
    await listCities();
  });
});
