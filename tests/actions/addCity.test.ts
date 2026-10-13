import { beforeEach, describe, expect, test } from "bun:test";
import { setFetchHandler } from "../setup.ts";
import { ciudadMadrid, respuestaGeocoding } from "../helpers/fixtures.ts";
import { addCity } from "../../src/actions/addCity.ts";
import { guardarConfiguracion, cargarConfiguracion } from "../../src/storage/settingsStorage.ts";
import type { Configuracion } from "../../src/types/Settings.ts";
import { crearRL } from "../helpers/rl.ts";

beforeEach(async () => {
  await guardarConfiguracion({ ciudadPredeterminada: null, ciudades: [], unidad: "C" });
  setFetchHandler(async () => new Response(JSON.stringify(respuestaGeocoding)));
});

describe("addCity", () => {
  test("agrega ciudad exitosamente y la pone como default", async () => {
    const config: Configuracion = { ciudadPredeterminada: null, ciudades: [], unidad: "C" };
    await addCity(crearRL(["Madrid"]), config);

    expect(config.ciudades).toHaveLength(1);
    expect(config.ciudadPredeterminada).toBe("Madrid");

    const persistida = await cargarConfiguracion();
    expect(persistida.ciudades.map((c) => c.nombre)).toEqual(["Madrid"]);
    expect(persistida.ciudadPredeterminada).toBe("Madrid");
  });

  test("no agrega cuando nombre está vacío (ni consulta la API)", async () => {
    let llamadas = 0;
    setFetchHandler(async () => {
      llamadas++;
      return new Response(JSON.stringify(respuestaGeocoding));
    });

    const config: Configuracion = { ciudadPredeterminada: null, ciudades: [], unidad: "C" };
    await addCity(crearRL([""]), config);

    expect(config.ciudades).toHaveLength(0);
    expect(llamadas).toBe(0);
  });

  test("no agrega cuando la ciudad no existe", async () => {
    setFetchHandler(async () => new Response(JSON.stringify({ results: [] })));

    const config: Configuracion = { ciudadPredeterminada: null, ciudades: [], unidad: "C" };
    await addCity(crearRL(["CiudadInexistente"]), config);

    expect(config.ciudades).toHaveLength(0);
  });

  test("no agrega duplicados", async () => {
    await guardarConfiguracion({
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid],
      unidad: "C",
    });
    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid],
      unidad: "C",
    };

    await addCity(crearRL(["Madrid"]), config);

    expect(config.ciudades).toHaveLength(1);
  });

  test("no cambia el default si ya había uno", async () => {
    const config: Configuracion = {
      ciudadPredeterminada: "Buenos Aires",
      ciudades: [],
      unidad: "C",
    };

    await addCity(crearRL(["Madrid"]), config);

    expect(config.ciudadPredeterminada).toBe("Buenos Aires");
  });
});
