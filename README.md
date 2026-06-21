# MILO

**Your local learning companion.**

Capture what you learn while browsing, and let a *local* agent turn those scattered
notes into a clear picture of what you actually know about a subject — what you've
covered, where the gaps are, and quizzes to reinforce it. All on your machine.

MILO is a from-scratch rebuild of the ideas in MindStack, reorganized around
**learning** instead of just recall, and built with small, readable modules.

## Architecture

A [pnpm](https://pnpm.io) monorepo with three packages:

| Package          | What it is                                                            |
| ---------------- | --------------------------------------------------------------------- |
| `@milo/shared`   | The backbone: domain types, message contracts, LLM interface, utils.  |
| `@milo/extension`| Chrome MV3 extension. Captures highlighted text into local storage.   |
| `@milo/agent`    | Local web app (run in Chrome). The learning agent + chat + dashboard. |

```
extension  ──capture──▶  chrome.storage.local  ──export(JSON)──▶  agent (RAG + chat)
```

The **agent's brain is swappable** (see `@milo/shared` → `llm`). It ships with an
on-device Gemini Nano provider (private, offline, free) and can swap in a stronger
cloud model later without touching the agent logic.

## Status

🚧 Early scaffold. Build order:

1. ✅ Monorepo + `@milo/shared` (types & contracts)
2. ✅ `@milo/extension` skeleton (capture + on-device enrichment + live progress)
3. ⬜ Search (embeddings)
4. ⬜ `@milo/agent` (RAG + chat + dashboard)
5. ⬜ Data bridge (export/import)

## Develop

```bash
pnpm install
pnpm typecheck                      # check the whole workspace
pnpm --filter @milo/extension build # → packages/extension/dist/
```

Then load `packages/extension/dist/` unpacked at `chrome://extensions`
(Developer mode → Load unpacked). On-device enrichment needs Chrome's built-in
AI; without it, capture still saves the raw text + page title.
