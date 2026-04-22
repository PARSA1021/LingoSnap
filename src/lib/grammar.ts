export async function checkGrammar(text: string) {
  try {
    const params = new URLSearchParams();
    params.append('text', text);
    params.append('language', 'en-US');

    const res = await fetch('https://api.languagetool.org/v2/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!res.ok) {
      throw new Error('Failed to fetch Grammar API');
    }

    const data: unknown = await res.json();

    type LTReplacement = { value: string };
    type LTMatch = {
      message: string;
      shortMessage?: string;
      replacements: LTReplacement[];
      offset: number;
      length: number;
    };
    type LTResponse = { matches?: LTMatch[] };

    const matches = (data as LTResponse)?.matches ?? [];

    const errors = matches.map((match) => ({
      message: match.message,
      shortMessage: match.shortMessage,
      replacements: (match.replacements || []).map((r) => r.value),
      offset: match.offset,
      length: match.length,
    }));

    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (err) {
    console.error('Grammar API Error:', err);
    // Return graceful fallback rather than breaking the application flow
    return {
      isValid: true,
      errors: []
    };
  }
}
