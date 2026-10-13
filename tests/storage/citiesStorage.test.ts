import { beforeEach, describe, expect, test } from "bun:test";
import { agregarCiudad, ciudadExiste, eliminarCiudad, listarCiudades } from "../../src/storage/citiesStorage.ts";
import { cargarConfiguracion, guardarConfiguracion } from "../../src/storage/settingsStorage.ts";
import { ciudadBuenosAires, ciudadMadrid } from "../helpers/fixtures.ts";

describe("citiesStorage", () => {
  beforeEach(async () => {
    await guardarConfiguracion({ ciudadPredeterminada: null, ciudades: [], unidad: "C" });
  });

  test("listarCiudades devuelve lista vacía al inicio", async () => {
    const ciudades = await listarCiudades();
    expect(ciudades).toEqual([]);
  });

  test("agregarCiudad añade a la lista", async () => {
    await agregarCiudad(ciudadMadrid);
    const ciudades = await listarCiudades();
    expect(ciudades).toHaveLength(1);
    expect(ciudades[0]?.nombre).toBe("Madrid");
  });

  test("ciudadExiste detecta duplicados por nombre y latitud", async () => {
    await agregarCiudad(ciudadMadrid);
    expect(await ciudadExiste(ciudadMadrid)).toBe(true);
    expect(await ciudadExiste(ciudadBuenosAires)).toBe(false);
  });

  test("eliminarCiudad remueve y devuelve la ciudad", async () => {
    await agregarCiudad(ciudadMadrid);
    await agregarCiudad(ciudadBuenosAires);

    const eliminada = await eliminarCiudad(0);
    expect(eliminada?.nombre).toBe("Madrid");

    const ciudades = await listarCiudades();
    expect(ciudades).toHaveLength(1);
    expect(ciudades[0]?.nombre).toBe("Buenos Aires");
  });

  test("eliminarCiudad re-asigna default si se elimina la default", async () => {
    await guardarConfiguracion({
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid, ciudadBuenosAires],
      unidad: "C",
    });

    await eliminarCiudad(0);

    const config = await cargarConfiguracion();
    expect(config.ciudadPredeterminada).toBe("Buenos Aires");
  });

  test("eliminarCiudad con índice inválido devuelve null", async () => {
    const eliminada = await eliminarCiudad(99);
    expect(eliminada).toBeNull();
  });
});
