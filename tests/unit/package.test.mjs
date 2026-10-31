import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { unzipSync } from "fflate";
const manifest = JSON.parse(await readFile("extension/manifest.json", "utf8"));
test("MV3 CSS-only, exact host, no privileged APIs", async () => {
  assert.equal(manifest.manifest_version, 3);
  assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
  assert.equal(
    manifest.version,
    JSON.parse(await readFile("package.json", "utf8")).version,
  );
  assert.ok(manifest.description.length <= 132);
  assert.deepEqual(Object.keys(manifest).sort(), [
    "content_scripts",
    "description",
    "manifest_version",
    "name",
    "version",
  ]);
  assert.deepEqual(manifest.content_scripts, [
    {
      matches: [
        "https://purelymail.com/manage",
        "https://purelymail.com/manage?*",
        "https://purelymail.com/manage/*",
      ],
      css: ["styles.css"],
      run_at: "document_start",
    },
  ]);
});
test("CSS cannot import or fetch resources", async () => {
  const css = await readFile("extension/styles.css", "utf8");
  assert.doesNotMatch(css, /@import|url\s*\(/i);
});
test("clean reproducible ZIP contains only runtime files at root", async () => {
  const build = () => execFileSync(process.execPath, ["scripts/build.mjs"]);
  const path = `artifacts/refined-purelymail-${manifest.version}.zip`;
  build();
  const first = await readFile(path);
  build();
  assert.deepEqual(await readFile(path), first);
  const entries = unzipSync(first);
  assert.deepEqual(Object.keys(entries).sort(), [
    "manifest.json",
    "styles.css",
  ]);
  assert.deepEqual((await readdir("dist")).sort(), Object.keys(entries).sort());
  for (const [name, bytes] of Object.entries(entries)) {
    assert.deepEqual(Buffer.from(bytes), await readFile("extension/" + name));
    assert.deepEqual(Buffer.from(bytes), await readFile("dist/" + name));
  }
});
