import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import {
  cargarConfiguracion,
  guardarConfiguracion,
  type Ciudad,
  type Configuracion,
} from "./src/datos/configuracion.ts";
import { buscarCiudad } from "./src/servicios/geocodificacion.ts";
import { formatearTemperatura, obtenerTemperatura } from "./src/servicios/clima.ts";
import { listarCiudades, renderMenu } from "./src/interfaz/menu.ts";

// Pide un número de ítem (1-based) y devuelve el índice, o null si es inválido.
async function pedirIndice(rl: readline.Interface, mensaje: string): Promise<number | null> {
  const texto = (await rl.question(mensaje)).trim();
  const valor = Number(texto);
  if (!Number.isInteger(valor) || valor < 1) return null;
  return valor - 1;
}

// Muestra la lista y permite elegir una ciudad. Devuelve null si no hay ciudades
// o la selección es inválida (avisa al usuario en ese caso).
async function elegirCiudad(
  rl: readline.Interface,
  config: Configuracion,
): Promise<Ciudad | null> {
  if (config.ciudades.length === 0) {
    console.log("\n  No hay ciudades registradas. Agrega una con la opción 3.");
    return null;
  }
  console.log("\n" + listarCiudades(config.ciudades, config.ciudadPredeterminada));
  const indice = await pedirIndice(rl, "  Selecciona una ciudad: ");
  const ciudad = indice === null ? undefined : config.ciudades[indice];
  if (!ciudad) {
    console.log("\n  Opción no válida.");
    return null;
  }
  return ciudad;
}

async function manejarOpcion(rl: readline.Interface, config: Configuracion, opcion: string): Promise<boolean> {
  switch (opcion) {
    case "1": {
      const ciudad = config.ciudades.find((c) => c.nombre === config.ciudadPredeterminada);
      if (!ciudad) {
        console.log("\n  No hay ciudad default. Agrega una con la opción 3.");
        break;
      }
      const temperatura = await obtenerTemperatura(ciudad, config.unidad);
      console.log(`\n  El clima en ${ciudad.nombre} es ${formatearTemperatura(temperatura, config.unidad)}`);
      break;
    }

    case "2": {
      if (config.ciudades.length === 0) {
        console.log("\n  No hay ciudades registradas. Agrega una con la opción 3.");
        break;
      }
      console.log("");
      for (const ciudad of config.ciudades) {
        try {
          const temperatura = await obtenerTemperatura(ciudad, config.unidad);
          console.log(`  ${ciudad.nombre}: ${formatearTemperatura(temperatura, config.unidad)}`);
        } catch (error) {
          const mensaje = error instanceof Error ? error.message : "desconocido";
          console.log(`  ${ciudad.nombre}: error (${mensaje})`);
        }
      }
      break;
    }

    case "3": {
      const nombre = (await rl.question("\n  Ingresa el nombre de la ciudad: ")).trim();
      if (!nombre) {
        console.log("  El nombre no puede estar vacío.");
        break;
      }
      const ciudad = await buscarCiudad(nombre);
      if (!ciudad) {
        console.log(`\n  No se encontró la ciudad "${nombre}".`);
        break;
      }
      const yaExiste = config.ciudades.some(
        (c) => c.nombre === ciudad.nombre && c.latitud === ciudad.latitud,
      );
      if (yaExiste) {
        console.log(`\n  ${ciudad.nombre} ya está registrada.`);
        break;
      }
      config.ciudades.push(ciudad);
      if (!config.ciudadPredeterminada) {
        config.ciudadPredeterminada = ciudad.nombre;
      }
      await guardarConfiguracion(config);
      const pais = ciudad.pais ? ` (${ciudad.pais})` : "";
      console.log(`\n  Ciudad agregada: ${ciudad.nombre}${pais}`);
      break;
    }

    case "4": {
      const ciudad = await elegirCiudad(rl, config);
      if (!ciudad) break;
      const indice = config.ciudades.indexOf(ciudad);
      const [eliminada] = config.ciudades.splice(indice, 1);
      if (eliminada && eliminada.nombre === config.ciudadPredeterminada) {
        config.ciudadPredeterminada = config.ciudades[0]?.nombre ?? null;
      }
      await guardarConfiguracion(config);
      console.log(`\n  Se eliminó ${eliminada?.nombre ?? "la ciudad"}.`);
      break;
    }

    case "5": {
      const ciudad = await elegirCiudad(rl, config);
      if (!ciudad) break;
      config.ciudadPredeterminada = ciudad.nombre;
      await guardarConfiguracion(config);
      console.log(`\n  Ciudad default: ${ciudad.nombre}`);
      break;
    }

    case "8": {
      config.unidad = config.unidad === "C" ? "F" : "C";
      await guardarConfiguracion(config);
      console.log(`\n  Ajustes: temperatura en °${config.unidad}`);
      break;
    }

    case "9": {
      return true; // salir
    }

    default: {
      console.log("\n  Opción no válida.");
      break;
    }
  }
  return false;
}

async function main(): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const config = await cargarConfiguracion();

  let salir = false;
  while (!salir) {
    console.log("\n" + renderMenu(config.ciudades.length, config.unidad));
    const opcion = (await rl.question("  Selecciona una opción: ")).trim();
    try {
      salir = await manejarOpcion(rl, config, opcion);
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "desconocido";
      console.log(`\n  Error: ${mensaje}`);
    }
  }

  rl.close();
  console.log("\n  ¡Hasta luego!");
}

main();
