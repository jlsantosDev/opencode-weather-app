import { beforeEach, describe, expect, test } from "bun:test";
import { setFetchHandler } from "../setup.ts";
import { capturarConsole } from "../helpers/captura.ts";
import {
  ciudadBuenosAires,
  ciudadMadrid,
  respuestaClima,
  respuestaPronostico,
} from "../helpers/fixtures.ts";
import { getWeatherAll, getWeatherDefault } from "../../src/actions/getWeather.ts";
import { getForecast } from "../../src/actions/getForecast.ts";
import { crearRL } from "../helpers/rl.ts";
import type { Configuracion } from "../../src/types/Settings.ts";

beforeEach(() => {
  setFetchHandler(async () => new Response(JSON.stringify(respuestaClima)));
});

describe("getWeatherDefault", () => {
  test("sin ciudad default no consulta la API", async () => {
    let llamadas = 0;
    setFetchHandler(async () => {
      llamadas++;
      return new Response(JSON.stringify(respuestaClima));
    });

    const config: Configuracion = { ciudadPredeterminada: null, ciudades: [], unidad: "C" };
    await getWeatherDefault(config);
    expect(llamadas).toBe(0);
  });

  test("obtiene temperatura de ciudad default", async () => {
    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid],
      unidad: "C",
    };
    const salida = await capturarConsole(() => getWeatherDefault(config));
    expect(salida).toContain("El clima en Madrid es 21.5°C");
  });

  test("propaga error de la API", async () => {
    setFetchHandler(async () => new Response("Error", { status: 500 }));

    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid],
      unidad: "C",
    };
    await expect(getWeatherDefault(config)).rejects.toThrow("Error al obtener el clima (HTTP 500)");
  });
});

describe("getWeatherAll", () => {
  test("sin ciudades no consulta la API", async () => {
    let llamadas = 0;
    setFetchHandler(async () => {
      llamadas++;
      return new Response(JSON.stringify(respuestaClima));
    });

    const config: Configuracion = { ciudadPredeterminada: null, ciudades: [], unidad: "C" };
    await getWeatherAll(config);
    expect(llamadas).toBe(0);
  });

  test("obtiene temperatura de todas las ciudades", async () => {
    const llamadas: URL[] = [];
    setFetchHandler(async (url) => {
      llamadas.push(url);
      return new Response(JSON.stringify(respuestaClima));
    });

    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid, ciudadBuenosAires],
      unidad: "C",
    };
    await getWeatherAll(config);
    expect(llamadas).toHaveLength(2);
  });

  test("atrapa errores por ciudad y continúa con las demás", async () => {
    let llamadas = 0;
    setFetchHandler(async () => {
      llamadas++;
      if (llamadas === 1) return new Response("Error", { status: 500 });
      return new Response(JSON.stringify(respuestaClima));
    });

    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid, ciudadBuenosAires],
      unidad: "C",
    };
    await getWeatherAll(config); // no debe lanzar
    expect(llamadas).toBe(2);
  });
});

describe("getForecast", () => {
  test("obtiene y renderiza pronóstico", async () => {
    let llamadas = 0;
    setFetchHandler(async () => {
      llamadas++;
      return new Response(JSON.stringify(respuestaPronostico));
    });

    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid],
      unidad: "C",
    };
    await getForecast(crearRL(["1"]), config);
    expect(llamadas).toBe(1);
  });

  test("sin ciudades no consulta la API", async () => {
    let llamadas = 0;
    setFetchHandler(async () => {
      llamadas++;
      return new Response(JSON.stringify(respuestaPronostico));
    });

    const config: Configuracion = { ciudadPredeterminada: null, ciudades: [], unidad: "C" };
    await getForecast(crearRL(["1"]), config);
    expect(llamadas).toBe(0);
  });

  test("selección inválida no consulta la API", async () => {
    let llamadas = 0;
    setFetchHandler(async () => {
      llamadas++;
      return new Response(JSON.stringify(respuestaPronostico));
    });

    const config: Configuracion = {
      ciudadPredeterminada: "Madrid",
      ciudades: [ciudadMadrid],
      unidad: "C",
    };
    await getForecast(crearRL(["99"]), config);
    expect(llamadas).toBe(0);
  });
});
