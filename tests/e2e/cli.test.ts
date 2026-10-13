import { describe, expect, test } from "bun:test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const projectRoot = join(import.meta.dir, "../..");

// Cada e2e usa un HOME limpio para no heredar estado de otros tests.
function homeLimpio(): string {
  return mkdtempSync(join(tmpdir(), "weather-e2e-"));
}

async function interactuar(lineas: string[]): Promise<{ salida: string; exitCode: number }> {
  const proc = Bun.spawn(["bun", join(projectRoot, "src/index.ts")], {
    cwd: projectRoot,
    stdin: "pipe",
    stdout: "pipe",
    stderr: "pipe",
    env: { ...process.env, HOME: homeLimpio() },
  });

  // Escribir con pausas: readline descarta líneas que llegan mientras el bucle
  // aún no tiene una pregunta pendiente (race con el menú).
  for (const linea of lineas) {
    proc.stdin.write(`${linea}\n`);
    await Bun.sleep(150);
  }
  proc.stdin.end();

  const salida = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;
  return { salida, exitCode };
}

describe("CLI e2e", () => {
  test("muestra menú y sale con opción 9", async () => {
    const { salida, exitCode } = await interactuar(["9"]);

    expect(salida).toContain("WEATHER CLI");
    expect(salida).toContain("1. Clima de ciudad default");
    expect(salida).toContain("¡Hasta luego!");
    expect(exitCode).toBe(0);
  }, 15000);

  test("muestra error con opción inválida", async () => {
    const { salida, exitCode } = await interactuar(["42", "9"]);

    expect(salida).toContain("Opción no válida");
    expect(salida).toContain("¡Hasta luego!");
    expect(exitCode).toBe(0);
  }, 15000);

  test("advertencia al pedir clima sin ciudades (opción 1)", async () => {
    const { salida } = await interactuar(["1", "9"]);

    expect(salida).toContain("No hay ciudad default");
    expect(salida).toContain("¡Hasta luego!");
  }, 15000);
});
