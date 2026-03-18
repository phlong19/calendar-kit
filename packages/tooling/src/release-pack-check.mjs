#!/usr/bin/env node

import { execSync } from "node:child_process";
import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function run(command, options = {}) {
  return execSync(command, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options
  }).trim();
}

function runLogged(command, cwd) {
  process.stdout.write(`$ ${command}\n`);
  execSync(command, {
    cwd,
    stdio: "inherit"
  });
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function readPackageJsonFromTar(tarPath) {
  const raw = run(`tar -xOf "${tarPath}" package/package.json`);
  return JSON.parse(raw);
}

function listTarEntries(tarPath) {
  return run(`tar -tf "${tarPath}"`)
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const workspaceRoot = process.cwd();
const packDir = mkdtempSync(join(tmpdir(), "calendar-kit-release-pack-"));

try {
  runLogged(`pnpm --filter @calendar-kit/core pack --pack-destination "${packDir}"`, workspaceRoot);
  runLogged(`pnpm --filter @calendar-kit/registry pack --pack-destination "${packDir}"`, workspaceRoot);

  const tarballs = readdirSync(packDir).filter((file) => file.endsWith(".tgz"));
  const coreTarball = tarballs.find((file) => file.includes("calendar-kit-core"));
  const registryTarball = tarballs.find((file) => file.includes("calendar-kit-registry"));

  assert(coreTarball, "Missing @calendar-kit/core tarball");
  assert(registryTarball, "Missing @calendar-kit/registry tarball");

  const coreTarPath = join(packDir, coreTarball);
  const registryTarPath = join(packDir, registryTarball);

  const corePackageJson = readPackageJsonFromTar(coreTarPath);
  const coreEntries = listTarEntries(coreTarPath);

  assert(corePackageJson.main === "dist/index.cjs", "@calendar-kit/core main must point to dist/index.cjs");
  assert(corePackageJson.module === "dist/index.js", "@calendar-kit/core module must point to dist/index.js");
  assert(corePackageJson.types === "dist/index.d.ts", "@calendar-kit/core types must point to dist/index.d.ts");
  assert(
    corePackageJson.exports?.["."]?.import === "./dist/index.js",
    "@calendar-kit/core exports.import must point to ./dist/index.js"
  );
  assert(
    corePackageJson.exports?.["."]?.require === "./dist/index.cjs",
    "@calendar-kit/core exports.require must point to ./dist/index.cjs"
  );
  assert(
    corePackageJson.exports?.["."]?.types === "./dist/index.d.ts",
    "@calendar-kit/core exports.types must point to ./dist/index.d.ts"
  );
  assert(
    !coreEntries.some((entry) => entry.startsWith("package/src/")),
    "@calendar-kit/core tarball must not include package/src runtime files"
  );

  const registryPackageJson = readPackageJsonFromTar(registryTarPath);
  const registryEntries = listTarEntries(registryTarPath);
  const coreDependency = registryPackageJson.dependencies?.["@calendar-kit/core"];

  assert(
    registryEntries.includes("package/dist/styles.css"),
    "@calendar-kit/registry tarball must include dist/styles.css"
  );
  assert(
    typeof coreDependency === "string" && coreDependency.length > 0,
    "@calendar-kit/registry must declare @calendar-kit/core dependency"
  );
  assert(
    coreDependency !== "workspace:*",
    "@calendar-kit/registry @calendar-kit/core dependency must not use workspace:*"
  );

  process.stdout.write("\nrelease:pack checks passed.\n");
  process.stdout.write(`- core: ${coreTarball}\n`);
  process.stdout.write(`- registry: ${registryTarball}\n`);
} finally {
  rmSync(packDir, { recursive: true, force: true });
}
