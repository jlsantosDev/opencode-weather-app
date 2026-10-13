/**
 * Captura los mensajes enviados a console.log mientras se ejecuta `accion`.
 */
export async function capturarConsole(accion: () => Promise<void>): Promise<string> {
  const original = console.log;
  const lineas: string[] = [];
  console.log = (...args: unknown[]) => {
    lineas.push(args.map((a) => String(a)).join(" "));
  };
  try {
    await accion();
  } finally {
    console.log = original;
  }
  return lineas.join("\n");
}
