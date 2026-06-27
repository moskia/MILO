import { NoteRepository } from "../storage/notes";
import { broadcast } from "../events";
import { miniLMEmbedder } from "../ai/embedder";

export async function backfillEmbeddings() {
    const notes = await NoteRepository.list();
    const missing= notes.filter((note) => !note.embedding);
    if (missing.length === 0) return;

    console.log(`Backfilling embeddings for ${missing.length} notes...`);
    for (const note of missing) {
        try {
            const textToEmbed = [note.title, note.summary, note.content, note.userNotes]
            .filter(Boolean)
            .join(" ");

            const embedding = await miniLMEmbedder.embed(textToEmbed);
            await NoteRepository.update(note.id, { embedding, embeddingModel: miniLMEmbedder.id });
        } catch (error) {
            console.warn(`[MILO] backfill failed for note ${note.id}:`, error);
        }
        broadcast({ type: "notes/changed" }); // tell an open popup to refresh
        console.log("[MILO] backfill done");
    }
}
