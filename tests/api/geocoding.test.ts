import { describe, expect, test } from "bun:test";
import { resetFetchHandler, setFetchHandler } from "../setup.ts";
import { buscarCiudad } from "../../src/api/geocoding.ts";
import { respuestaGeocoding } from "../helpers/fixtures.ts";

describe("buscarCiudad", () => {
  test("construye URL con parámetros correctos", async () => {
    const llamadas: URL[] = [];
    setFetchHandler(async (url: URL) => {
      llamadas.push(url);
      return new Response(JSON.stringify(respuestaGeocoding));
    });

    await buscarCiudad("Madrid");

    const url = llamadas[0];
    expect(url).toBeDefined();
    expect(url?.searchParams.get("name")).toBe("Madrid");
    expect(url?.searchParams.get("count")).toBe("1");
    expect(url?.searchParams.get("language")).toBe("es");
    expect(url?.searchParams.get("format")).toBe("json");
  });

  test("devuelve ciudad cuando hay resultados", async () => {
    setFetchHandler(async () => new Response(JSON.stringify(respuestaGeocoding)));

    const ciudad = await buscarCiudad("Madrid");
    expect(ciudad).toEqual({
      nombre: "Madrid",
      latitud: 40.4168,
      longitud: -3.7038,
      pais: "España",
    });
  });

  test("devuelve null cuando no hay resultados", async () => {
    setFetchHandler(async () => new Response(JSON.stringify({ results: [] })));

    const ciudad = await buscarCiudad("CiudadInexistente");
    expect(ciudad).toBeNull();
  });

  test("devuelve null cuando results es undefined", async () => {
    setFetchHandler(async () => new Response(JSON.stringify({})));

    const ciudad = await buscarCiudad("CiudadInexistente");
    expect(ciudad).toBeNull();
  });

  test("throw cuando HTTP no es ok", async () => {
    setFetchHandler(async () => new Response("Error", { status: 500 }));

    await expect(buscarCiudad("Madrid")).rejects.toThrow("Error al buscar la ciudad (HTTP 500)");
  });

  test("después de cada test el mock se restaura (sin red real)", async () => {
    resetFetchHandler();
    await expect(buscarCiudad("Madrid")).rejects.toThrow("fetch no configurado");
  });
});
