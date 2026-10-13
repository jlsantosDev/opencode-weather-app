export interface DiaPronostico {
  fecha: string; // "YYYY-MM-DD" (día local de la ciudad)
  maxima: number;
  minima: number;
  probLluvia: number | null;
  descripcion: string; // condición en español (código WMO)
}
