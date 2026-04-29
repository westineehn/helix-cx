const KEYWORDS = 'layoffs OR earnings OR acquisition OR leadership OR restructuring OR funding OR partnership OR expansion';

const truncate = (str, words = 12) => {
  const parts = str.split(' ');
  return parts.length <= words ? str : parts.slice(0, words).join(' ') + '...';
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const serperKey = process.env.SERPER_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!serperKey) return res.status(500).json({ error: 'Serper API key not configured' });
  if (!anthropicKey) return res.status(500).json({ error: 'Anthropic API key not configured' });

  const { company, industry } = req.body;
  if (!company) return res.status(400).json({ error: 'Company name required' });

  try {
    // ── Step 1: Fetch news from Serper ──────────────────────────
    const query = `"${company}" ${KEYWORDS}`;
    const serperRes = await fetch('https://google.serper.dev/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-API-KEY': serperKey },
      body: JSON.stringify({ q: query, num: 5, tbs: 'qdr:m' }) // last month
    });

    if (!serperRes.ok) throw new Error(`Serper returned ${serperRes.status}`);
    const serperData = await serperRes.json();

    const articles = (serperData.news || []).slice(0, 3).map(a => ({
      title: truncate(a.title, 12),
      source: a.source,
      url: a.link,
      date: a.date || 'Recent'
    }));

    if (articles.length === 0) {
      return res.status(200).json({
        summary: `No recent news found for ${company}. Monitor manually for updates.`,
        articles: [],
        fetchedAt: new Date().toISOString()
      });
    }

    // ── Step 2: Summarize via Claude ────────────────────────────
    const headlineContext = articles.map((a, i) => `${i + 1}. "${a.title}" (${a.source})`).join('\n');

    const prompt = `You are a Senior Customer Success strategist. Summarize these recent news headlines about ${company} (${industry}) into 1-2 sentences that capture the most important signal for a CSM managing this account. Focus on business impact: financial health, leadership changes, M&A, cost cutting, or growth signals. Be specific, cite company name, be under 40 words total.

Headlines:
${headlineContext}

Return ONLY the summary sentence(s). No preamble, no labels, no quotes.`;

    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': anthropicKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 100,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!claudeRes.ok) throw new Error(`Claude returned ${claudeRes.status}`);
    const claudeData = await claudeRes.json();
    const summary = claudeData.content?.map(c => c.text || '').join('').trim()
      || `Recent news signals activity around ${company} — review articles for detail.`;

    return res.status(200).json({
      summary,
      articles,
      fetchedAt: new Date().toISOString()
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
