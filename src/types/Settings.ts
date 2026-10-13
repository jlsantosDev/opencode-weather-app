export type Unidad = "C" | "F";

export interface Configuracion {
  ciudadPredeterminada: string | null;
  ciudades: import("./City.ts").Ciudad[];
  unidad: Unidad;
}
