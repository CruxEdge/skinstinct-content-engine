const { sendMessage } = require("../lib/telegram");
const { scoreNote, extractKeywords } = require("../lib/gemini");
const { fetchTopNews } = require("../lib/news");
const { getVoiceSkill } = require("../lib/voiceSkill");
const db = require("../lib/supabase");

const claudeDrafter = require("../lib/claude");
const geminiDrafter = require("../lib/gemini");

const SCORE_THRESHOLD = Number(process.env.SCORE_THRESHOLD || 6);

function draftPost(args) {
  const useGemini = (process.env.DRAFT_MODEL || "claude").toLowerCase() === "gemini";
  return useGemini ? geminiDrafter.draftPost(args) : claudeDrafter.draftPost(args);
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(200).send("ok - webhook is listening");
    return;
  }

  // Optional shared-secret check (set via setWebhook's secret_token param).
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret) {
    const got = req.headers["x-telegram-bot-api-secret-token"];
    if (got !== expectedSecret) {
      res.status(401).send("unauthorized");
      return;
    }
  }

  // Do the real work before acking — Vercel's serverless runtime can freeze
  // the function shortly after the response is sent, so work queued after
  // res.send() isn't guaranteed to finish. Telegram tolerates a several-
  // second reply, which is what this pipeline normally takes.
  let chatId;
  try {
    const update = req.body;
    // Posts in the capture channel arrive as `channel_post`; `message` only
    // covers private/group chats (e.g. a stray DM to the bot).
    const message = update?.channel_post || update?.message;
    if (!message || !message.text) {
      res.status(200).send("ok");
      return;
    }

    chatId = message.chat?.id;
    const text = message.text.trim();
    const expectedChatId = process.env.TELEGRAM_CHAT_ID;

    if (String(chatId) !== String(expectedChatId)) {
      // Not the capture channel (e.g. a stray DM to the bot) — ignore silently.
      res.status(200).send("ok");
      return;
    }

    const upper = text.toUpperCase();
    if (upper === "APPROVE" || upper === "REJECT") {
      await handleDecision({ chatId, message, decision: upper });
    } else {
      await handleNewNote({ chatId, message, text });
    }
    res.status(200).send("ok");
  } catch (err) {
    console.error("Webhook processing failed:", err);
    if (chatId) {
      try {
        await sendMessage(chatId, "Something went wrong processing that — check the logs.");
      } catch (notifyErr) {
        console.error("Failed to notify chat of error:", notifyErr);
      }
    }
    res.status(200).send("ok");
  }
};

async function handleNewNote({ chatId, message, text }) {
  const note = await db.saveNote({ telegramMessageId: message.message_id, rawText: text });

  const { score, reason } = await scoreNote(text);
  const passed = score >= SCORE_THRESHOLD;
  await db.updateNoteScore(note.id, { score, reason, passed });

  if (!passed) {
    await sendMessage(
      chatId,
      `No draft made (scored ${score}/10). ${reason}`,
      { reply_to_message_id: message.message_id }
    );
    return;
  }

  let newsItem = null;
  try {
    const phrase = await extractKeywords(text);
    newsItem = await fetchTopNews(phrase);
  } catch (e) {
    console.error("News lookup failed, continuing without it:", e);
  }

  const voiceSkill = getVoiceSkill();
  const draftText = await draftPost({ noteText: text, voiceSkill, newsItem });

  const modelUsed = (process.env.DRAFT_MODEL || "claude").toLowerCase();
  const draft = await db.saveDraft({ noteId: note.id, draftText, newsItem, modelUsed });

  let outgoing = draftText;
  if (newsItem) {
    outgoing += `\n\n─────────────────────────────\nNEWS SOURCE: ${newsItem.headline}\nFROM: ${newsItem.source} · ${newsItem.date}\nLINK: ${newsItem.url}\n⚠ Check this before publishing — you are the author of this claim\n─────────────────────────────`;
  }
  outgoing += `\n\n— Reply APPROVE or REJECT to this message.`;

  const sentMessageId = await sendMessage(chatId, outgoing, {
    reply_to_message_id: message.message_id,
  });
  await db.attachTelegramMessageId(draft.id, sentMessageId);
}

async function handleDecision({ chatId, message, decision }) {
  const repliedTo = message.reply_to_message?.message_id;
  const draft = await db.findDraftForReply(repliedTo);
  if (!draft) {
    await sendMessage(chatId, "I don't see a pending draft to match that reply to.");
    return;
  }
  await db.decideDraft(draft.id, decision === "APPROVE" ? "approved" : "rejected");
  await sendMessage(
    chatId,
    decision === "APPROVE"
      ? "Marked approved. Publishing is still on you — this just updates the record."
      : "Marked rejected and kept in the log, not deleted, so it shows what to improve.",
    { reply_to_message_id: message.message_id }
  );
}
