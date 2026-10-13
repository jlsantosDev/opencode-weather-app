// Constantes generales de la app

export const API_BASE_URL = "https://api.open-meteo.com";
export const GEOCODING_BASE_URL = "https://geocoding-api.open-meteo.com";

export const MENU_OPTIONS = {
  CLIMA_CIUDAD_DEFAULT: "1",
  CLIMA_TODAS_CIUDADES: "2",
  AGREGAR_CIUDAD: "3",
  ELIMINAR_CIUDAD: "4",
  ESTABLECER_DEFAULT: "5",
  PRONOSTICO_7_DIAS: "6",
  AJUSTES: "8",
  SALIR: "9",
} as const;
