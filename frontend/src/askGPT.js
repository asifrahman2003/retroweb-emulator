export async function askGPT(prompt) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('GPT API Error:', data);
      return `⚠️ API Error: ${data.error?.message || 'Unknown error'}`;
    }

    return data.choices?.[0]?.message?.content?.trim() || '⚠️ Empty response';
  } catch (err) {
    console.error('GPT request failed:', err);
    return '⚠️ Request failed. See console for details.';
  }
}
