import type { Ciudad } from "../../src/types/City.ts";

export const ciudadMadrid: Ciudad = {
  nombre: "Madrid",
  latitud: 40.4168,
  longitud: -3.7038,
  pais: "España",
};

export const ciudadBuenosAires: Ciudad = {
  nombre: "Buenos Aires",
  latitud: -34.6037,
  longitud: -58.3816,
  pais: "Argentina",
};

export const respuestaGeocoding = {
  results: [
    {
      name: "Madrid",
      latitude: 40.4168,
      longitude: -3.7038,
      country: "España",
    },
  ],
};

export const respuestaClima = {
  current: {
    temperature_2m: 21.5,
  },
};

export const respuestaPronostico = {
  daily: {
    time: [
      "2026-10-13",
      "2026-10-14",
      "2026-10-15",
      "2026-10-16",
      "2026-10-17",
      "2026-10-18",
      "2026-10-19",
    ],
    temperature_2m_max: [25.1, 26.3, 24.8, 23.5, 22.9, 24.1, 25.7],
    temperature_2m_min: [15.2, 16.1, 14.8, 13.9, 13.2, 14.5, 15.8],
    precipitation_probability_max: [10, 20, 30, 40, 50, 60, 70],
    weather_code: [0, 1, 2, 3, 45, 95, 999],
  },
};
