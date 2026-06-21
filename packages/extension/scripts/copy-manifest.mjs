// Vite builds JS into dist/, but the manifest is a static file Chrome needs at the
// dist root. Copy it after every build. (Icons would be copied here too.)
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = resolve(root, "dist");

if (!existsSync(dist)) mkdirSync(dist, { recursive: true });
copyFileSync(resolve(root, "manifest.json"), resolve(dist, "manifest.json"));
console.log("✓ Copied manifest.json to dist/");
