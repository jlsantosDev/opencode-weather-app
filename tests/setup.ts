import { mkdtempSync } from "node:fs";
import { join } from "node:path";

// Sandbox HOME para que settingsStorage escriba en un directorio temporal
// y nunca toque la configuración real del usuario (~/.weather-cli.json).
const TMP_BASE = "/private/var/folders/2b/33wfhcyd0yx_qgxg4bc79fmh0000gn/T/opencode";
const sandbox = mkdtempSync(join(TMP_BASE, "weather-cli-test-"));
process.env.HOME = sandbox;
process.env.USERPROFILE = sandbox;

// Desactivar colores ANSI en tests para aserciones deterministas.
process.env.NO_COLOR = "1";

// Mock global de fetch configurable por test.
type FetchHandler = (url: URL) => Promise<Response>;
let currentHandler: FetchHandler = async () => {
  throw new Error("fetch no configurado en el mock global");
};

const mockFetch = (input: URL | Request | string, _init?: RequestInit): Promise<Response> => {
  const url = typeof input === "string" ? new URL(input) : input instanceof URL ? input : new URL(input.url);
  return currentHandler(url);
};

globalThis.fetch = mockFetch as typeof fetch;

export function setFetchHandler(handler: FetchHandler) {
  currentHandler = handler;
}

export function resetFetchHandler() {
  currentHandler = async () => {
    throw new Error("fetch no configurado en el mock global");
  };
}
