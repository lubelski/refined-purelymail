import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { zipSync } from "fflate";
import { resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(
  await readFile(resolve(root, "extension/manifest.json"), "utf8"),
);
// Explicit allowlist: never ship tests, the reference archive, dependencies or secrets.
const files = [
  "manifest.json",
  ...manifest.content_scripts.flatMap((script) => script.css),
];
await rm(resolve(root, "dist"), { recursive: true, force: true });
await rm(resolve(root, "artifacts"), { recursive: true, force: true });
await mkdir(resolve(root, "dist"), { recursive: true });
await mkdir(resolve(root, "artifacts"), { recursive: true });
const entries = {};
for (const file of [...new Set(files)].sort()) {
  if (!/^[a-zA-Z0-9._-]+$/.test(file)) throw new Error("Unexpected asset path");
  const bytes = await readFile(resolve(root, "extension", file));
  await writeFile(resolve(root, "dist", file), bytes);
  entries[file] = [bytes, { mtime: new Date("2020-01-01T00:00:00Z") }];
}
await writeFile(
  resolve(root, "artifacts", `refined-purelymail-${manifest.version}.zip`),
  zipSync(entries, { level: 9 }),
);
console.log(
  `Built dist/ and artifacts/refined-purelymail-${manifest.version}.zip`,
);
