import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Sparkles, ChevronDown, ChevronRight, MessageSquare, Target, Activity, Users, DollarSign, Calendar, Zap, Loader2, Linkedin, Github, Plus, X, Pencil, Clock } from 'lucide-react';

const INITIAL_ACCOUNTS = [
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

const formatCurrency = (n) => {
  const num = Number(n) || 0;
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  return `$${(num / 1000).toFixed(0)}K`;
};

// ── Categorization ──────────────────────────────────────────────
const getCategory = (account) => {
  const u = account.usage.utilization;
  const chg = account.usage.change30d;
  const touch = account.engagement.lastTouchDays;
  const sev = account.support.severity;
  const champion = account.relationship.championStable;
  const sponsor = account.engagement.execSponsorStatus;
  const expArr = Number(account.expansion.historyArr) || 0;
  const expSignals = account.expansion.signals;

  // At Risk signals
  const atRiskScore =
    (u < 50 ? 3 : u < 65 ? 1 : 0) +
    (chg < -15 ? 3 : chg < -5 ? 1 : 0) +
    (sev === 'high' ? 3 : sev === 'medium' ? 1 : 0) +
    (touch > 45 ? 3 : touch > 25 ? 1 : 0) +
    (!champion ? 2 : 0) +
    (sponsor === 'disengaged' || sponsor === 'going dark' ? 2 : 0);

  // Expansion signals
  const expansionScore =
    (expArr > 200000 ? 3 : expArr > 50000 ? 2 : expArr > 0 ? 1 : 0) +
    (expSignals && expSignals !== 'None' && expSignals !== 'None active' ? 2 : 0) +
    (u >= 80 ? 2 : u >= 70 ? 1 : 0) +
    (chg > 15 ? 2 : chg > 5 ? 1 : 0);

  if (atRiskScore >= 5) return 'at-risk';
  if (expansionScore >= 4) return 'expansion';
  return 'stable';
};

const getSubPriority = (account, category) => {
  const arr = Number(account.arr) || 0;

  if (category === 'at-risk') {
    const u = account.usage.utilization;
    const chg = account.usage.change30d;
    const touch = account.engagement.lastTouchDays;
    const sev = account.support.severity;
    const riskScore =
      (u < 50 ? 3 : u < 65 ? 1 : 0) +
      (chg < -15 ? 3 : chg < -5 ? 1 : 0) +
      (sev === 'high' ? 3 : 0) +
      (touch > 45 ? 3 : touch > 25 ? 1 : 0) +
      (!account.relationship.championStable ? 2 : 0);
    // Weight by ARR
    if (riskScore >= 9 || (riskScore >= 6 && arr >= 400000)) return 'P1';
    if (riskScore >= 5 || arr >= 300000) return 'P2';
    return 'P3';
  }

  if (category === 'expansion') {
    const expArr = Number(account.expansion.historyArr) || 0;
    if (arr >= 800000 || expArr >= 300000) return 'P1';
    if (arr >= 400000 || expArr >= 80000) return 'P2';
    return 'P3';
  }

  // stable — ranked by how healthy + ARR
  const u = account.usage.utilization;
  if (arr >= 700000 && u >= 85) return 'P1';
  if (arr >= 400000 || u >= 75) return 'P2';
  return 'P3';
};

const CATEGORY_META = {
  'at-risk':  { label: 'At Risk',        color: 'rose',    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  'expansion': { label: 'Expansion Opp', color: 'emerald', badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  'stable':   { label: 'Stable',         color: 'zinc',    badgeClass: 'bg-zinc-800 text-zinc-400 border-zinc-700' },
};

const SUB_PRIORITY_COLORS = {
  P1: { 'at-risk': 'text-rose-400', 'expansion': 'text-emerald-400', 'stable': 'text-zinc-300' },
  P2: { 'at-risk': 'text-rose-300/70', 'expansion': 'text-emerald-300/70', 'stable': 'text-zinc-400' },
  P3: { 'at-risk': 'text-rose-300/40', 'expansion': 'text-emerald-300/40', 'stable': 'text-zinc-500' },
};

// ── Shared form components ──────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{label}</label>
    {children}
  </div>
);
const Input = ({ value, onChange, placeholder, type = 'text' }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50" />
);
const Select = ({ value, onChange, children }) => (
  <select value={value} onChange={onChange}
    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-400/50">
    {children}
  </select>
);

// ── Account form (shared by Add + Edit) ────────────────────────
const BLANK = {
  name: '', industry: '', logo: '', arr: '', contractEnd: '', tenureMonths: '',
  usage: { utilization: '', change30d: '', trend: 'flat' },
  support: { tickets30d: '', severity: 'medium', sentiment: '', csat: '' },
  engagement: { lastQbr: '', execSponsorStatus: '', lastTouchDays: '', qbrAttendance: '' },
  expansion: { historyArr: '', historyNote: '', signals: '' },
  relationship: { championStable: true, recentChanges: '' },
  external: ''
};

const JSON_TEMPLATE = `{
  "name": "Acme Corp",
  "industry": "Enterprise SaaS",
  "arr": 500000,
  "contractEnd": "2026-12-31",
  "tenureMonths": 18,
  "usage": { "utilization": 72, "change30d": -5, "trend": "down" },
  "support": { "tickets30d": 8, "severity": "medium", "sentiment": "neutral", "csat": 3.9 },
  "engagement": { "lastQbr": "2026-02-01", "execSponsorStatus": "active", "lastTouchDays": 14, "qbrAttendance": "consistent" },
  "expansion": { "historyArr": 50000, "historyNote": "+$50K seat add 2025", "signals": "None active" },
  "relationship": { "championStable": true, "recentChanges": "Stable — same VP for 12 months" },
  "external": "Steady growth. No major news."
}`;

const AccountForm = ({ initial, onSubmit, onClose, title, submitLabel }) => {
  const toFormValues = (acc) => ({
    ...acc,
    arr: String(acc.arr ?? ''),
    tenureMonths: String(acc.tenureMonths ?? ''),
    usage: { ...acc.usage, utilization: String(acc.usage?.utilization ?? ''), change30d: String(acc.usage?.change30d ?? '') },
    support: { ...acc.support, tickets30d: String(acc.support?.tickets30d ?? ''), csat: String(acc.support?.csat ?? '') },
    engagement: { ...acc.engagement, lastTouchDays: String(acc.engagement?.lastTouchDays ?? '') },
    expansion: { ...acc.expansion, historyArr: String(acc.expansion?.historyArr ?? '') },
  });

  const [form, setForm] = useState(initial ? toFormValues(initial) : BLANK);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const set = (path, value) => {
    setForm(prev => {
      const parts = path.split('.');
      if (parts.length === 1) return { ...prev, [path]: value };
      return { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: value } };
    });
  };

  const handleJsonParse = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setForm(toFormValues({ ...BLANK, ...parsed }));
      setJsonError('');
      setJsonMode(false);
    } catch { setJsonError('Invalid JSON — check formatting and try again.'); }
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSubmit({
      ...form,
      logo: form.logo || form.name.slice(0, 2).toUpperCase(),
      arr: Number(form.arr) || 0,
      tenureMonths: Number(form.tenureMonths) || 0,
      usage: { ...form.usage, utilization: Number(form.usage.utilization) || 0, change30d: Number(form.usage.change30d) || 0 },
      support: { ...form.support, tickets30d: Number(form.support.tickets30d) || 0, csat: Number(form.support.csat) || 0 },
      engagement: { ...form.engagement, lastTouchDays: Number(form.engagement.lastTouchDays) || 0 },
      expansion: { ...form.expansion, historyArr: Number(form.expansion.historyArr) || 0 },
      relationship: { ...form.relationship, championStable: form.relationship.championStable === true || form.relationship.championStable === 'true' },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg text-zinc-100" style={{ fontFamily: 'Instrument Serif, serif' }}>{title}</h2>
          <div className="flex items-center gap-3">
            {!initial && (
              <button onClick={() => setJsonMode(!jsonMode)}
                className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors">
                {jsonMode ? 'Manual Entry' : 'Paste JSON'}
              </button>
            )}
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {jsonMode && !initial ? (
            <div className="space-y-3">
              <p className="text-xs text-zinc-500">Paste account data as JSON. Copy the template, fill in your values, paste it back.</p>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded">
                <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-2">Template</p>
                <pre className="text-[11px] text-zinc-400 overflow-x-auto whitespace-pre-wrap">{JSON_TEMPLATE}</pre>
              </div>
              <textarea value={jsonInput} onChange={e => setJsonInput(e.target.value)}
                placeholder="Paste your JSON here..." rows={10}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50 font-mono" />
              {jsonError && <p className="text-xs text-rose-400">{jsonError}</p>}
              <button onClick={handleJsonParse}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm rounded hover:bg-zinc-700 transition-colors">
                Parse → Switch to Form
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Account Name *"><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Acme Corp" /></Field>
                <Field label="Industry"><Input value={form.industry} onChange={e => set('industry', e.target.value)} placeholder="Enterprise SaaS" /></Field>
                <Field label="ARR ($)"><Input type="number" value={form.arr} onChange={e => set('arr', e.target.value)} placeholder="500000" /></Field>
                <Field label="Contract End"><Input type="date" value={form.contractEnd} onChange={e => set('contractEnd', e.target.value)} /></Field>
                <Field label="Tenure (months)"><Input type="number" value={form.tenureMonths} onChange={e => set('tenureMonths', e.target.value)} placeholder="18" /></Field>
                <Field label="Logo (2 chars)"><Input value={form.logo} onChange={e => set('logo', e.target.value)} placeholder="AC" /></Field>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Usage</p>
                <div className="grid grid-cols-3 gap-4">
                  <Field label="Utilization %"><Input type="number" value={form.usage.utilization} onChange={e => set('usage.utilization', e.target.value)} placeholder="72" /></Field>
                  <Field label="30d Change %"><Input type="number" value={form.usage.change30d} onChange={e => set('usage.change30d', e.target.value)} placeholder="-5" /></Field>
                  <Field label="Trend"><Select value={form.usage.trend} onChange={e => set('usage.trend', e.target.value)}><option value="up">Up</option><option value="flat">Flat</option><option value="down">Down</option></Select></Field>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Support</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Tickets (30d)"><Input type="number" value={form.support.tickets30d} onChange={e => set('support.tickets30d', e.target.value)} placeholder="8" /></Field>
                  <Field label="Severity"><Select value={form.support.severity} onChange={e => set('support.severity', e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select></Field>
                  <Field label="Sentiment"><Input value={form.support.sentiment} onChange={e => set('support.sentiment', e.target.value)} placeholder="neutral" /></Field>
                  <Field label="CSAT (0–5)"><Input type="number" value={form.support.csat} onChange={e => set('support.csat', e.target.value)} placeholder="3.9" /></Field>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Engagement</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Last QBR"><Input type="date" value={form.engagement.lastQbr} onChange={e => set('engagement.lastQbr', e.target.value)} /></Field>
                  <Field label="Days Since Last Touch"><Input type="number" value={form.engagement.lastTouchDays} onChange={e => set('engagement.lastTouchDays', e.target.value)} placeholder="14" /></Field>
                  <Field label="Exec Sponsor Status"><Input value={form.engagement.execSponsorStatus} onChange={e => set('engagement.execSponsorStatus', e.target.value)} placeholder="active" /></Field>
                  <Field label="QBR Attendance"><Input value={form.engagement.qbrAttendance} onChange={e => set('engagement.qbrAttendance', e.target.value)} placeholder="consistent" /></Field>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Expansion</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Expansion ARR ($)"><Input type="number" value={form.expansion.historyArr} onChange={e => set('expansion.historyArr', e.target.value)} placeholder="50000" /></Field>
                  <Field label="Expansion Note"><Input value={form.expansion.historyNote} onChange={e => set('expansion.historyNote', e.target.value)} placeholder="+$50K seat add 2025" /></Field>
                  <Field label="Signals"><Input value={form.expansion.signals} onChange={e => set('expansion.signals', e.target.value)} placeholder="None active" /></Field>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Relationship</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Champion Stable?">
                    <Select value={String(form.relationship.championStable)} onChange={e => set('relationship.championStable', e.target.value === 'true')}>
                      <option value="true">Stable</option><option value="false">Disrupted</option>
                    </Select>
                  </Field>
                  <Field label="Recent Changes"><Input value={form.relationship.recentChanges} onChange={e => set('relationship.recentChanges', e.target.value)} placeholder="Stable — same VP for 12 months" /></Field>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">External Signal</p>
                <Field label="Market / News Context">
                  <textarea value={form.external} onChange={e => set('external', e.target.value)}
                    placeholder="Recent funding, layoffs, earnings, M&A, product launches..." rows={3}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50" />
                </Field>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-4 border-t border-zinc-800 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Cancel</button>
          <button onClick={handleSubmit}
            className="px-5 py-2 bg-amber-400 text-zinc-950 text-sm font-medium rounded hover:bg-amber-300 transition-colors">
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Sidebar account row ─────────────────────────────────────────
const QuickHealth = ({ account, isSelected, onClick }) => {
  const cat = getCategory(account);
  const sub = getSubPriority(account, cat);
  const meta = CATEGORY_META[cat];
  const dotColor = cat === 'at-risk' ? 'bg-rose-400' : cat === 'expansion' ? 'bg-emerald-400' : 'bg-zinc-500';

  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-3 border-l-2 transition-all duration-200 ${
        isSelected ? 'border-amber-400 bg-zinc-900/80' : 'border-transparent hover:bg-zinc-900/40 hover:border-zinc-700'
      }`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium flex-shrink-0 ${
          isSelected ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30' : 'bg-zinc-800 text-zinc-400'
        }`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          {account.logo || account.name.slice(0,2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`}></span>
            <p className="text-sm text-zinc-100 truncate">{account.name}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[9px] font-medium ${SUB_PRIORITY_COLORS[sub][cat]}`}>{sub}</span>
            <span className="text-zinc-700 text-[9px]">·</span>
            <span className="text-[11px] text-zinc-600" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
              {formatCurrency(account.arr)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

const SignalCard = ({ icon: Icon, label, value, sublabel, accent = 'zinc' }) => {
  const accents = { zinc: 'text-zinc-300', emerald: 'text-emerald-400', amber: 'text-amber-400', rose: 'text-rose-400' };
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
        <span className="text-3xl font-light" style={{ fontFamily: 'JetBrains Mono, monospace', color }}>{score}</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">Health</span>
      </div>
    </div>
  );
};

// ── Category badge ──────────────────────────────────────────────
const CatBadge = ({ cat, sub }) => {
  const meta = CATEGORY_META[cat];
  return (
    <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${meta.badgeClass}`}>
      {meta.label} · {sub}
    </span>
  );
};

// ── TL;DR generator (simple rule-based, no extra API call) ──────
const getTldr = (account) => {
  const cat = getCategory(account);
  const u = account.usage.utilization;
  const touch = account.engagement.lastTouchDays;
  const arr = formatCurrency(account.arr);
  const expArr = Number(account.expansion.historyArr) || 0;

  if (cat === 'at-risk') {
    const reasons = [];
    if (u < 50) reasons.push(`utilization at ${u}%`);
    if (!account.relationship.championStable) reasons.push('champion disrupted');
    if (touch > 45) reasons.push(`${touch} days since last touch`);
    if (account.support.severity === 'high') reasons.push('high-severity support load');
    return `${arr} ARR account showing ${reasons.slice(0,2).join(' and ')}. Renewal risk is elevated — intervention needed before the window closes.`;
  }
  if (cat === 'expansion') {
    return `${arr} ARR account with strong utilization (${u}%) and ${expArr > 0 ? formatCurrency(expArr) + ' in prior expansion' : 'active expansion signals'}. High-potential candidate for upsell conversation this quarter.`;
  }
  return `${arr} ARR account tracking well with ${u}% utilization and ${touch < 14 ? 'recent' : touch + '-day'} last touch. Maintain cadence and monitor for early signs of drift.`;
};

// ── Main app ────────────────────────────────────────────────────
export default function HealthScoreEngine() {
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [selectedId, setSelectedId] = useState(1);
  const [analysisMap, setAnalysisMap] = useState({});  // keyed by account id
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [coachMode, setCoachMode] = useState(false);
  const [reasoningOpen, setReasoningOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  const account = accounts.find(a => a.id === selectedId);
  const analysis = account ? analysisMap[account.id] : null;

  const totalArr = accounts.reduce((sum, a) => sum + (Number(a.arr) || 0), 0);
  const formatTotal = (n) => `$${(n / 1000000).toFixed(2)}M`;

  // Group by category then sub-priority
  const grouped = { 'at-risk': {}, 'expansion': {}, 'stable': {} };
  accounts.forEach(a => {
    const cat = getCategory(a);
    const sub = getSubPriority(a, cat);
    if (!grouped[cat][sub]) grouped[cat][sub] = [];
    grouped[cat][sub].push(a);
  });

  useEffect(() => {
    setError(null);
    setReasoningOpen(false);
    setCoachMode(false);
  }, [selectedId]);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const analyzeAccount = async () => {
    setLoading(true);
    setError(null);

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
  "immediateActions": [
    "<specific action item 1 — one sentence, verb-first>",
    "<specific action item 2>",
    "<specific action item 3>"
  ],
  "qbrTalkingPoints": ["<specific point 1>", "<specific point 2>", "<specific point 3>"],
  "coachScript": "<2-3 sentences the CSM could literally say opening their next call. Conversational, human, references something specific from the account context. Not a sales pitch.>"
}

Be specific. Reference actual numbers and named signals. Avoid generic CS platitudes. Every recommendation must be defensible to a CRO.`;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const data = await response.json();
      const text = data.content.map(c => c.text || '').join('');
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      parsed.analyzedAt = new Date().toISOString();
      setAnalysisMap(prev => ({ ...prev, [account.id]: parsed }));
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

  const cat = account ? getCategory(account) : 'stable';
  const sub = account ? getSubPriority(account, cat) : 'P3';
  const tldr = account ? getTldr(account) : '';

  const formatAnalysisDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' +
      d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{ fontFamily: 'IBM Plex Sans, system-ui, sans-serif' }}>
      {showAddModal && (
        <AccountForm
          title="Add Account"
          submitLabel="Add Account"
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => {
            const newAcc = { ...data, id: Date.now() };
            setAccounts(prev => [...prev, newAcc]);
            setSelectedId(newAcc.id);
            setShowAddModal(false);
          }}
        />
      )}
      {editingAccount && (
        <AccountForm
          title={`Edit — ${editingAccount.name}`}
          submitLabel="Save Changes"
          initial={editingAccount}
          onClose={() => setEditingAccount(null)}
          onSubmit={(data) => {
            setAccounts(prev => prev.map(a => a.id === editingAccount.id ? { ...data, id: editingAccount.id } : a));
            setEditingAccount(null);
          }}
        />
      )}

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
          <a href="https://github.com/westineehn/helix-cx" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
            <Github className="w-3.5 h-3.5" /> Source
          </a>
        </div>
      </header>

      <div className="grid grid-cols-12 min-h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="col-span-3 border-r border-zinc-900 flex flex-col">
          <div className="px-4 py-4 border-b border-zinc-900 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-1">Portfolio</p>
              <p className="text-sm text-zinc-300" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {accounts.length} accounts · {formatTotal(totalArr)} ARR
              </p>
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 rounded text-[11px] transition-colors">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>

          <div className="overflow-y-auto flex-1 py-1">
            {['at-risk', 'expansion', 'stable'].map(cat => {
              const catAccounts = Object.values(grouped[cat]).flat();
              if (catAccounts.length === 0) return null;
              const meta = CATEGORY_META[cat];
              return (
                <div key={cat}>
                  <div className={`px-4 py-2 flex items-center gap-2 border-b border-zinc-900/60`}>
                    <span className={`text-[10px] uppercase tracking-widest font-medium text-${meta.color}-400`}>{meta.label}</span>
                    <span className="text-[10px] text-zinc-600">{catAccounts.length}</span>
                  </div>
                  {['P1', 'P2', 'P3'].map(sub => (
                    grouped[cat][sub]?.map(a => (
                      <QuickHealth key={a.id} account={a} isSelected={a.id === selectedId} onClick={() => setSelectedId(a.id)} />
                    ))
                  ))}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-9 px-10 py-8 overflow-y-auto">
          {account && (
            <>
              {/* Account header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1 mr-6">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-[11px] uppercase tracking-widest text-zinc-500">{account.industry}</p>
                    <CatBadge cat={cat} sub={sub} />
                  </div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-4xl text-zinc-100" style={{ fontFamily: 'Instrument Serif, serif', letterSpacing: '-0.02em' }}>
                      {account.name}
                    </h2>
                    <button onClick={() => setEditingAccount(account)}
                      className="text-zinc-600 hover:text-amber-400 transition-colors mt-1">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mt-2 mb-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    <span>{formatCurrency(Number(account.arr))} ARR</span>
                    <span className="text-zinc-700">·</span>
                    <span>Renews {account.contractEnd}</span>
                    <span className="text-zinc-700">·</span>
                    <span>{account.tenureMonths}mo tenure</span>
                  </div>
                  {/* TL;DR */}
                  <p className="text-sm text-zinc-400 leading-relaxed border-l-2 border-zinc-800 pl-3 mb-3">{tldr}</p>

                  {/* Immediate actions from last analysis */}
                  {analysis?.immediateActions && (
                    <div className="border border-zinc-800/60 rounded p-3 bg-zinc-900/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        <span className="text-[10px] uppercase tracking-widest text-zinc-600">Action Items · Analysis from {formatAnalysisDate(analysis.analyzedAt)}</span>
                      </div>
                      <ul className="space-y-1">
                        {analysis.immediateActions.map((item, i) => (
                          <li key={i} className="flex gap-2 text-xs text-zinc-400">
                            <span className="text-amber-400/50 mt-0.5 flex-shrink-0">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <button onClick={analyzeAccount} disabled={loading}
                  className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-zinc-950 text-sm font-medium rounded hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing</> : <><Sparkles className="w-4 h-4" /> Analyze with AI</>}
                </button>
              </div>

              {/* Signal cards */}
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
                  value="Market context" sublabel={account.external} accent="zinc" />
              </div>

              {error && <div className="p-4 border border-rose-500/30 bg-rose-500/5 rounded text-sm text-rose-300 mb-6">{error}</div>}

              {!analysis && !loading && !error && (
                <div className="border border-dashed border-zinc-800 rounded p-10 text-center">
                  <Sparkles className="w-6 h-6 text-zinc-700 mx-auto mb-3" />
                  <p className="text-sm text-zinc-500">Click <span className="text-amber-400">Analyze with AI</span> to generate health score, risk flags, and prescriptive next actions.</p>
                </div>
              )}

              {analysis && (
                <div className="space-y-6">
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-[11px] uppercase tracking-widest text-zinc-500">Risk Flags</span>
                      </div>
                      <div className="space-y-2">
                        {!analysis.riskFlags?.length
                          ? <div className="text-xs text-zinc-600 p-3 border border-dashed border-zinc-800 rounded">No active risks detected.</div>
                          : analysis.riskFlags.map((r, i) => (
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
                        {!analysis.expansionSignals?.length
                          ? <div className="text-xs text-zinc-600 p-3 border border-dashed border-zinc-800 rounded">No expansion signals identified.</div>
                          : analysis.expansionSignals.map((s, i) => (
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
            </>
          )}

          <footer className="mt-12 pt-6 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-600">
            <span>Demo data · Powered by Claude · {new Date().getFullYear()}</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>v0.3</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
