import { cosineSimilarity, type Note, type SearchResult } from "@milo/shared";
import { miniLMEmbedder } from "../ai/embedder";
import { keywordSearch } from "./keyword";

const SIMILARITY_TRESHOLD = 0.35;

export async function semanticSearch(
  query: string,
  notes: Note[],): Promise<SearchResult[]> {
    let queryVector: number[];
    try {
      queryVector = await miniLMEmbedder.embed(query);
    } catch (error) {
      console.warn("[MILO] semantic search skipped:", error);
      return keywordSearch(query, notes);
    }

    const results: SearchResult[] = [];
    for (const note of notes) {
        if (!note.embedding) continue;
        const score = cosineSimilarity(queryVector, note.embedding);
        if (score >= SIMILARITY_TRESHOLD) {
            results.push({ note, score });
        }
    }

    return results.sort((a, b) => b.score - a.score);
  }
