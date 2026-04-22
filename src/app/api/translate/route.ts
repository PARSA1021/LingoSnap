import { NextResponse } from "next/server";

function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      ...(init?.headers || {}),
    },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const source = (searchParams.get("source") || "en").trim();
  const target = (searchParams.get("target") || "ko").trim();

  if (!q) return json({ error: "q is required" }, { status: 400 });
  if (q.length > 200) return json({ error: "q is too long" }, { status: 400 });

  // NOTE: MyMemory is a free community service and may be rate-limited or low-quality.
  // In production, replace this with a paid provider (DeepL/Google) behind a server route.
  const upstream = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(q)}&langpair=${encodeURIComponent(
    `${source}|${target}`
  )}`;

  try {
    const res = await fetch(upstream, {
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!res.ok) return json({ error: "upstream_error", status: res.status }, { status: 502 });

    const data = await res.json();
    const translatedText: string | undefined = data?.responseData?.translatedText;
    if (!translatedText) return json({ translatedText: null });

    const upper = translatedText.toUpperCase();
    if (upper.includes("MYMEMORY") || upper.includes("MEMORY")) return json({ translatedText: null });

    return json({ translatedText });
  } catch {
    return json({ error: "network_error" }, { status: 502 });
  }
}

