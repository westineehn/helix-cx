import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Sparkles, ChevronDown, ChevronRight, MessageSquare, Target, Activity, Users, DollarSign, Calendar, Zap, Loader2, Github, Linkedin, ExternalLink } from 'lucide-react';

const MOCK_ACCOUNTS = [
  {
    id: 1,
    name: "Meridian Streaming",
    industry: "Connected TV / Media",
    logo: "MS",
    arr: 850000,
    contractEnd: "2026-09-15",
    tenureMonths: 28,
    usage: { utilization: 94, change30d: 12, trend: "up" },
    support: { tickets30d: 6, severity: "low", sentiment: "positive", csat: 4.7 },
    engagement: { lastQbr: "2026-03-10", execSponsorStatus: "active", lastTouchDays: 5, qbrAttendance: "100%" },
    expansion: { historyArr: 200000, historyNote: "+$200K Q4 2025 (EU rollout)", signals: "Exploring APAC region pilot" },
    relationship: { championStable: true, recentChanges: "None — same CTO and VP Eng for 24 months" },
    external: "Strong Q1 2026 earnings beat. Announced $80M Series D extension. Hiring across product and engineering."
  },
  {
    id: 2,
    name: "Cascade Insurance Group",
    industry: "P&C Insurance / InsurTech",
    logo: "CI",
    arr: 420000,
    contractEnd: "2026-06-30",
    tenureMonths: 18,
    usage: { utilization: 41, change30d: -18, trend: "down" },
    support: { tickets30d: 19, severity: "high", sentiment: "frustrated", csat: 2.9 },
    engagement: { lastQbr: "2025-12-08", execSponsorStatus: "disengaged", lastTouchDays: 47, qbrAttendance: "missed last 2" },
    expansion: { historyArr: 0, historyNote: "Flat since initial contract", signals: "None" },
    relationship: { championStable: false, recentChanges: "Original champion (VP Ops) left in February. New stakeholder unknown." },
    external: "Acquired by larger carrier in January. Internal cost reviews underway. Vendor consolidation rumored."
  },
  {
    id: 3,
    name: "Northwind AI Labs",
    industry: "AI / Foundation Models",
    logo: "NW",
    arr: 1100000,
    contractEnd: "2027-01-20",
    tenureMonths: 14,
    usage: { utilization: 88, change30d: 23, trend: "up" },
    support: { tickets30d: 11, severity: "medium", sentiment: "engaged", csat: 4.4 },
    engagement: { lastQbr: "2026-03-22", execSponsorStatus: "highly active", lastTouchDays: 3, qbrAttendance: "100% + ad-hoc syncs" },
    expansion: { historyArr: 350000, historyNote: "+$350K in Q1 2026 (added eval workflows)", signals: "CTO requested capacity scoping for new model line" },
    relationship: { championStable: true, recentChanges: "Added a new Director of ML Ops as secondary champion" },
    external: "Closed $400M Series C in March. Just announced enterprise GA of new model. Aggressive customer growth."
  },
  {
    id: 4,
    name: "Helix Diagnostics",
    industry: "Healthcare / DevTools",
    logo: "HD",
    arr: 290000,
    contractEnd: "2026-08-12",
    tenureMonths: 22,
    usage: { utilization: 67, change30d: -4, trend: "flat" },
    support: { tickets30d: 9, severity: "medium", sentiment: "neutral", csat: 3.8 },
    engagement: { lastQbr: "2026-01-14", execSponsorStatus: "transitioning", lastTouchDays: 21, qbrAttendance: "champion replaced mid-cycle" },
    expansion: { historyArr: 40000, historyNote: "Modest +$40K seat add in 2025", signals: "Pending — new CTO doing tooling review" },
    relationship: { championStable: false, recentChanges: "CTO replaced 30 days ago. New CTO from Palantir background — likely more technical." },
    external: "FDA approval of new diagnostic line. Public statements about platform consolidation and tooling rationalization."
  },
  {
    id: 5,
    name: "Atlas Logistics",
    industry: "Supply Chain / Enterprise",
    logo: "AL",
    arr: 510000,
    contractEnd: "2026-11-04",
    tenureMonths: 33,
    usage: { utilization: 52, change30d: -7, trend: "down" },
    support: { tickets30d: 3, severity: "low", sentiment: "quiet", csat: 4.1 },
    engagement: { lastQbr: "2025-11-19", execSponsorStatus: "going dark", lastTouchDays: 62, qbrAttendance: "skipped last QBR" },
    expansion: { historyArr: 60000, historyNote: "One-time +$60K in 2024", signals: "None active" },
    relationship: { championStable: true, recentChanges: "Same champion but reduced internal authority post-reorg" },
    external: "Q4 2025 earnings missed. Cost-cutting announced. Layoffs in non-core functions reported in trade press."
  },
  {
    id: 6,
    name: "Ember Retail Holdings",
    industry: "E-commerce / Retail Tech",
    logo: "ER",
    arr: 380000,
    contractEnd: "2026-07-28",
    tenureMonths: 19,
    usage: { utilization: 73, change30d: 4, trend: "up" },
    support: { tickets30d: 7, severity: "medium", sentiment: "mixed", csat: 3.9 },
    engagement: { lastQbr: "2026-02-26", execSponsorStatus: "active", lastTouchDays: 9, qbrAttendance: "consistent" },
    expansion: { historyArr: 90000, historyNote: "+$90K in late 2025", signals: "Mixed — interested in adding modules but budget frozen" },
    relationship: { championStable: true, recentChanges: "Champion strong; new CFO is unknown variable" },
    external: "Announced 12% workforce reduction last week. Public memo emphasized 'focusing on highest-ROI vendors'."
  }
];

const formatCurrency = (n) => `$${(n / 1000).toFixed(0)}K`;

const HealthRing = ({ score, size = 120 }) => {
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#fb7185';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} stroke="#27272a" strokeWidth="6" fill="none" />
        <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth="6" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-light tracking-tight" style={{ fontFamily: 'JetBrains Mono, monospace', color }}>{score}</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">Health</span>
      </div>
    </div>
  );
};

const QuickHealth = ({ account, isSelected, onClick }) => {
  const usage = account.usage.utilization;
  const indicator = usage >= 75 ? 'emerald' : usage >= 50 ? 'amber' : 'rose';
  const indicatorColors = { emerald: 'bg-emerald-400', amber: 'bg-amber-400', rose: 'bg-rose-400' };

  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-l-2 transition-all duration-200 ${
        isSelected ? 'border-amber-400 bg-zinc-900/80' : 'border-transparent hover:bg-zinc-900/40 hover:border-zinc-700'
      }`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded flex items-center justify-center text-xs font-medium ${
          isSelected ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' : 'bg-zinc-800 text-zinc-400'
        }`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {account.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${indicatorColors[indicator]}`}></span>
            <p className="text-sm text-zinc-100 truncate">{account.name}</p>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{account.industry}</p>
          <p className="text-[11px] text-zinc-600 mt-1" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {formatCurrency(account.arr)} ARR
          </p>
        </div>
      </div>
    </button>
  );
};

const SignalCard = ({ icon: Icon, label, value, sublabel, accent = 'zinc' }) => {
  const accents = {
    zinc: 'text-zinc-300',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    rose: 'text-rose-400'
  };
  return (
    <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded">
      <div className="flex items-center gap-2 text-zinc-500 mb-2">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-sm ${accents[accent]}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>{value}</p>
      {sublabel && <p className="text-[11px] text-zinc-500 mt-1">{sublabel}</p>}
    </div>
  );
};

export default function HealthScoreEngine() {
  const [selectedId, setSelectedId] = useState(1);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coachMode, setCoachMode] = useState(false);
  const [reasoningOpen, setReasoningOpen] = useState(false);

  const account = MOCK_ACCOUNTS.find(a => a.id === selectedId);

  useEffect(() => {
    setAnalysis(null);
    setError(null);
    setReasoningOpen(false);
  }, [selectedId]);

  // Inject Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  const analyzeAccount = async () => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const prompt = `You are a Senior Customer Success strategist analyzing an enterprise SaaS account. You have deep experience managing multi-million-dollar portfolios with technical buyers (CTOs, VPs of Engineering).

Analyze this account using all signals provided and return a structured assessment.

ACCOUNT DATA:
${JSON.stringify(account, null, 2)}

Return ONLY valid JSON matching this exact schema. No preamble. No markdown fences. Just the JSON:

{
  "healthScore": <integer 0-100>,
  "scoreReasoning": "<2-3 sentences explaining the score, referencing specific signals from the data>",
  "weightedFactors": [
    {"factor": "Usage", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<one specific observation>"},
    {"factor": "Engagement", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<one specific observation>"},
    {"factor": "Commercial", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<one specific observation>"},
    {"factor": "Relationship", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<one specific observation>"},
    {"factor": "External", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<one specific observation>"}
  ],
  "riskFlags": [
    {"severity": "high|medium|low", "title": "<short headline>", "detail": "<specific, references data>"}
  ],
  "expansionSignals": [
    {"strength": "strong|moderate|weak", "title": "<short headline>", "detail": "<specific, references data>"}
  ],
  "nextAction": {
    "headline": "<specific, time-bound action with a verb>",
    "rationale": "<why this, why now — reference data>",
    "owner": "CSM|Exec Sponsor|AE|CS Ops",
    "timeline": "<this week|next 2 weeks|this month>"
  },
  "qbrTalkingPoints": ["<specific point 1>", "<specific point 2>", "<specific point 3>"],
  "coachScript": "<2-3 sentences the CSM could literally say opening their next call. Conversational, human, references something specific from the account context. Not a sales pitch.>"
}

Be specific. Reference actual numbers and named signals. Avoid generic CS platitudes like "schedule a check-in" or "build relationship." Every recommendation should be defensible to a CRO.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      const text = data.content.map(c => c.text || '').join('');
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setAnalysis(parsed);
    } catch (e) {
      setError(`Analysis failed: ${e.message}. Try again.`);
    } finally {
      setLoading(false);
    }
  };

  const severityColor = {
    high: 'border-rose-500/40 bg-rose-500/5 text-rose-300',
    medium: 'border-amber-500/40 bg-amber-500/5 text-amber-300',
    low: 'border-zinc-700 bg-zinc-900/40 text-zinc-400'
  };
  const strengthColor = {
    strong: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-300',
    moderate: 'border-emerald-500/20 bg-zinc-900/40 text-emerald-400/80',
    weak: 'border-zinc-700 bg-zinc-900/40 text-zinc-400'
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      {/* Top bar */}
      <header className="border-b border-zinc-900 px-8 py-5 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl text-amber-400" style={{ fontFamily: 'Instrument Serif, serif', letterSpacing: '-0.01em' }}>
            Helix<span className="italic text-zinc-500">.cs</span>
          </h1>
          <span className="text-[11px] uppercase tracking-widest text-zinc-600">Enterprise Health Engine</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <span>Built by Westin Eehn</span>
          <a href="https://linkedin.com/in/westineehn" target="_blank" rel="noopener noreferrer"
             className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Linkedin className="w-3.5 h-3.5" /> LinkedIn
          </a>
          <a href="#" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Github className="w-3.5 h-3.5" /> Source
          </a>
        </div>
      </header>

      <div className="grid grid-cols-12 min-h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="col-span-3 border-r border-zinc-900">
          <div className="px-4 py-4 border-b border-zinc-900">
            <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Portfolio</p>
            <p className="text-sm text-zinc-300" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {MOCK_ACCOUNTS.length} accounts · {formatCurrency(MOCK_ACCOUNTS.reduce((s,a)=>s+a.arr,0))} ARR
            </p>
          </div>
          <div className="py-1">
            {MOCK_ACCOUNTS.map(a => (
              <QuickHealth key={a.id} account={a}
                isSelected={a.id === selectedId}
                onClick={() => setSelectedId(a.id)} />
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-9 px-10 py-8">
          {/* Account header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2">{account.industry}</p>
              <h2 className="text-4xl text-zinc-100 mb-1" style={{ fontFamily: 'Instrument Serif, serif', letterSpacing: '-0.02em' }}>
                {account.name}
              </h2>
              <div className="flex items-center gap-4 text-xs text-zinc-500 mt-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                <span>{formatCurrency(account.arr)} ARR</span>
                <span className="text-zinc-700">·</span>
                <span>Renews {account.contractEnd}</span>
                <span className="text-zinc-700">·</span>
                <span>{account.tenureMonths}mo tenure</span>
              </div>
            </div>
            <button onClick={analyzeAccount} disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-zinc-950 text-sm font-medium rounded hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing</> : <><Sparkles className="w-4 h-4" /> Analyze with AI</>}
            </button>
          </div>

          {/* Signals grid */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <SignalCard icon={Activity} label="Utilization" 
              value={`${account.usage.utilization}%`}
              sublabel={`${account.usage.change30d > 0 ? '+' : ''}${account.usage.change30d}% last 30d`}
              accent={account.usage.utilization >= 75 ? 'emerald' : account.usage.utilization >= 50 ? 'amber' : 'rose'} />
            <SignalCard icon={MessageSquare} label="Support" 
              value={`${account.support.tickets30d} tickets / ${account.support.severity}`}
              sublabel={`CSAT ${account.support.csat} · ${account.support.sentiment}`}
              accent={account.support.severity === 'high' ? 'rose' : account.support.severity === 'medium' ? 'amber' : 'emerald'} />
            <SignalCard icon={Calendar} label="Engagement" 
              value={`${account.engagement.lastTouchDays}d since last touch`}
              sublabel={`Sponsor: ${account.engagement.execSponsorStatus}`}
              accent={account.engagement.lastTouchDays < 14 ? 'emerald' : account.engagement.lastTouchDays < 30 ? 'amber' : 'rose'} />
            <SignalCard icon={DollarSign} label="Expansion History" 
              value={account.expansion.historyArr > 0 ? `+${formatCurrency(account.expansion.historyArr)}` : 'None'}
              sublabel={account.expansion.historyNote}
              accent={account.expansion.historyArr > 0 ? 'emerald' : 'zinc'} />
            <SignalCard icon={Users} label="Champion" 
              value={account.relationship.championStable ? 'Stable' : 'Disrupted'}
              sublabel={account.relationship.recentChanges}
              accent={account.relationship.championStable ? 'emerald' : 'rose'} />
            <SignalCard icon={Zap} label="External Signal" 
              value="Market context"
              sublabel={account.external}
              accent="zinc" />
          </div>

          {/* Analysis output */}
          {error && (
            <div className="p-4 border border-rose-500/30 bg-rose-500/5 rounded text-sm text-rose-300">{error}</div>
          )}

          {!analysis && !loading && !error && (
            <div className="border border-dashed border-zinc-800 rounded p-10 text-center">
              <Sparkles className="w-6 h-6 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500">Click <span className="text-amber-400">Analyze with AI</span> to generate health score, risk flags, and prescriptive next actions.</p>
            </div>
          )}

          {analysis && (
            <div className="space-y-6 animate-in">
              {/* Top row: score + next action */}
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4 border border-zinc-800 rounded p-6 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900/40 to-transparent">
                  <HealthRing score={analysis.healthScore} />
                  <button onClick={() => setReasoningOpen(!reasoningOpen)}
                    className="mt-4 text-[11px] uppercase tracking-widest text-zinc-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
                    {reasoningOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />} Why this score?
                  </button>
                </div>
                <div className="col-span-8 border border-amber-400/30 rounded p-6 bg-amber-400/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-[11px] uppercase tracking-widest text-amber-400">Next Best Action</span>
                    <span className="ml-auto text-[10px] uppercase tracking-widest text-zinc-500" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                      {analysis.nextAction.owner} · {analysis.nextAction.timeline}
                    </span>
                  </div>
                  <h3 className="text-xl text-zinc-100 mb-3" style={{ fontFamily: 'Instrument Serif, serif' }}>
                    {analysis.nextAction.headline}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{analysis.nextAction.rationale}</p>
                </div>
              </div>

              {/* Reasoning panel */}
              {reasoningOpen && (
                <div className="border border-zinc-800 rounded p-6 bg-zinc-900/30">
                  <p className="text-sm text-zinc-300 leading-relaxed mb-5">{analysis.scoreReasoning}</p>
                  <div className="space-y-2">
                    {analysis.weightedFactors.map((f, i) => (
                      <div key={i} className="flex items-start gap-3 py-2 border-b border-zinc-900 last:border-0">
                        <span className="text-[11px] uppercase tracking-widest text-zinc-500 w-24 mt-0.5">{f.factor}</span>
                        <span className={`text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 ${
                          f.direction === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
                          f.direction === 'negative' ? 'bg-rose-500/10 text-rose-400' : 'bg-zinc-800 text-zinc-500'
                        }`}>{f.weight}</span>
                        <span className="text-sm text-zinc-400 flex-1">{f.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk + Expansion */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-[11px] uppercase tracking-widest text-zinc-500">Risk Flags</span>
                  </div>
                  <div className="space-y-2">
                    {analysis.riskFlags.length === 0 ? (
                      <div className="text-xs text-zinc-600 p-3 border border-dashed border-zinc-800 rounded">No active risks detected.</div>
                    ) : analysis.riskFlags.map((r, i) => (
                      <div key={i} className={`p-3 border rounded ${severityColor[r.severity]}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] uppercase tracking-widest opacity-70">{r.severity}</span>
                          <span className="text-sm font-medium">{r.title}</span>
                        </div>
                        <p className="text-xs opacity-80 leading-relaxed">{r.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] uppercase tracking-widest text-zinc-500">Expansion Signals</span>
                  </div>
                  <div className="space-y-2">
                    {analysis.expansionSignals.length === 0 ? (
                      <div className="text-xs text-zinc-600 p-3 border border-dashed border-zinc-800 rounded">No expansion signals identified.</div>
                    ) : analysis.expansionSignals.map((s, i) => (
                      <div key={i} className={`p-3 border rounded ${strengthColor[s.strength]}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] uppercase tracking-widest opacity-70">{s.strength}</span>
                          <span className="text-sm font-medium">{s.title}</span>
                        </div>
                        <p className="text-xs opacity-80 leading-relaxed">{s.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* QBR + Coach */}
              <div className="border border-zinc-800 rounded overflow-hidden">
                <div className="flex border-b border-zinc-800">
                  <button onClick={() => setCoachMode(false)}
                    className={`px-5 py-3 text-[11px] uppercase tracking-widest transition-colors ${!coachMode ? 'bg-zinc-900 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    QBR Talking Points
                  </button>
                  <button onClick={() => setCoachMode(true)}
                    className={`px-5 py-3 text-[11px] uppercase tracking-widest transition-colors ${coachMode ? 'bg-zinc-900 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                    Coach Mode · What to Say
                  </button>
                </div>
                <div className="p-6">
                  {!coachMode ? (
                    <ol className="space-y-3">
                      {analysis.qbrTalkingPoints.map((p, i) => (
                        <li key={i} className="flex gap-4 text-sm text-zinc-300">
                          <span className="text-amber-400/60" style={{ fontFamily: 'JetBrains Mono, monospace' }}>0{i+1}</span>
                          <span className="leading-relaxed">{p}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <blockquote className="text-base text-zinc-300 leading-relaxed italic border-l-2 border-amber-400/40 pl-5" style={{ fontFamily: 'Instrument Serif, serif' }}>
                      "{analysis.coachScript}"
                    </blockquote>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-600">
            <span>Demo data · Powered by Claude · {new Date().getFullYear()}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>v0.1 mvp</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
