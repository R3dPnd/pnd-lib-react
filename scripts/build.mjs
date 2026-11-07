// Build dist/: compile src/ with tsc (JS + .d.ts), then copy the stylesheets
// and fonts next to it. Runs on `npm install` of the git dependency (prepare).
import { spawnSync } from "node:child_process";
import { cpSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const tsc = createRequire(import.meta.url).resolve("typescript/bin/tsc");

rmSync(dist, { recursive: true, force: true });

const res = spawnSync(process.execPath, [tsc, "-p", path.join(root, "tsconfig.json")], { stdio: "inherit" });
if (res.status !== 0) process.exit(res.status ?? 1);

cpSync(path.join(root, "src", "styles"), dist, { recursive: true });
cpSync(path.join(root, "src", "fonts"), path.join(dist, "fonts"), { recursive: true });
console.log("pnd-lib-react: built dist/");
