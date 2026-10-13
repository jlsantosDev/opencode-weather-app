import { amarillo, negrita, rojo, verde } from "../utils/colors.ts";

// Funciones para mostrar mensajes al usuario con formato consistente

export function mostrarMensaje(mensaje: string): void {
  console.log(`\n  ${mensaje}`);
}

export function mostrarExito(mensaje: string): void {
  console.log(`\n  ${verde(mensaje)}`);
}

export function mostrarError(mensaje: string): void {
  console.log(`\n  ${rojo(mensaje)}`);
}

export function mostrarAdvertencia(mensaje: string): void {
  console.log(`\n  ${amarillo(mensaje)}`);
}

export function mostrarTitulo(texto: string): void {
  console.log(`  ${negrita(texto)}`);
}

export function mostrarClimaActual(
  ciudad: string,
  temperatura: string,
): void {
  console.log(
    `\n  El clima en ${negrita(ciudad)} es ${amarillo(temperatura)}`,
  );
}

export function mostrarClimaCiudad(
  ciudad: string,
  temperatura: string,
): void {
  console.log(
    `  ${negrita(ciudad)}: ${amarillo(temperatura)}`,
  );
}

export function mostrarErrorCiudad(
  ciudad: string,
  error: string,
): void {
  console.log(`  ${negrita(ciudad)}: ${rojo(`error (${error})`)}`);
}
