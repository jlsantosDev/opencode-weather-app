import { describe, expect, test } from "bun:test";
import { setFetchHandler } from "../setup.ts";
import { obtenerPronostico7Dias, obtenerTemperatura } from "../../src/api/weather.ts";
import { ciudadMadrid, respuestaClima, respuestaPronostico } from "../helpers/fixtures.ts";

describe("obtenerTemperatura", () => {
  test("construye URL con coordenadas y current", async () => {
    const llamadas: URL[] = [];
    setFetchHandler(async (url: URL) => {
      llamadas.push(url);
      return new Response(JSON.stringify(respuestaClima));
    });

    await obtenerTemperatura(ciudadMadrid, "C");

    const url = llamadas[0];
    expect(url).toBeDefined();
    expect(url?.searchParams.get("latitude")).toBe("40.4168");
    expect(url?.searchParams.get("longitude")).toBe("-3.7038");
    expect(url?.searchParams.get("current")).toBe("temperature_2m");
    expect(url?.searchParams.get("temperature_unit")).toBeNull();
  });

  test("incluye temperature_unit=fahrenheit cuando unidad es F", async () => {
    const llamadas: URL[] = [];
    setFetchHandler(async (url: URL) => {
      llamadas.push(url);
      return new Response(JSON.stringify(respuestaClima));
    });

    await obtenerTemperatura(ciudadMadrid, "F");

    const url = llamadas[0];
    expect(url?.searchParams.get("temperature_unit")).toBe("fahrenheit");
  });

  test("devuelve temperatura", async () => {
    setFetchHandler(async () => new Response(JSON.stringify(respuestaClima)));

    const temp = await obtenerTemperatura(ciudadMadrid, "C");
    expect(temp).toBe(21.5);
  });

  test("throw cuando HTTP no es ok", async () => {
    setFetchHandler(async () => new Response("Error", { status: 500 }));

    await expect(obtenerTemperatura(ciudadMadrid, "C")).rejects.toThrow("Error al obtener el clima (HTTP 500)");
  });

  test("throw cuando temperatura no es número", async () => {
    setFetchHandler(async () => new Response(JSON.stringify({ current: {} })));

    await expect(obtenerTemperatura(ciudadMadrid, "C")).rejects.toThrow("La respuesta del servidor no incluye la temperatura");
  });
});

describe("obtenerPronostico7Dias", () => {
  test("construye URL con daily params y forecast_days=7", async () => {
    const llamadas: URL[] = [];
    setFetchHandler(async (url: URL) => {
      llamadas.push(url);
      return new Response(JSON.stringify(respuestaPronostico));
    });

    await obtenerPronostico7Dias(ciudadMadrid, "C");

    const url = llamadas[0];
    expect(url).toBeDefined();
    expect(url?.searchParams.get("daily")).toBe(
      "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
    );
    expect(url?.searchParams.get("forecast_days")).toBe("7");
    expect(url?.searchParams.get("timezone")).toBe("auto");
  });

  test("devuelve 7 días con descripciones WMO", async () => {
    setFetchHandler(async () => new Response(JSON.stringify(respuestaPronostico)));

    const dias = await obtenerPronostico7Dias(ciudadMadrid, "C");
    expect(dias).toHaveLength(7);
    expect(dias[0]?.descripcion).toBe("Despejado");
    expect(dias[1]?.descripcion).toBe("Mayormente despejado");
    expect(dias[2]?.descripcion).toBe("Parcialmente nublado");
    expect(dias[3]?.descripcion).toBe("Nublado");
    expect(dias[4]?.descripcion).toBe("Niebla");
    expect(dias[5]?.descripcion).toBe("Tormenta");
    expect(dias[6]?.descripcion).toBe("Código 999");
  });

  test("probLluvia null cuando no es número", async () => {
    const sinLluvia = {
      daily: {
        ...respuestaPronostico.daily,
        precipitation_probability_max: [null, null, null, null, null, null, null],
      },
    };
    setFetchHandler(async () => new Response(JSON.stringify(sinLluvia)));

    const dias = await obtenerPronostico7Dias(ciudadMadrid, "C");
    expect(dias[0]?.probLluvia).toBeNull();
  });

  test("throw cuando daily no existe", async () => {
    setFetchHandler(async () => new Response(JSON.stringify({})));

    await expect(obtenerPronostico7Dias(ciudadMadrid, "C")).rejects.toThrow("La respuesta del servidor no incluye el pronóstico");
  });

  test("throw cuando arrays tienen longitudes diferentes", async () => {
    const malaRespuesta = {
      daily: {
        time: ["2026-10-13"],
        temperature_2m_max: [25.1, 26.3],
        temperature_2m_min: [15.2],
        precipitation_probability_max: [10],
        weather_code: [0],
      },
    };
    setFetchHandler(async () => new Response(JSON.stringify(malaRespuesta)));

    await expect(obtenerPronostico7Dias(ciudadMadrid, "C")).rejects.toThrow("La respuesta del servidor está incompleta");
  });

  test("throw cuando HTTP no es ok", async () => {
    setFetchHandler(async () => new Response("Error", { status: 500 }));

    await expect(obtenerPronostico7Dias(ciudadMadrid, "C")).rejects.toThrow("Error al obtener el pronóstico (HTTP 500)");
  });
});
