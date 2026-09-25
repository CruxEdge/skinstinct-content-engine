const { GoogleGenerativeAI } = require("@google/generative-ai");

function client() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenerativeAI(key);
}

function flashModel() {
  return client().getGenerativeModel({ model: "gemini-2.5-flash" });
}

/**
 * Checkpoint B1.1 — score a raw note 0-10 with a one-line reason.
 * No judgment about voice or quality beyond "is there enough here to publish something from" —
 * that's deliberate: this step is meant to be fast, cheap, and mechanical, not a taste filter.
 */
async function scoreNote(noteText) {
  const prompt = `You are a triage filter for a founder's raw Telegram notes, deciding which are worth
turning into a LinkedIn post. Score the note below from 0 to 10 on: does it contain a specific,
substantive point (a number, a mechanism, a concrete anecdote, a clear opinion) rather than a bare
task reminder, logistics note, or unfinished fragment with no point yet?

Respond with STRICT JSON only, no markdown fences: {"score": <integer 0-10>, "reason": "<one line>"}

NOTE:
"""
${noteText}
"""`;

  const result = await flashModel().generateContent(prompt);
  const raw = result.response.text().trim().replace(/^```json|```$/g, "").trim();
  try {
    const parsed = JSON.parse(raw);
    return { score: Number(parsed.score), reason: String(parsed.reason) };
  } catch (e) {
    console.error("Could not parse Gemini score response:", raw);
    // Fail closed: if we can't parse a score, don't draft from it silently.
    return { score: 0, reason: "Scoring response could not be parsed; treated as fail-safe reject." };
  }
}

/**
 * Checkpoint B1.2 — pull 3-5 search terms as a short search phrase for Google News.
 */
async function extractKeywords(noteText) {
  const prompt = `Read the note below. Return ONLY a short Google News search phrase (3-5 words,
plain text, no quotes, no punctuation beyond spaces) that would find a genuinely relevant, currently
recent article for this topic. Do not explain, just return the phrase.

NOTE:
"""
${noteText}
"""`;
  const result = await flashModel().generateContent(prompt);
  return result.response.text().trim().replace(/^["']|["']$/g, "");
}

/**
 * L3 demo drafting path. Not used from B1 onward (see lib/claude.js), kept so
 * DRAFT_MODEL=gemini still works for the quick in-class demo.
 */
async function draftPost({ noteText, voiceSkill, newsItem }) {
  const model = client().getGenerativeModel({ model: "gemini-2.5-pro" });
  const prompt = buildDraftPrompt({ noteText, voiceSkill, newsItem });
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

function buildDraftPrompt({ noteText, voiceSkill, newsItem }) {
  return `You write LinkedIn posts for a founder, strictly in her voice as described below. Do not
invent facts, statistics, or events not present in the note. Do not add hashtags or emoji. Do not
address the reader with a marketing hook or CTA to buy anything.

VOICE SKILL (how she writes — follow this precisely):
"""
${voiceSkill}
"""

RAW NOTE (the substance of the post):
"""
${noteText}
"""

${newsItem ? `A NEWS ITEM you may use if — and only if — it is genuinely relevant to the note. If it
doesn't fit naturally, ignore it entirely and don't mention it:
Headline: ${newsItem.headline}
Source: ${newsItem.source} · ${newsItem.date}
Summary: ${newsItem.summary}
` : ""}

Write the LinkedIn post now. Output only the post text.`;
}

module.exports = { scoreNote, extractKeywords, draftPost, buildDraftPrompt };
