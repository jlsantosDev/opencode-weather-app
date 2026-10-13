import { describe, expect, test } from "bun:test";
import { changeUnit } from "../../src/actions/changeUnit.ts";
import { cargarConfiguracion } from "../../src/storage/settingsStorage.ts";
import type { Configuracion } from "../../src/types/Settings.ts";

describe("changeUnit", () => {
  test("cambia de C a F y persiste", async () => {
    const config: Configuracion = { ciudadPredeterminada: null, ciudades: [], unidad: "C" };
    await changeUnit(config);
    expect(config.unidad).toBe("F");

    const cargada = await cargarConfiguracion();
    expect(cargada.unidad).toBe("F");
  });

  test("cambia de F a C y persiste", async () => {
    const config: Configuracion = { ciudadPredeterminada: null, ciudades: [], unidad: "F" };
    await changeUnit(config);
    expect(config.unidad).toBe("C");

    const cargada = await cargarConfiguracion();
    expect(cargada.unidad).toBe("C");
  });
});
