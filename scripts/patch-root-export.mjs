/*
 * Points the package's root export at the IDP-aware client wrapper.
 *
 * Speakeasy regenerates src/index.ts on every `speakeasy run`, reverting it
 * to export the plain generated class. This script re-applies the one-line
 * swap so that:
 *
 *   import { Authlete } from "@authlete/typescript-sdk";
 *
 * resolves to the wrapper in src/client.ts (which extends the generated
 * class and adds IDP URL routing + apiServerId injection).
 *
 * Wired as the "prebuild" script, so every build — including the
 * prepublishOnly build that gates npm publish — is patched automatically.
 * Idempotent: safe to run any number of times.
 *
 * test/root-export.test.mjs verifies the result; if Speakeasy ever changes
 * the structure of index.ts so the swap no longer applies, this script
 * exits non-zero and the build fails loudly instead of publishing an
 * unpatched package.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const INDEX_PATH = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "src",
  "index.ts",
);

const GENERATED_EXPORT = `export * from "./sdk/sdk.js";`;
const PATCHED_EXPORT = `export * from "./client.js";`;

const source = readFileSync(INDEX_PATH, "utf8");

if (source.includes(PATCHED_EXPORT)) {
  console.log("[patch-root-export] already patched — nothing to do");
  process.exit(0);
}

if (!source.includes(GENERATED_EXPORT)) {
  console.error(
    `[patch-root-export] ERROR: expected to find '${GENERATED_EXPORT}' in src/index.ts.\n` +
      "The generated index.ts structure has changed. Update this script " +
      "(and re-run the root-export guard test) before publishing.",
  );
  process.exit(1);
}

writeFileSync(
  INDEX_PATH,
  source.replace(GENERATED_EXPORT, PATCHED_EXPORT),
);
console.log(
  "[patch-root-export] patched src/index.ts — root export now serves the IDP-aware client",
);
