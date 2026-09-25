const fs = require("fs");
const path = require("path");

let _cached = null;

/**
 * Reads voice-skill.txt from the project root. This is the file produced by
 * the Claude (browser) session at checkpoint L3.1 — replace its contents any
 * time Meera's voice profile is refined, no code change needed.
 */
function getVoiceSkill() {
  if (_cached) return _cached;
  const filePath = path.join(process.cwd(), "voice-skill.txt");
  _cached = fs.readFileSync(filePath, "utf-8");
  return _cached;
}

module.exports = { getVoiceSkill };
