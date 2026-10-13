// Utilidades de color ANSI para la terminal.
// Los colores se desactivan automáticamente cuando la salida no es una TTY
// (p. ej. al pipear a un archivo) o cuando se define la variable NO_COLOR.
// FORCE_COLOR=1 fuerza los colores incluso en salidas no interactivas.

const HAY_COLOR = process.env.FORCE_COLOR
  ? process.env.FORCE_COLOR !== "0"
  : !process.env.NO_COLOR && Boolean(process.stdout.isTTY);

const RESET = "\x1b[0m";

function pintador(codigo: string): (texto: string) => string {
  if (!HAY_COLOR) return (texto) => texto;
  return (texto) => `\x1b[${codigo}m${texto}${RESET}`;
}

export const cian = pintador("36");
export const amarillo = pintador("33");
export const verde = pintador("32");
export const rojo = pintador("31");
export const negrita = pintador("1");
export const tenue = pintador("2");
