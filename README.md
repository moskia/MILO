# MILO

**Your local learning companion.**

Capture what you learn while browsing, and let a *local* agent turn those scattered
notes into a clear picture of what you actually know about a subject — summarize what
you've learned, answer questions from your own notes, quiz you, and point out the gaps.
Everything runs on your machine.

MILO is a from-scratch rebuild of the ideas in MindStack, reorganized around
**learning** instead of just recall, and built with small, readable modules.

## What it does

- **Capture** — highlight text on any page, click *Capture*. The extension formats it,
  and uses on-device AI to add a title, tags, and a summary.
- **Index** — every note is turned into a semantic vector (embedding) for meaning-based search.
- **Recall** — search your notes by meaning, not just keywords.
- **Learn** — open the agent, type a subject, and:
  - **What have I learned?** → a summary synthesized from your notes
  - **What am I missing?** → gaps the model thinks your notes don't cover
  - **Ask your notes** → questions answered *only* from your notes, with citations
  - **Quiz me** → questions generated from your notes

## Architecture

A [pnpm](https://pnpm.io) monorepo with three packages:

| Package           | What it is                                                                |
| ----------------- | ------------------------------------------------------------------------- |
| `@milo/shared`    | The backbone: domain types, typed message contracts, AI interfaces, utils. |
| `@milo/extension` | Chrome MV3 extension. Captures, enriches, embeds, and stores notes.        |
| `@milo/agent`     | Local web app (run in Chrome). The learning agent: retrieval + AI features. |

```
            ┌─────────────────────── @milo/extension ───────────────────────┐
 you        │  content script        background service worker               │
 highlight ─┼─▶ Capture button ─msg─▶ pipeline: format→title→tags→summary    │
            │                          → embed (MiniLM) → save to storage     │
            │  content script ◀────────  chrome.storage.local  (your notes)   │
            └───────────┬────────────────────────────────────────────────────┘
                        │  auto-sync over window.postMessage (on localhost)
                        ▼
            ┌─────────────────────── @milo/agent (localhost) ───────────────┐
            │  type a subject → semantic retrieval (embeddings) →            │
            │  Gemini Nano →  Summary · Gaps · Chat · Quiz                   │
            └───────────────────────────────────────────────────────────────┘
```

The agent pulls notes from the extension **automatically** via the content script
(no manual file step); a manual JSON **Export/Import** is kept as a fallback.

The **AI layer is swappable** (`@milo/shared` → `llm.ts`). It ships with on-device
providers — **Gemini Nano** for text (Prompt + Summarizer APIs) and
**Xenova/all-MiniLM-L6-v2** for embeddings — and these can be replaced with a cloud
model later without touching capture/agent logic.

## Project structure

```
packages/
├── shared/src/        domain.ts · messages.ts · llm.ts · sync.ts · vector.ts
├── extension/src/
│   ├── background/     router · storage · ai (gemini + embedder) · capture · search · maintenance
│   ├── content/        selection · capture button · notify · bridge (auto-sync)
│   └── popup/          React: notes library, search, export
└── agent/src/
    ├── ai/             gemini-text · embedder · lazy-session
    ├── lib/            retrieve (semantic) · store · bridge
    ├── agent/          summarize · gaps · chat · quiz
    └── components/     SubjectBar · Chat · Quiz · ImportScreen
```

## Status

All core milestones are complete:

1. ✅ Monorepo + `@milo/shared` (types & contracts)
2. ✅ `@milo/extension` capture (on-device enrichment + live progress)
3. ✅ Embeddings + semantic search + backfill of old notes
4. ✅ `@milo/agent` (auto-sync, retrieval, summary, gaps, chat, quiz)

Possible next steps: extract the duplicated `ai/` files into a shared package, add
tabs/polish to the agent, and richer topic grouping.

## Getting started

**Prerequisites:** Node ≥ 18, [pnpm](https://pnpm.io), a recent Google Chrome.

```bash
pnpm install
pnpm typecheck                        # check the whole workspace
```

**1. Build & load the extension**

```bash
pnpm --filter @milo/extension build   # → packages/extension/dist/
```

Then in `chrome://extensions`: enable **Developer mode** → **Load unpacked** →
select `packages/extension/dist/`. After any rebuild, click the **↻ reload** icon.

**2. Run the agent**

```bash
pnpm --filter @milo/agent dev
```

Open the printed `localhost` URL **in the same Chrome**. With the extension loaded,
your notes sync in automatically (or click **↻ Sync**).

## Enabling Chrome's built-in AI (Gemini Nano)

Capture's title/tags/summary and all agent text features (summary, gaps, chat, quiz)
use Chrome's on-device AI. Enable these flags and relaunch:

- `chrome://flags/#prompt-api-for-gemini-nano` → **Enabled**
- `chrome://flags/#summarization-api-for-gemini-nano` → **Enabled**
- `chrome://flags/#optimization-guide-on-device-model` → **Enabled BypassPerfRequirement**

Then at `chrome://components`, find **Optimization Guide On Device Model** and
**Check for update** to download the model. (Flag names vary by Chrome version —
search "gemini nano" in `chrome://flags` if one isn't found.)

Without these flags, MILO still works: capture saves the raw text + page title, and
semantic search/retrieval still run (the embedding model is independent).

## Privacy

Everything is local. Notes live in `chrome.storage.local`; AI runs on-device. The
only network use is a one-time download of the embedding model (from a CDN) and the
Gemini Nano model (managed by Chrome), both cached for offline use afterward.

## Develop

```bash
pnpm typecheck                          # whole workspace
pnpm --filter @milo/extension build     # build the extension
pnpm --filter @milo/agent dev           # run the agent
```

## License

MIT
