const { XMLParser } = require("fast-xml-parser");

/**
 * Checkpoint B1.2 — Google News, no account or key needed: the public RSS
 * search endpoint. Returns the top result as {headline, source, date, summary, url}
 * or null if nothing came back.
 */
async function fetchTopNews(searchPhrase) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
    searchPhrase
  )}&hl=en-IN&gl=IN&ceid=IN:en`;

  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) {
    console.error("Google News fetch failed:", res.status);
    return null;
  }
  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  const items = parsed?.rss?.channel?.item;
  const first = Array.isArray(items) ? items[0] : items;
  if (!first) return null;

  // Google News titles are usually "Headline - Source"; split that back apart.
  const rawTitle = String(first.title || "").trim();
  const dashSplit = rawTitle.split(" - ");
  const source = dashSplit.length > 1 ? dashSplit.pop() : (first.source?.["#text"] || "");
  const headline = dashSplit.join(" - ") || rawTitle;

  return {
    headline,
    source: source || "Unknown source",
    date: first.pubDate ? new Date(first.pubDate).toISOString().slice(0, 10) : "",
    summary: String(first.description || "").replace(/<[^>]+>/g, "").trim().slice(0, 300),
    url: first.link || "",
  };
}

module.exports = { fetchTopNews };
