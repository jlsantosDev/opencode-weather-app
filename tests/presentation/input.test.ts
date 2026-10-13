import { describe, expect, test } from "bun:test";
import { elegirCiudad, pedirIndice, pedirTexto } from "../../src/presentation/input.ts";
import { crearRL } from "../helpers/rl.ts";
import type { Configuracion } from "../../src/types/Settings.ts";
import { ciudadMadrid } from "../helpers/fixtures.ts";

describe("pedirIndice", () => {
  test("convierte número 1-based a índice 0-based", async () => {
    const rl = crearRL(["2"]);
    const indice = await pedirIndice(rl, "msg");
    expect(indice).toBe(1);
  });

  test("devuelve null para '0'", async () => {
    const rl = crearRL(["0"]);
    const indice = await pedirIndice(rl, "msg");
    expect(indice).toBeNull();
  });

  test("devuelve null para negativo", async () => {
    const rl = crearRL(["-1"]);
    const indice = await pedirIndice(rl, "msg");
    expect(indice).toBeNull();
  });

  test("devuelve null para texto no numérico", async () => {
    const rl = crearRL(["abc"]);
    const indice = await pedirIndice(rl, "msg");
    expect(indice).toBeNull();
  });

  test("devuelve null para decimal", async () => {
    const rl = crearRL(["1.5"]);
    const indice = await pedirIndice(rl, "msg");
    expect(indice).toBeNull();
  });
});

describe("pedirTexto", () => {
  test("devuelve texto trimado", async () => {
    const rl = crearRL(["  Madrid  "]);
    const texto = await pedirTexto(rl, "msg");
    expect(texto).toBe("Madrid");
  });
});

describe("elegirCiudad", () => {
  const config: Configuracion = {
    ciudadPredeterminada: "Madrid",
    ciudades: [ciudadMadrid],
    unidad: "C",
  };

  test("devuelve ciudad cuando selección es válida", async () => {
    const rl = crearRL(["1"]);
    const ciudad = await elegirCiudad(rl, config);
    expect(ciudad?.nombre).toBe("Madrid");
  });

  test("devuelve null cuando no hay ciudades", async () => {
    const rl = crearRL(["1"]);
    const ciudad = await elegirCiudad(rl, { ...config, ciudades: [] });
    expect(ciudad).toBeNull();
  });

  test("devuelve null cuando selección es inválida", async () => {
    const rl = crearRL(["99"]);
    const ciudad = await elegirCiudad(rl, config);
    expect(ciudad).toBeNull();
  });
});
