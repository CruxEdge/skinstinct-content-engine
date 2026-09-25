const TELEGRAM_API = "https://api.telegram.org";

function token() {
  const t = process.env.TELEGRAM_BOT_TOKEN;
  if (!t) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  return t;
}

/**
 * Sends a text message back into the capture channel.
 * Returns the Telegram message id of the message we just sent, so it can be
 * stored alongside a draft and matched later when Meera replies to it.
 */
async function sendMessage(chatId, text, options = {}) {
  const res = await fetch(`${TELEGRAM_API}/bot${token()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
      ...options,
    }),
  });
  const data = await res.json();
  if (!data.ok) {
    console.error("Telegram sendMessage failed:", data);
    throw new Error(`Telegram sendMessage failed: ${data.description || res.status}`);
  }
  return data.result.message_id;
}

module.exports = { sendMessage };
