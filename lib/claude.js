const Anthropic = require("@anthropic-ai/sdk");
const { buildDraftPrompt } = require("./gemini");

/**
 * B1-onward drafting path. Claude holds a voice more consistently across a
 * full-length post than Gemini did in the L3 demo (see the "final 15 min"
 * model-comparison checkpoint) — this is the drafting call the pipeline uses
 * by default (DRAFT_MODEL=claude).
 */
async function draftPost({ noteText, voiceSkill, newsItem }) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not set");
  const anthropic = new Anthropic({ apiKey: key });

  const prompt = buildDraftPrompt({ noteText, voiceSkill, newsItem });

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  return msg.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}

module.exports = { draftPost };
