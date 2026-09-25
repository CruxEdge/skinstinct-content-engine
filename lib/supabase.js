const { createClient } = require("@supabase/supabase-js");

let _client = null;
function client() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
  _client = createClient(url, key);
  return _client;
}

async function saveNote({ telegramMessageId, rawText }) {
  const { data, error } = await client()
    .from("notes")
    .insert({ telegram_message_id: telegramMessageId, raw_text: rawText, status: "received" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function updateNoteScore(noteId, { score, reason, passed }) {
  const { error } = await client()
    .from("notes")
    .update({ score, score_reason: reason, status: passed ? "scored_passed" : "scored_rejected" })
    .eq("id", noteId);
  if (error) throw error;
}

async function saveDraft({ noteId, draftText, newsItem, modelUsed }) {
  const { data, error } = await client()
    .from("drafts")
    .insert({
      note_id: noteId,
      draft_text: draftText,
      news_headline: newsItem?.headline || null,
      news_source: newsItem?.source || null,
      news_date: newsItem?.date || null,
      news_link: newsItem?.url || null,
      model_used: modelUsed,
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function attachTelegramMessageId(draftId, telegramMessageId) {
  const { error } = await client()
    .from("drafts")
    .update({ telegram_message_id: telegramMessageId })
    .eq("id", draftId);
  if (error) throw error;
}

/** Finds the most recent pending draft sent as the given Telegram message id (or, if the
 * message being replied to isn't found, falls back to the single most recent pending draft —
 * covers the common case where Meera just replies APPROVE/REJECT under the draft message). */
async function findDraftForReply(repliedToMessageId) {
  const db = client();
  if (repliedToMessageId) {
    const { data } = await db
      .from("drafts")
      .select("*")
      .eq("telegram_message_id", repliedToMessageId)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle();
    if (data) return data;
  }
  const { data } = await db
    .from("drafts")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

async function decideDraft(draftId, status) {
  const { error } = await client()
    .from("drafts")
    .update({ status, decided_at: new Date().toISOString() })
    .eq("id", draftId);
  if (error) throw error;
}

module.exports = {
  saveNote,
  updateNoteScore,
  saveDraft,
  attachTelegramMessageId,
  findDraftForReply,
  decideDraft,
};
