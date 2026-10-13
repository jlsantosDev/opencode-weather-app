import { describe, expect, test } from "bun:test";
import { listarCiudades, renderMenu, renderPronostico } from "../../src/presentation/menu.ts";
import type { DiaPronostico } from "../../src/types/Weather.ts";
import { ciudadMadrid } from "../helpers/fixtures.ts";

describe("renderMenu", () => {
  test("contiene todas las opciones del menú", () => {
    const menu = renderMenu(3, "C");
    expect(menu).toContain("1. Clima de ciudad default");
    expect(menu).toContain("2. Clima de todas las ciudades (3)");
    expect(menu).toContain("3. Buscar y agregar ciudad");
    expect(menu).toContain("4. Eliminar ciudad");
    expect(menu).toContain("5. Establecer ciudad default");
    expect(menu).toContain("6. Pronóstico 7 días");
    expect(menu).toContain("8. Ajustes (°C)");
    expect(menu).toContain("9. Salir");
  });

  test("muestra unidad F cuando configura", () => {
    const menu = renderMenu(0, "F");
    expect(menu).toContain("8. Ajustes (°F)");
  });
});

describe("listarCiudades", () => {
  test("marca ciudad default con [default]", () => {
    const lista = listarCiudades([ciudadMadrid], "Madrid");
    expect(lista).toContain("1. Madrid (España)");
    expect(lista).toContain("[default]");
  });

  test("no marca cuando no hay default", () => {
    const lista = listarCiudades([ciudadMadrid], null);
    expect(lista).toContain("1. Madrid (España)");
    expect(lista).not.toContain("[default]");
  });
});

describe("renderPronostico", () => {
  test("renderiza encabezado y días", () => {
    const dias: DiaPronostico[] = [
      { fecha: "2026-10-13", maxima: 25.1, minima: 15.2, probLluvia: 10, descripcion: "Despejado" },
      { fecha: "2026-10-14", maxima: 26.3, minima: 16.1, probLluvia: 20, descripcion: "Mayormente despejado" },
    ];
    const output = renderPronostico("Madrid", dias, "C");
    expect(output).toContain("Pronóstico 7 días — Madrid");
    expect(output).toContain("Despejado");
    expect(output).toContain("Mayormente despejado");
  });
});
