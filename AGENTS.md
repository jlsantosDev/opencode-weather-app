# AGENTS.md

## What this is

Bun-based console **Weather CLI** in TypeScript (tutorial in Spanish — see `README.md` for the required menu layout). Entry is `src/index.ts` (menu loop); app code lives under `src/` organized by responsibility:

- `src/types/` — TypeScript contracts (`City.ts`, `Settings.ts`, `Weather.ts`, `MenuOption.ts`)
- `src/api/` — External API integration (`geocoding.ts`, `weather.ts`)
- `src/storage/` — Local persistence (`citiesStorage.ts`, `settingsStorage.ts`)
- `src/actions/` — User-facing actions (`getWeather.ts`, `addCity.ts`, `removeCity.ts`, `setDefaultCity.ts`, `getForecast.ts`, `changeUnit.ts`, `listCities.ts`)
- `src/presentation/` — Console I/O (`menu.ts`, `output.ts`, `input.ts`)
- `src/utils/` — Reusable helpers (`format.ts`, `constants.ts`, `colors.ts`)

- User config persists to `~/.weather-cli.json` (outside the repo; delete it to reset state when testing).
- Binary build: `bun run build` → `dist/weather` (dist/ is gitignored).

## Toolchain rules

- Use **Bun only**, never Node/npm/pnpm/yarn/vite (see `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc` for the full list).
  - Run: `bun run dev` (watch mode) or `bun run src/index.ts` (one-shot).
  - Install: `bun install`; ad-hoc tools: `bunx <pkg>`.
  - Tests: `bun test` (no tests exist yet; use `import { test, expect } from "bun:test"`).
  - Typecheck: `bunx tsc --noEmit` (tsconfig already sets `noEmit`; there is no typecheck script).
- The end goal per README is a **standalone executable**: build with `bun build --compile` (output goes to `dist/`-style artifacts, already gitignored).
- Bun auto-loads `.env` — do not add `dotenv`. No API keys are needed for Open-Meteo.

## TypeScript config gotchas

tsconfig is stricter than defaults and will reject code that "looks fine":
- `noUncheckedIndexedAccess: true` — indexing arrays/records yields `T | undefined`; handle it.
- `verbatimModuleSyntax: true` — type-only imports must use `import type`.
- `moduleResolution: bundler` + `allowImportingTsExtensions` — importing with explicit `.ts` extensions is allowed.
- `jsx: react-jsx` is configured but there is no React/frontend here; this is a CLI app.

## App domain

Two-step Open-Meteo HTTP flow (no auth):
1. Geocode: `https://geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`
2. Forecast: `https://api.open-meteo.com/v1/forecast?latitude=<lat>&longitude=<lon>&current=temperature_2m`

Features required by README: default city, multiple saved cities, add/remove/set-default city, unit setting (°C/°F), 7-day forecast (menu option 6), and the exact boxed menu shown in README. User-facing strings are in **Spanish** — keep them consistent.
