// On-device embeddings via transformers.js (MiniLM). Copied from the extension,
// implementing the @milo/shared `Embedder` interface. Here it embeds the user's
// subject/question so we can compare it to the notes' stored vectors.

import type { Embedder } from "@milo/shared";
import { env, pipeline } from "@xenova/transformers";
import { lazySession } from "./lazy-session";

env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;
env.backends.onnx.wasm.wasmPaths =
  "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.14.0/dist/";
env.backends.onnx.wasm.numThreads = 1; // single-threaded (no SharedArrayBuffer needed)
env.backends.onnx.wasm.proxy = false;

const getModel = lazySession(() => pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2"));

export const miniLMEmbedder: Embedder = {
  id: "Xenova/all-MiniLM-L6-v2",
  dimensions: 384,

  async isAvailable() {
    return true;
  },
  async embed(text: string) {
    const model = await getModel();
    const output = await model(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  },
};
