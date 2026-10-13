import type * as readline from "node:readline/promises";

/**
 * Crea un stub de readline.Interface que devuelve respuestas predefinidas
 * en orden. Si se agotan las respuestas, devuelve string vacío.
 */
export function crearRL(respuestas: string[]): readline.Interface {
  let indice = 0;
  return {
    question: async (_mensaje: string) => respuestas[indice++] ?? "",
    close: () => {},
  } as unknown as readline.Interface;
}
