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
  const word = (searchParams.get("word") || "").trim().toLowerCase();
  if (!word) return json({ error: "word is required" }, { status: 400 });
  if (word.length > 64) return json({ error: "word is too long" }, { status: 400 });

  const upstream = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;

  try {
    const res = await fetch(upstream, {
      // Cache at the Next.js fetch layer for fast repeat lookups.
      next: { revalidate: 60 * 60 * 24 },
    });

    if (res.status === 404) return json({ word, notFound: true });
    if (!res.ok) {
      return json({ error: "upstream_error", status: res.status }, { status: 502 });
    }

    const data = await res.json();
    return json({ word, data });
  } catch {
    return json({ error: "network_error" }, { status: 502 });
  }
}

