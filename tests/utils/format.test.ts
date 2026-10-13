import { describe, expect, test } from "bun:test";
import { formatearFechaCorta, formatearTemperatura } from "../../src/utils/format.ts";

describe("formatearTemperatura", () => {
  test("formatea con 1 decimal y símbolo de grado", () => {
    expect(formatearTemperatura(21.5, "C")).toBe("21.5°C");
    expect(formatearTemperatura(70.7, "F")).toBe("70.7°F");
  });

  test("redondea a 1 decimal", () => {
    expect(formatearTemperatura(21.55, "C")).toBe("21.6°C");
    expect(formatearTemperatura(21.54, "C")).toBe("21.5°C");
  });

  test("maneja negativos y cero", () => {
    expect(formatearTemperatura(-5.3, "C")).toBe("-5.3°C");
    expect(formatearTemperatura(0, "C")).toBe("0.0°C");
  });
});

describe("formatearFechaCorta", () => {
  test("formatea fecha ISO a texto corto en español", () => {
    expect(formatearFechaCorta("2026-10-13")).toBe("mar, 13 oct");
  });

  test("no cambia de día por zona horaria (usa UTC)", () => {
    expect(formatearFechaCorta("2026-10-13")).toContain("13");
  });

  test("maneja fin de mes", () => {
    expect(formatearFechaCorta("2026-10-31")).toBe("sáb, 31 oct");
  });

  test("maneja cambio de mes", () => {
    expect(formatearFechaCorta("2026-01-01")).toBe("jue, 01 ene");
  });
});
