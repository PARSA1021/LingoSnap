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

    const data = await res.json();
    
    // We can map the result to a simpler format for our app
    const errors = data.matches.map((match: any) => ({
      message: match.message,
      shortMessage: match.shortMessage,
      replacements: match.replacements.map((r: any) => r.value),
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
