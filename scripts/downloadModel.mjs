import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const modelDir = path.join(
  root,
  "public/models/Xenova/distilbert-base-cased-distilled-squad",
);
const onnxDir = path.join(modelDir, "onnx");
const wasmDest = path.join(root, "public/ort-wasm");

const BASE =
  "https://huggingface.co/Xenova/distilbert-base-cased-distilled-squad/resolve/main";

const FILES = [
  "config.json",
  "tokenizer.json",
  "tokenizer_config.json",
  "onnx/model_quantized.onnx",
];

async function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
    console.log(`skip ${path.relative(root, dest)}`);
    return;
  }
  console.log(`fetch ${url}`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`wrote ${path.relative(root, dest)} (${buf.length} bytes)`);
}

async function copyWasm() {
  const candidates = [
    path.join(root, "node_modules/onnxruntime-web/dist"),
    path.join(root, "node_modules/@huggingface/transformers/node_modules/onnxruntime-web/dist"),
  ];
  const srcDir = candidates.find((d) => fs.existsSync(d));
  if (!srcDir) {
    console.warn("onnxruntime-web dist not found; skip wasm copy");
    return;
  }
  fs.mkdirSync(wasmDest, { recursive: true });
  for (const name of fs.readdirSync(srcDir)) {
    if (!name.endsWith(".wasm") && !name.endsWith(".mjs")) continue;
    fs.copyFileSync(path.join(srcDir, name), path.join(wasmDest, name));
    console.log(`copied ${name}`);
  }
}

fs.mkdirSync(onnxDir, { recursive: true });

for (const file of FILES) {
  await download(`${BASE}/${file}`, path.join(modelDir, file));
}

await copyWasm();
console.log("Done. Set SELF_HOST_MODEL = true in src/lib/postQA.ts to use local files.");
