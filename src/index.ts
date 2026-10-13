import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { cargarConfiguracion } from "./storage/settingsStorage.ts";
import { renderMenu } from "./presentation/menu.ts";
import { pedirTexto } from "./presentation/input.ts";
import { mostrarError } from "./presentation/output.ts";
import { getWeatherDefault, getWeatherAll } from "./actions/getWeather.ts";
import { addCity } from "./actions/addCity.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { getForecast } from "./actions/getForecast.ts";
import { changeUnit } from "./actions/changeUnit.ts";
import { cian } from "./utils/colors.ts";

async function main(): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  const config = await cargarConfiguracion();

  let salir = false;
  while (!salir) {
    console.log("\n" + renderMenu(config.ciudades.length, config.unidad));
    const opcion = await pedirTexto(rl, cian("  Selecciona una opción: "));
    try {
      switch (opcion) {
        case "1":
          await getWeatherDefault(config);
          break;
        case "2":
          await getWeatherAll(config);
          break;
        case "3":
          await addCity(rl, config);
          break;
        case "4":
          await removeCity(rl, config);
          break;
        case "5":
          await setDefaultCity(rl, config);
          break;
        case "6":
          await getForecast(rl, config);
          break;
        case "8":
          await changeUnit(config);
          break;
        case "9":
          salir = true;
          break;
        default:
          mostrarError("Opción no válida.");
          break;
      }
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : "desconocido";
      mostrarError(`Error: ${mensaje}`);
    }
  }

  rl.close();
  console.log(`\n  ${cian("¡Hasta luego!")}`);
}

main();
