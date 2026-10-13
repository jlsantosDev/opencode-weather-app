import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import {
  mostrarAdvertencia,
  mostrarClimaActual,
  mostrarClimaCiudad,
  mostrarError,
  mostrarErrorCiudad,
  mostrarExito,
  mostrarMensaje,
  mostrarTitulo,
} from "../../src/presentation/output.ts";

const originalLog = console.log;

describe("output", () => {
  let logSpy: ReturnType<typeof mock>;

  beforeEach(() => {
    logSpy = mock(() => {});
    console.log = logSpy;
  });

  afterEach(() => {
    console.log = originalLog;
  });

  test("mostrarExito imprime mensaje", () => {
    mostrarExito("Éxito");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Éxito"));
  });

  test("mostrarError imprime mensaje", () => {
    mostrarError("Error");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Error"));
  });

  test("mostrarAdvertencia imprime mensaje", () => {
    mostrarAdvertencia("Advertencia");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Advertencia"));
  });

  test("mostrarMensaje imprime mensaje", () => {
    mostrarMensaje("Mensaje");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Mensaje"));
  });

  test("mostrarTitulo imprime texto", () => {
    mostrarTitulo("Título");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Título"));
  });

  test("mostrarClimaActual imprime ciudad y temperatura", () => {
    mostrarClimaActual("Madrid", "21.5°C");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Madrid"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("21.5°C"));
  });

  test("mostrarClimaCiudad imprime ciudad y temperatura", () => {
    mostrarClimaCiudad("Madrid", "21.5°C");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Madrid"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("21.5°C"));
  });

  test("mostrarErrorCiudad imprime ciudad y error", () => {
    mostrarErrorCiudad("Madrid", "API Error");
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Madrid"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("API Error"));
  });
});
