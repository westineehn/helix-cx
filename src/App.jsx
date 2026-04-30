import { useState, useEffect, useCallback } from "react";
import { TrendingUp, AlertTriangle, Sparkles, ChevronDown, ChevronRight, MessageSquare, Target, Activity, Users, DollarSign, Calendar, Zap, Loader2, Linkedin, Github, Plus, X, Pencil, Clock, AlertCircle, Lock, RefreshCw, ExternalLink } from "lucide-react";

const STORAGE_ACCOUNTS = 'helix-accounts-v5';
const STORAGE_ANALYSIS  = 'helix-analysis-v5';
const STORAGE_NEWS      = 'helix-news-v5';

// ── Real company accounts ───────────────────────────────────────
const DEFAULT_ACCOUNTS = [
  {
    id: 1,
    name: "Netflix",
    company: "Netflix",
    industry: "Connected TV / Streaming",
    logo: "NF",
    arr: 1200000,
    contractEnd: "2027-03-15",
    tenureMonths: 31,
    usage: { utilization: 96, change30d: 8, trend: "up" },
    support: { tickets30d: 4, severity: "low", sentiment: "positive", csat: 4.8 },
    engagement: { lastQbr: "2026-03-18", execSponsorStatus: "highly active", lastTouchDays: 4, qbrAttendance: "100%" },
    expansion: { historyArr: 300000, historyNote: "+$300K Q4 2025 (ad-tier rollout)", signals: "Exploring gaming vertical integration" },
    relationship: { championStable: true, recentChanges: "Same VP Eng and CTO for 26 months. Strong exec alignment." },
    external: "Q1 2026 revenue $12.25B, up 16% YoY. Ad tier on track for $3B revenue. Raising subscription prices across all plans.",
    renewal: { probability: "high", contractType: "multi-year", autoRenew: true, competitiveExposure: "none", updatedAt: "2026-04-28" }
  },
  {
    id: 2,
    name: "Oracle",
    company: "Oracle",
    industry: "Enterprise IT / Cloud Infrastructure",
    logo: "OR",
    arr: 580000,
    contractEnd: "2026-08-31",
    tenureMonths: 22,
    usage: { utilization: 44, change30d: -16, trend: "down" },
    support: { tickets30d: 21, severity: "high", sentiment: "frustrated", csat: 2.7 },
    engagement: { lastQbr: "2025-12-15", execSponsorStatus: "disengaged", lastTouchDays: 52, qbrAttendance: "missed last 2" },
    expansion: { historyArr: 0, historyNote: "Flat since initial contract", signals: "None — budget frozen" },
    relationship: { championStable: false, recentChanges: "Original VP champion departed March 2026. New co-CEOs Sicilia and Magouyrk named — internal priorities unknown." },
    external: "20-30K layoffs confirmed to fund $50B AI infrastructure buildout. New co-CEOs named. Cerner sale under consideration. Vendor budgets under active review.",
    renewal: { probability: "at-risk", contractType: "annual", autoRenew: false, competitiveExposure: "active-eval", updatedAt: "2026-04-28" }
  },
  {
    id: 3,
    name: "Anthropic",
    company: "Anthropic",
    industry: "AI / Foundation Models",
    logo: "AN",
    arr: 1500000,
    contractEnd: "2027-06-01",
    tenureMonths: 16,
    usage: { utilization: 91, change30d: 19, trend: "up" },
    support: { tickets30d: 9, severity: "medium", sentiment: "engaged", csat: 4.6 },
    engagement: { lastQbr: "2026-04-02", execSponsorStatus: "highly active", lastTouchDays: 2, qbrAttendance: "100% + ad-hoc syncs" },
    expansion: { historyArr: 500000, historyNote: "+$500K Q1 2026 (enterprise seat expansion)", signals: "CTO requesting capacity scoping for new model evaluation pipeline" },
    relationship: { championStable: true, recentChanges: "Added Director of ML Infrastructure as secondary champion. Core team stable." },
    external: "Closed $30B Series G at $380B valuation Feb 2026. Enterprise subscriptions 4x YTD. Claude Code ARR at $2.5B run rate. Aggressive enterprise hiring.",
    renewal: { probability: "high", contractType: "multi-year", autoRenew: true, competitiveExposure: "none", updatedAt: "2026-04-28" }
  },
  {
    id: 4,
    name: "Allstate",
    company: "Allstate",
    industry: "P&C Insurance",
    logo: "AL",
    arr: 390000,
    contractEnd: "2026-09-30",
    tenureMonths: 24,
    usage: { utilization: 58, change30d: -9, trend: "down" },
    support: { tickets30d: 12, severity: "medium", sentiment: "neutral", csat: 3.5 },
    engagement: { lastQbr: "2026-01-22", execSponsorStatus: "transitioning", lastTouchDays: 38, qbrAttendance: "champion replaced mid-cycle" },
    expansion: { historyArr: 30000, historyNote: "Modest +$30K seat add in 2025", signals: "None — cost review underway" },
    relationship: { championStable: false, recentChanges: "Agency consolidation program displaced original champion. New stakeholder from direct channel team — relationship not yet established." },
    external: "Consolidating agencies, reducing commissions 23% on new business. Workforce reduction underway. Cost-cutting mode with focus on direct channel over traditional agency model.",
    renewal: { probability: "medium", contractType: "annual", autoRenew: false, competitiveExposure: "rumored", updatedAt: "2026-04-28" }
  },
  {
    id: 5,
    name: "Nike",
    company: "Nike",
    industry: "Retail / Consumer Goods",
    logo: "NK",
    arr: 470000,
    contractEnd: "2026-11-15",
    tenureMonths: 28,
    usage: { utilization: 55, change30d: -6, trend: "down" },
    support: { tickets30d: 8, severity: "medium", sentiment: "mixed", csat: 3.7 },
    engagement: { lastQbr: "2026-02-10", execSponsorStatus: "transitioning", lastTouchDays: 28, qbrAttendance: "inconsistent — internal restructuring" },
    expansion: { historyArr: 70000, historyNote: "+$70K in late 2025", signals: "Paused — pending outcome of Win Now restructuring" },
    relationship: { championStable: true, recentChanges: "Champion stable but operating under significant internal pressure from Win Now transformation mandate." },
    external: "Second round of layoffs in 2026 — 1,400 roles cut April 2026. DTC revenue fell 4% while wholesale grew 5%. Win Now restructuring program targeting margin recovery.",
    renewal: { probability: "at-risk", contractType: "annual", autoRenew: false, competitiveExposure: "rumored", updatedAt: "2026-04-29" }
  },
  {
    id: 6,
    name: "FedEx",
    company: "FedEx",
    industry: "Supply Chain / Logistics",
    logo: "FX",
    arr: 640000,
    contractEnd: "2027-01-31",
    tenureMonths: 36,
    usage: { utilization: 78, change30d: 3, trend: "up" },
    support: { tickets30d: 5, severity: "low", sentiment: "positive", csat: 4.3 },
    engagement: { lastQbr: "2026-03-05", execSponsorStatus: "active", lastTouchDays: 11, qbrAttendance: "consistent" },
    expansion: { historyArr: 120000, historyNote: "+$120K in 2025 (Network 2.0 rollout)", signals: "Evaluating additional modules for digital intelligence layer" },
    relationship: { championStable: true, recentChanges: "Same VP Operations for 3 years. Strong relationship. New CFO Dietrich aligned to transformation agenda." },
    external: "Q3 2026 earnings beat — revenue up 8% YoY, raised full-year guidance to $19.30-$20.10 EPS. Network 2.0 delivering $1B+ in cost savings. Spinning off FedEx Freight by June 2026.",
    renewal: { probability: "high", contractType: "multi-year", autoRenew: true, competitiveExposure: "none", updatedAt: "2026-04-28" }
  },
  {
    id: 7,
    name: "Asana",
    company: "Asana",
    industry: "Work Management / Enterprise SaaS",
    logo: "AS",
    arr: 500000,
    contractEnd: "2027-06-30",
    tenureMonths: 48,
    usage: { utilization: 34, change30d: -5, trend: "down" },
    support: { tickets30d: 8, severity: "medium", sentiment: "neutral", csat: 3.6 },
    engagement: { lastQbr: "2026-01-15", execSponsorStatus: "active", lastTouchDays: 7, qbrAttendance: "consistent — prior CSM" },
    expansion: { historyArr: 150000, historyNote: "+$150K 2025 (Device Trust expansion)", signals: "None active — adoption gaps must close first" },
    relationship: { championStable: false, recentChanges: "CSM transition — new CSM assigned. Client-side contacts stable (VP Security, Director IT, IT Manager) but relationship with new CSM not yet established." },
    external: "Asana navigating co-CEO transition and workforce restructuring. Focus on enterprise security initiatives and device compliance. Long-term 1Password partner with significant untapped EPM and Device Trust adoption potential.",
    renewal: { probability: "medium", contractType: "multi-year", autoRenew: false, competitiveExposure: "none", updatedAt: "2026-04-29" }
  }
];

// ── Formatters ──────────────────────────────────────────────────
const fmtC = (n) => { const x=Number(n)||0; return x>=1e6?`$${(x/1e6).toFixed(2)}M`:`$${(x/1000).toFixed(0)}K`; };
const fmtTotal = (n) => `$${(n/1e6).toFixed(2)}M`;
const fmtDate = (iso) => { const d=new Date(iso); return d.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' · '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}); };
const hoursAgo = (iso) => Math.round((Date.now()-new Date(iso).getTime())/36e5);
const minsAgo = (iso) => Math.round((Date.now()-new Date(iso).getTime())/60000);

const fmtAge = (iso) => {
  const mins = minsAgo(iso);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins/60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs/24)}d ago`;
};

// ── Categorization ──────────────────────────────────────────────
const getCategory = (a) => {
  const u=a.usage.utilization, chg=a.usage.change30d, touch=a.engagement.lastTouchDays;
  const sev=a.support.severity, ch=a.relationship.championStable, sp=a.engagement.execSponsorStatus;
  const expArr=Number(a.expansion.historyArr)||0, expSig=a.expansion.signals;
  const renewalProb=a.renewal?.probability||'medium';
  const compExposure=a.renewal?.competitiveExposure||'none';
  const atRisk =
    (u<50?3:u<65?1:0)+(chg<-15?3:chg<-5?1:0)+(sev==='high'?3:sev==='medium'?1:0)+
    (touch>45?3:touch>25?1:0)+(!ch?2:0)+(sp==='disengaged'||sp==='going dark'?2:0)+
    (renewalProb==='at-risk'?2:renewalProb==='medium'?1:0)+
    (compExposure==='active-eval'?2:compExposure==='rumored'?1:0);
  const expansion =
    (expArr>300000?3:expArr>150000?2:expArr>0?1:0)+
    (expSig&&expSig!=='None'&&!expSig.startsWith('None active')?2:0)+
    (u>=85?2:u>=75?1:0)+(chg>15?2:chg>8?1:0);
  if (atRisk>=5) return 'at-risk';
  if (expansion>=6) return 'expansion';
  return 'stable';
};

const getSubPriority = (a, cat) => {
  const arr=Number(a.arr)||0;
  if (cat==='at-risk') {
    const s=(a.usage.utilization<50?3:a.usage.utilization<65?1:0)+(a.usage.change30d<-15?3:a.usage.change30d<-5?1:0)+
      (a.support.severity==='high'?3:0)+(a.engagement.lastTouchDays>45?3:a.engagement.lastTouchDays>25?1:0)+(!a.relationship.championStable?2:0);
    if (s>=9||(s>=6&&arr>=400000)) return 'P1';
    if (s>=5||arr>=300000) return 'P2';
    return 'P3';
  }
  if (cat==='expansion') {
    const e=Number(a.expansion.historyArr)||0;
    if (arr>=1000000||e>=400000) return 'P1';
    if (arr>=500000||e>=100000) return 'P2';
    return 'P3';
  }
  if (arr>=800000&&a.usage.utilization>=85) return 'P1';
  if (arr>=500000||a.usage.utilization>=75) return 'P2';
  return 'P3';
};

const CAT_META = {
  'at-risk':   { label:'At Risk',       dotClass:'bg-rose-400',    headerClass:'text-rose-400',    badgeClass:'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  'expansion': { label:'Expansion Opp', dotClass:'bg-emerald-400', headerClass:'text-emerald-400', badgeClass:'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  'stable':    { label:'Stable',        dotClass:'bg-zinc-500',    headerClass:'text-zinc-400',    badgeClass:'bg-zinc-800 text-zinc-400 border-zinc-700' },
};
const SUB_COLOR = {
  P1:{'at-risk':'text-rose-400','expansion':'text-emerald-400','stable':'text-zinc-300'},
  P2:{'at-risk':'text-rose-300/70','expansion':'text-emerald-300/70','stable':'text-zinc-400'},
  P3:{'at-risk':'text-rose-300/40','expansion':'text-emerald-300/40','stable':'text-zinc-500'},
};

// ── Rule-based TL;DR (pre-analysis fallback) ────────────────────
const getTldrFallback = (a) => {
  const cat=getCategory(a), u=a.usage.utilization, touch=a.engagement.lastTouchDays, arr=fmtC(a.arr);
  const expArr=Number(a.expansion.historyArr)||0;
  if (cat==='at-risk') {
    const r=[];
    if (u<50) r.push(`utilization at ${u}%`);
    if (!a.relationship.championStable) r.push('champion disrupted');
    if (touch>45) r.push(`${touch}d since last touch`);
    if (a.support.severity==='high') r.push('high-severity support load');
    return `${arr} ARR account showing ${r.slice(0,2).join(' and ')}. Renewal risk elevated — intervention needed.`;
  }
  if (cat==='expansion') return `${arr} ARR account at ${u}% utilization with ${expArr>0?fmtC(expArr)+' in prior expansion':'active expansion signals'}. Strong upsell candidate this quarter.`;
  return `${arr} ARR account stable at ${u}% utilization. ${touch<14?'Recently touched.':touch+' days since last touch.'} Maintain cadence.`;
};

// ── Shared primitives ───────────────────────────────────────────
const Field = ({label,children}) => (<div><label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">{label}</label>{children}</div>);
const Input = ({value,onChange,placeholder,type='text'}) => (<input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50"/>);
const Sel = ({value,onChange,children}) => (<select value={value} onChange={onChange} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-400/50">{children}</select>);

// ── Account form ────────────────────────────────────────────────
const BLANK = { name:'',company:'',industry:'',logo:'',arr:'',contractEnd:'',tenureMonths:'', usage:{utilization:'',change30d:'',trend:'flat'}, support:{tickets30d:'',severity:'medium',sentiment:'',csat:''}, engagement:{lastQbr:'',execSponsorStatus:'',lastTouchDays:'',qbrAttendance:''}, expansion:{historyArr:'',historyNote:'',signals:''}, relationship:{championStable:true,recentChanges:''}, external:'', renewal:{probability:'medium',contractType:'annual',autoRenew:false,competitiveExposure:'none',updatedAt:''} };
const toForm = (a) => ({...a,arr:String(a.arr??''),tenureMonths:String(a.tenureMonths??''),usage:{...a.usage,utilization:String(a.usage?.utilization??''),change30d:String(a.usage?.change30d??'')},support:{...a.support,tickets30d:String(a.support?.tickets30d??''),csat:String(a.support?.csat??'')},engagement:{...a.engagement,lastTouchDays:String(a.engagement?.lastTouchDays??'')},expansion:{...a.expansion,historyArr:String(a.expansion?.historyArr??'')},renewal:{...(a.renewal||{})}});
const fromForm = (f) => {
  const usage = f.usage || {};
  const support = f.support || {};
  const engagement = f.engagement || {};
  const expansion = f.expansion || {};
  const relationship = f.relationship || {};
  const renewal = f.renewal || {};
  return {
    ...f,
    logo: f.logo || (f.name||'??').slice(0,2).toUpperCase(),
    company: f.company || f.name,
    arr: Number(f.arr) || 0,
    tenureMonths: Number(f.tenureMonths) || 0,
    usage: { utilization: Number(usage.utilization)||0, change30d: Number(usage.change30d)||0, trend: usage.trend||'flat' },
    support: { tickets30d: Number(support.tickets30d)||0, severity: support.severity||'medium', sentiment: support.sentiment||'', csat: Number(support.csat)||0 },
    engagement: { lastQbr: engagement.lastQbr||'', execSponsorStatus: engagement.execSponsorStatus||'', lastTouchDays: Number(engagement.lastTouchDays)||0, qbrAttendance: engagement.qbrAttendance||'' },
    expansion: { historyArr: Number(expansion.historyArr)||0, historyNote: expansion.historyNote||'', signals: expansion.signals||'' },
    relationship: { championStable: relationship.championStable===true||relationship.championStable==='true', recentChanges: relationship.recentChanges||'' },
    external: f.external || '',
    renewal: { probability: renewal.probability||'medium', contractType: renewal.contractType||'annual', autoRenew: renewal.autoRenew===true||renewal.autoRenew==='true'||false, competitiveExposure: renewal.competitiveExposure||'none', updatedAt: renewal.updatedAt||'' },
  };
};

const JSON_TEMPLATE = `{
  "name": "Acme Corp",
  "company": "Acme Corp",
  "industry": "Enterprise SaaS",
  "logo": "AC",
  "arr": 500000,
  "contractEnd": "2026-12-31",
  "tenureMonths": 18,
  "usage": { "utilization": 72, "change30d": -5, "trend": "down" },
  "support": { "tickets30d": 8, "severity": "medium", "sentiment": "neutral", "csat": 3.9 },
  "engagement": { "lastQbr": "2026-02-01", "execSponsorStatus": "active", "lastTouchDays": 14, "qbrAttendance": "consistent" },
  "expansion": { "historyArr": 50000, "historyNote": "+$50K seat add 2025", "signals": "None active" },
  "relationship": { "championStable": true, "recentChanges": "Stable — same VP for 12 months" },
  "external": "Steady growth. No major news.",
  "renewal": { "probability": "medium", "contractType": "annual", "autoRenew": false, "competitiveExposure": "none", "updatedAt": "2026-04-29" }
}`;

const AccountFormModal = ({initial,title,submitLabel,onSubmit,onClose,onDelete=null}) => {
  const [form,setForm] = useState(initial?toForm(initial):BLANK);
  const [jsonMode,setJsonMode] = useState(false);
  const [jsonInput,setJsonInput] = useState('');
  const [jsonError,setJsonError] = useState('');
  const set = (path,value) => setForm(prev=>{const p=path.split('.');if(p.length===1)return{...prev,[path]:value};return{...prev,[p[0]]:{...prev[p[0]],[p[1]]:value}};});
  const handleParse = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const merged = {
        name: parsed.name || '',
        company: parsed.company || parsed.name || '',
        industry: parsed.industry || '',
        logo: parsed.logo || '',
        arr: String(parsed.arr ?? ''),
        contractEnd: parsed.contractEnd || '',
        tenureMonths: String(parsed.tenureMonths ?? ''),
        usage: { utilization: String(parsed.usage?.utilization ?? ''), change30d: String(parsed.usage?.change30d ?? ''), trend: parsed.usage?.trend || 'flat' },
        support: { tickets30d: String(parsed.support?.tickets30d ?? ''), severity: parsed.support?.severity || 'medium', sentiment: parsed.support?.sentiment || '', csat: String(parsed.support?.csat ?? '') },
        engagement: { lastQbr: parsed.engagement?.lastQbr || '', execSponsorStatus: parsed.engagement?.execSponsorStatus || '', lastTouchDays: String(parsed.engagement?.lastTouchDays ?? ''), qbrAttendance: parsed.engagement?.qbrAttendance || '' },
        expansion: { historyArr: String(parsed.expansion?.historyArr ?? ''), historyNote: parsed.expansion?.historyNote || '', signals: parsed.expansion?.signals || '' },
        relationship: { championStable: parsed.relationship?.championStable === true || parsed.relationship?.championStable === 'true', recentChanges: parsed.relationship?.recentChanges || '' },
        external: parsed.external || '',
        renewal: { probability: parsed.renewal?.probability || 'medium', contractType: parsed.renewal?.contractType || 'annual', autoRenew: parsed.renewal?.autoRenew === true, competitiveExposure: parsed.renewal?.competitiveExposure || 'none', updatedAt: parsed.renewal?.updatedAt || '' },
      };
      setForm(merged);
      setJsonError('');
      setJsonMode(false);
    } catch(e) {
      setJsonError('Invalid JSON — check formatting and try again: ' + e.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-lg text-zinc-100" style={{fontFamily:'Instrument Serif, serif'}}>{title}</h2>
          <div className="flex items-center gap-3">
            {!initial&&<button onClick={()=>setJsonMode(!jsonMode)} className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-colors">{jsonMode?'Manual Entry':'Paste JSON'}</button>}
            <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300"><X className="w-4 h-4"/></button>
          </div>
        </div>
        <div className="p-6 space-y-5">
          {jsonMode&&!initial?(
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">Paste account data as JSON.</p>
              <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded"><p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Template</p><pre className="text-[11px] text-zinc-400 overflow-x-auto whitespace-pre-wrap">{JSON_TEMPLATE}</pre></div>
              <textarea value={jsonInput} onChange={e=>setJsonInput(e.target.value)} placeholder="Paste your JSON here..." rows={10} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50 font-mono"/>
              {jsonError&&<p className="text-xs text-rose-400">{jsonError}</p>}
              <button onClick={handleParse} className="px-4 py-2 bg-zinc-800 text-zinc-300 text-sm rounded hover:bg-zinc-700">Parse → Switch to Form</button>
            </div>
          ):(
            <>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Account Name *"><Input value={form.name} onChange={e=>set('name',e.target.value)} placeholder="Netflix"/></Field>
                <Field label="Company (for news search)"><Input value={form.company} onChange={e=>set('company',e.target.value)} placeholder="Netflix"/></Field>
                <Field label="Industry"><Input value={form.industry} onChange={e=>set('industry',e.target.value)} placeholder="Streaming / Media"/></Field>
                <Field label="ARR ($)"><Input type="number" value={form.arr} onChange={e=>set('arr',e.target.value)} placeholder="500000"/></Field>
                <Field label="Contract End"><Input type="date" value={form.contractEnd} onChange={e=>set('contractEnd',e.target.value)}/></Field>
                <Field label="Tenure (months)"><Input type="number" value={form.tenureMonths} onChange={e=>set('tenureMonths',e.target.value)} placeholder="18"/></Field>
                <Field label="Logo (2 chars)"><Input value={form.logo} onChange={e=>set('logo',e.target.value)} placeholder="NF"/></Field>
              </div>
              <div><p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Usage</p><div className="grid grid-cols-3 gap-4"><Field label="Utilization %"><Input type="number" value={form.usage.utilization} onChange={e=>set('usage.utilization',e.target.value)} placeholder="72"/></Field><Field label="30d Change %"><Input type="number" value={form.usage.change30d} onChange={e=>set('usage.change30d',e.target.value)} placeholder="-5"/></Field><Field label="Trend"><Sel value={form.usage.trend} onChange={e=>set('usage.trend',e.target.value)}><option value="up">Up</option><option value="flat">Flat</option><option value="down">Down</option></Sel></Field></div></div>
              <div><p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Support</p><div className="grid grid-cols-2 gap-4"><Field label="Tickets (30d)"><Input type="number" value={form.support.tickets30d} onChange={e=>set('support.tickets30d',e.target.value)} placeholder="8"/></Field><Field label="Severity"><Sel value={form.support.severity} onChange={e=>set('support.severity',e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Sel></Field><Field label="Sentiment"><Input value={form.support.sentiment} onChange={e=>set('support.sentiment',e.target.value)} placeholder="neutral"/></Field><Field label="CSAT (0–5)"><Input type="number" value={form.support.csat} onChange={e=>set('support.csat',e.target.value)} placeholder="3.9"/></Field></div></div>
              <div><p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Engagement</p><div className="grid grid-cols-2 gap-4"><Field label="Last QBR"><Input type="date" value={form.engagement.lastQbr} onChange={e=>set('engagement.lastQbr',e.target.value)}/></Field><Field label="Days Since Last Touch"><Input type="number" value={form.engagement.lastTouchDays} onChange={e=>set('engagement.lastTouchDays',e.target.value)} placeholder="14"/></Field><Field label="Exec Sponsor Status"><Input value={form.engagement.execSponsorStatus} onChange={e=>set('engagement.execSponsorStatus',e.target.value)} placeholder="active"/></Field><Field label="QBR Attendance"><Input value={form.engagement.qbrAttendance} onChange={e=>set('engagement.qbrAttendance',e.target.value)} placeholder="consistent"/></Field></div></div>
              <div><p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Expansion</p><div className="grid grid-cols-2 gap-4"><Field label="Expansion ARR ($)"><Input type="number" value={form.expansion.historyArr} onChange={e=>set('expansion.historyArr',e.target.value)} placeholder="50000"/></Field><Field label="Expansion Note"><Input value={form.expansion.historyNote} onChange={e=>set('expansion.historyNote',e.target.value)} placeholder="+$50K seat add 2025"/></Field><Field label="Signals"><Input value={form.expansion.signals} onChange={e=>set('expansion.signals',e.target.value)} placeholder="None active"/></Field></div></div>
              <div><p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Relationship</p><div className="grid grid-cols-2 gap-4"><Field label="Champion Stable?"><Sel value={String(form.relationship.championStable)} onChange={e=>set('relationship.championStable',e.target.value==='true')}><option value="true">Stable</option><option value="false">Disrupted</option></Sel></Field><Field label="Recent Changes"><Input value={form.relationship.recentChanges} onChange={e=>set('relationship.recentChanges',e.target.value)} placeholder="Stable — same VP for 12 months"/></Field></div></div>
              <div><p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">External Signal</p><Field label="Current context (will be enriched by live news)"><textarea value={form.external} onChange={e=>set('external',e.target.value)} rows={3} className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50" placeholder="Recent funding, layoffs, earnings, M&A..."/></Field></div>
              <div><p className="text-[10px] uppercase tracking-widest text-amber-400/70 mb-3">Renewal Outlook</p><div className="grid grid-cols-2 gap-4">
                <Field label="Renewal Probability"><Sel value={form.renewal?.probability||'medium'} onChange={e=>set('renewal.probability',e.target.value)}><option value="high">High Confidence</option><option value="medium">Needs Attention</option><option value="at-risk">At Risk</option></Sel></Field>
                <Field label="Contract Type"><Sel value={form.renewal?.contractType||'annual'} onChange={e=>set('renewal.contractType',e.target.value)}><option value="annual">Annual</option><option value="multi-year">Multi-year</option></Sel></Field>
                <Field label="Auto-Renew?"><Sel value={String(form.renewal?.autoRenew||false)} onChange={e=>set('renewal.autoRenew',e.target.value==='true')}><option value="true">Yes</option><option value="false">No — Manual</option></Sel></Field>
                <Field label="Competitive Exposure"><Sel value={form.renewal?.competitiveExposure||'none'} onChange={e=>set('renewal.competitiveExposure',e.target.value)}><option value="none">None detected</option><option value="rumored">Rumored</option><option value="active-eval">Active eval</option></Sel></Field>
              </div></div>
            </>
          )}
        </div>
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
          <div>
            {onDelete && (
              <button onClick={onDelete}
                className="px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors">
                Delete Account
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300">Cancel</button>
            <button onClick={()=>onSubmit(fromForm(form))} className="px-5 py-2 bg-amber-400 text-zinc-950 text-sm font-medium rounded hover:bg-amber-300">{submitLabel}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Password modal ──────────────────────────────────────────────
const PasswordModal = ({onSuccess,onClose}) => {
  const [pw,setPw]=useState(''),[ err,setErr]=useState(false);
  const attempt=()=>{if(pw==='Milo'){onSuccess();onClose();}else{setErr(true);setPw('');}};
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg w-full max-w-xs p-6">
        <div className="flex items-center gap-2 mb-5"><Lock className="w-4 h-4 text-amber-400"/><h2 className="text-base text-zinc-100" style={{fontFamily:'Instrument Serif, serif'}}>Edit Mode</h2></div>
        <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr(false);}} onKeyDown={e=>e.key==='Enter'&&attempt()} placeholder="Password" className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400/50 mb-2"/>
        {err&&<p className="text-xs text-rose-400 mb-3">Incorrect password.</p>}
        <div className="flex gap-2 mt-3"><button onClick={onClose} className="flex-1 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200">Cancel</button><button onClick={attempt} className="flex-1 px-3 py-2 bg-amber-400 text-zinc-950 text-sm font-medium rounded hover:bg-amber-300">Unlock</button></div>
      </div>
    </div>
  );
};

// ── Sidebar row ─────────────────────────────────────────────────
const QuickHealth = ({account,isSelected,onClick}) => {
  const cat=getCategory(account),sub=getSubPriority(account,cat),meta=CAT_META[cat];
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-3 border-l-2 transition-all duration-200 ${isSelected?'border-amber-400 bg-zinc-900/80':'border-transparent hover:bg-zinc-900/40 hover:border-zinc-700'}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium flex-shrink-0 ${isSelected?'bg-amber-400/10 text-amber-400 border border-amber-400/30':'bg-zinc-800 text-zinc-400'}`} style={{fontFamily:'JetBrains Mono, monospace'}}>{account.logo||account.name.slice(0,2).toUpperCase()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5"><span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${meta.dotClass}`}></span><p className="text-sm text-zinc-100 truncate">{account.name}</p></div>
          <div className="flex items-center gap-1.5"><span className={`text-[9px] font-medium ${SUB_COLOR[sub][cat]}`}>{sub}</span><span className="text-zinc-700 text-[9px]">·</span><span className="text-[11px] text-zinc-400" style={{fontFamily:'JetBrains Mono, monospace'}}>{fmtC(account.arr)}</span></div>
        </div>
      </div>
    </button>
  );
};

// ── Signal card ─────────────────────────────────────────────────
const SignalCard = ({icon:Icon,label,value,sublabel,accent='zinc'}) => {
  const accents={zinc:'text-zinc-300',emerald:'text-emerald-400',amber:'text-amber-400',rose:'text-rose-400'};
  return (
    <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded">
      <div className="flex items-center gap-2 text-zinc-400 mb-2"><Icon className="w-3.5 h-3.5"/><span className="text-[10px] uppercase tracking-widest">{label}</span></div>
      <p className={`text-sm ${accents[accent]}`} style={{fontFamily:'JetBrains Mono, monospace'}}>{value}</p>
      {sublabel&&<p className="text-[11px] text-zinc-400 mt-1">{sublabel}</p>}
    </div>
  );
};

// ── Health ring ─────────────────────────────────────────────────
const HealthRing = ({score,size=120}) => {
  const r=(size-14)/2,c=2*Math.PI*r,o=c-(score/100)*c,col=score>=75?'#34d399':score>=50?'#fbbf24':'#fb7185';
  return (
    <div className="relative inline-flex items-center justify-center" style={{width:size,height:size}}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size/2} cy={size/2} r={r} stroke="#27272a" strokeWidth="6" fill="none"/>
        <circle cx={size/2} cy={size/2} r={r} stroke={col} strokeWidth="6" fill="none" strokeDasharray={c} strokeDashoffset={o} style={{transition:'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)'}} strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-light" style={{fontFamily:'JetBrains Mono, monospace',color:col}}>{score}</span>
        <span className="text-[10px] uppercase tracking-widest text-zinc-400 mt-0.5">Health</span>
      </div>
    </div>
  );
};

const CatBadge = ({cat,sub}) => (<span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${CAT_META[cat].badgeClass}`}>{CAT_META[cat].label} · {sub}</span>);

// ── API helpers ─────────────────────────────────────────────────
const callAnalyze = async (messages) => {
  const res = await fetch('/api/analyze', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({model:'claude-sonnet-4-5',max_tokens:2000,messages})
  });
  if (!res.ok) throw new Error(`API returned ${res.status}`);
  const data = await res.json();
  const text = data.content.map(c=>c.text||'').join('');
  return JSON.parse(text.replace(/```json/g,'').replace(/```/g,'').trim());
};

const callNews = async (company, industry) => {
  const res = await fetch('/api/news', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({company,industry})
  });
  if (!res.ok) throw new Error(`News API returned ${res.status}`);
  return res.json();
};

// ── Main ────────────────────────────────────────────────────────
export default function HealthScoreEngine() {
  const [accounts,setAccounts] = useState(()=>{try{const s=localStorage.getItem(STORAGE_ACCOUNTS);return s?JSON.parse(s):DEFAULT_ACCOUNTS;}catch{return DEFAULT_ACCOUNTS;}});
  const [analysisMap,setAnalysisMap] = useState(()=>{try{const s=localStorage.getItem(STORAGE_ANALYSIS);return s?JSON.parse(s):{};}catch{return {};}});
  const [newsMap,setNewsMap] = useState(()=>{try{const s=localStorage.getItem(STORAGE_NEWS);return s?JSON.parse(s):{};}catch{return {};}});

  const [selectedId,setSelectedId] = useState(accounts[0]?.id??1);
  const [loadingPhase,setLoadingPhase] = useState(null);
  const [loadingNews,setLoadingNews] = useState(false);
  const [error,setError] = useState(null);
  const [newsError,setNewsError] = useState(null);
  const [coachMode,setCoachMode] = useState(false);
  const [reasoningOpen,setReasoningOpen] = useState(false);
  const [editMode,setEditMode] = useState(false);
  const [showPasswordModal,setShowPasswordModal] = useState(false);
  const [showAddModal,setShowAddModal] = useState(false);
  const [editingAccount,setEditingAccount] = useState(null);

  useEffect(()=>{try{localStorage.setItem(STORAGE_ACCOUNTS,JSON.stringify(accounts));}catch{}},[accounts]);
  useEffect(()=>{try{localStorage.setItem(STORAGE_ANALYSIS,JSON.stringify(analysisMap));}catch{}},[analysisMap]);
  useEffect(()=>{try{localStorage.setItem(STORAGE_NEWS,JSON.stringify(newsMap));}catch{}},[newsMap]);

  useEffect(()=>{
    const link=document.createElement('link');
    link.href='https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap';
    link.rel='stylesheet';document.head.appendChild(link);
    return()=>document.head.removeChild(link);
  },[]);

  useEffect(()=>{setError(null);setNewsError(null);setReasoningOpen(false);setCoachMode(false);},[selectedId]);

  const account = accounts.find(a=>a.id===selectedId);
  const analysis = account?analysisMap[account.id]:null;
  const news = account?newsMap[account.id]:null;
  const cat = account?getCategory(account):'stable';
  const sub = account?getSubPriority(account,cat):'P3';
  const tldr = analysis?.tldr||(account?getTldrFallback(account):'');
  const totalArr = accounts.reduce((s,a)=>s+(Number(a.arr)||0),0);

  const grouped={'at-risk':{},'expansion':{},'stable':{}};
  accounts.forEach(a=>{const c=getCategory(a),p=getSubPriority(a,c);if(!grouped[c][p])grouped[c][p]=[];grouped[c][p].push(a);});

  // ── News fetch ────────────────────────────────────────────────
  const fetchNews = useCallback(async () => {
    if (!account) return;
    setLoadingNews(true);
    setNewsError(null);
    try {
      const result = await callNews(account.company||account.name, account.industry);
      setNewsMap(prev=>({...prev,[account.id]:result}));
    } catch(e) {
      setNewsError(`News fetch failed: ${e.message}`);
    } finally {
      setLoadingNews(false);
    }
  },[account]);

  // ── Two-phase analysis ────────────────────────────────────────
  const analyzeAccount = useCallback(async () => {
    if (!account) return;
    setLoadingPhase('primary');
    setError(null);

    // Include live news summary in context if available
    const newsContext = news?.summary
      ? `\nLIVE NEWS CONTEXT (fetched ${fmtDate(news.fetchedAt)}):\n${news.summary}`
      : `\nEXTERNAL CONTEXT:\n${account.external}`;

    const baseContext = `ACCOUNT DATA:\n${JSON.stringify({...account,external:undefined},null,2)}${newsContext}\n\nRENEWAL OUTLOOK:\nProbability: ${account.renewal?.probability||'unknown'} | Contract: ${account.renewal?.contractType||'unknown'} | Auto-renew: ${account.renewal?.autoRenew?'yes':'no'} | Competitive exposure: ${account.renewal?.competitiveExposure||'unknown'}`;

    const prompt1 = `You are a Senior CS strategist. Be terse — keep all string values under 20 words. Evaluate ALL signal categories: usage, support, engagement, expansion history, relationship, AND external. Do not anchor on a single dimension.

${baseContext}

Return ONLY valid JSON, no preamble, no markdown fences:

{
  "healthScore": <integer 0-100>,
  "tldr": "<1 sentence: company name + most urgent cross-signal finding + implication>",
  "scoreReasoning": "<2 sentences max, cite signals from at least 2 different categories>",
  "signalScores": {
    "productAdoption":  { "score": <0-100>, "weight": 20, "note": "<max 10 words citing utilization % or trend>" },
    "execSponsor":      { "score": <0-100>, "weight": 20, "note": "<max 10 words citing sponsor status or EBR>" },
    "engagementCadence":{ "score": <0-100>, "weight": 15, "note": "<max 10 words citing last touch or QBR cadence>" },
    "expansionHistory": { "score": <0-100>, "weight": 15, "note": "<max 10 words citing expansion ARR or signals>" },
    "champion":         { "score": <0-100>, "weight": 15, "note": "<max 10 words citing champion stability>" },
    "renewalOutlook":   { "score": <0-100>, "weight": 10, "note": "<max 10 words citing probability or competitive exposure>" },
    "external":         { "score": <0-100>, "weight": 5,  "note": "<max 10 words citing a market signal>" }
  },
  "categoryScores": {
    "atRiskScore": <integer — weighted sum of risk signals, higher = more at risk>,
    "expansionScore": <integer — weighted sum of expansion signals, higher = more opportunity>,
    "categoryRationale": "<1 sentence explaining the category assignment>"
  },
  "nextAction": {
    "headline": "<verb-first, max 14 words>",
    "rationale": "<1 sentence, cite specific data from account>",
    "owner": "CSM|Exec Sponsor|AE|CS Ops",
    "timeline": "<this week|next 2 weeks|this month>"
  },
  "immediateActions": [
    "<verb-first, max 12 words — draw from different signal categories>",
    "<verb-first, max 12 words>",
    "<verb-first, max 12 words>"
  ]
}`;

    try {
      const p1 = await callAnalyze([{role:'user',content:prompt1}]);
      p1.analyzedAt = new Date().toISOString();
      setAnalysisMap(prev=>({...prev,[account.id]:{...(prev[account.id]||{}),...p1}}));
      setLoadingPhase('secondary');

      const prompt2 = `You are a Senior CS strategist. Be terse — keep all string values under 20 words. Risk flags and expansion signals MUST draw from all available data — usage trends, support load, engagement patterns, expansion history, relationship stability, AND external signals. Do not source everything from a single category.

${baseContext}

Return ONLY valid JSON, no preamble, no markdown fences:

{
  "weightedFactors": [
    {"factor": "Usage", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<max 12 words, cite the actual utilization number or trend>"},
    {"factor": "Engagement", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<max 12 words, cite last touch days or QBR attendance>"},
    {"factor": "Commercial", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<max 12 words, cite ARR or expansion history>"},
    {"factor": "Relationship", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<max 12 words, cite champion status or recent changes>"},
    {"factor": "External", "weight": "high|medium|low", "direction": "positive|negative|neutral", "note": "<max 12 words, cite a specific market signal>"}
  ],
  "riskFlags": [
    {"severity": "high|medium|low", "title": "<5 words max>", "detail": "<max 15 words — source from usage, engagement, relationship, or commercial — not just external>"},
    {"severity": "high|medium|low", "title": "<5 words max>", "detail": "<max 15 words — different signal category than above>"}
  ],
  "expansionSignals": [
    {"strength": "strong|moderate|weak", "title": "<5 words max>", "detail": "<max 15 words, cite specific data point>"}
  ],
  "qbrTalkingPoints": ["<specific, max 20 words, reference account data>", "<specific, max 20 words, different signal category>", "<specific, max 20 words>"],
  "coachScript": "<3 sentences max, conversational, human, account-specific. Reference something concrete from usage or relationship data. Not a sales pitch.>"
}`;

      const p2 = await callAnalyze([{role:'user',content:prompt2}]);
      setAnalysisMap(prev=>({...prev,[account.id]:{...prev[account.id],...p2}}));
    } catch(e) {
      setError(`Analysis failed: ${e.message}. Try again.`);
    } finally {
      setLoadingPhase(null);
    }
  },[account,news]);

  const staleHours = analysis?.analyzedAt?hoursAgo(analysis.analyzedAt):null;
  const isStale = staleHours!==null&&staleHours>48;
  const newsStale = news?.fetchedAt?hoursAgo(news.fetchedAt)>24:false;

  const sevColor = {high:'border-rose-500/40 bg-rose-500/5 text-rose-300',medium:'border-amber-500/40 bg-amber-500/5 text-amber-300',low:'border-zinc-700 bg-zinc-900/40 text-zinc-400'};
  const strColor = {strong:'border-emerald-500/40 bg-emerald-500/5 text-emerald-300',moderate:'border-emerald-500/20 bg-zinc-900/40 text-emerald-400/80',weak:'border-zinc-700 bg-zinc-900/40 text-zinc-400'};
  const phase1Ready = analysis?.healthScore!==undefined;
  const phase2Ready = analysis?.weightedFactors!==undefined;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100" style={{fontFamily:'IBM Plex Sans, system-ui, sans-serif'}}>

      {showPasswordModal&&<PasswordModal onSuccess={()=>setEditMode(true)} onClose={()=>setShowPasswordModal(false)}/>}
      {editMode&&showAddModal&&<AccountFormModal title="Add Account" submitLabel="Add Account" onClose={()=>setShowAddModal(false)} onSubmit={(data)=>{const a={...data,id:Date.now()};setAccounts(prev=>[...prev,a]);setSelectedId(a.id);setShowAddModal(false);}}/>}
      {editMode&&editingAccount&&<AccountFormModal
        title={`Edit — ${editingAccount.name}`}
        submitLabel="Save Changes"
        initial={editingAccount}
        onClose={()=>setEditingAccount(null)}
        onSubmit={(data)=>{setAccounts(prev=>prev.map(a=>a.id===editingAccount.id?{...data,id:editingAccount.id}:a));setEditingAccount(null);}}
        onDelete={()=>{
          if(window.confirm(`Delete ${editingAccount.name}? This cannot be undone.`)){
            setAccounts(prev=>prev.filter(a=>a.id!==editingAccount.id));
            setAnalysisMap(prev=>{const n={...prev};delete n[editingAccount.id];return n;});
            setNewsMap(prev=>{const n={...prev};delete n[editingAccount.id];return n;});
            setSelectedId(accounts.find(a=>a.id!==editingAccount.id)?.id);
            setEditingAccount(null);
          }
        }}
      />}

      {/* Header */}
      <header className="border-b border-zinc-900 px-8 py-5 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl text-amber-400" style={{fontFamily:'Instrument Serif, serif',letterSpacing:'-0.01em'}}>Helix<span className="italic text-zinc-500">.cs</span></h1>
          <span className="text-[11px] uppercase tracking-widest text-zinc-400">Enterprise Health Engine</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span className="text-zinc-400">Built by Westin Eehn</span>
          <a href="https://linkedin.com/in/westineehn" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"><Linkedin className="w-3.5 h-3.5"/> LinkedIn</a>
          <a href="https://github.com/westineehn/helix-cx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"><Github className="w-3.5 h-3.5"/> Source</a>
        </div>
      </header>

      <div className="grid grid-cols-12 min-h-[calc(100vh-65px)]">

        {/* Sidebar */}
        <aside className="col-span-3 border-r border-zinc-900 flex flex-col">
          <div className="px-4 py-4 border-b border-zinc-900 flex items-center justify-between">
            <div><p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Portfolio</p><p className="text-sm text-zinc-200" style={{fontFamily:'JetBrains Mono, monospace'}}>{accounts.length} accounts · {fmtTotal(totalArr)} ARR</p></div>
            {editMode&&<button onClick={()=>setShowAddModal(true)} className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 rounded text-[11px] transition-colors"><Plus className="w-3 h-3"/> Add</button>}
          </div>
          <div className="overflow-y-auto flex-1 py-1">
            {['at-risk','expansion','stable'].map(c=>{
              const all=Object.values(grouped[c]).flat();
              if(!all.length) return null;
              return (<div key={c}>
                <div className="px-4 py-2 flex items-center gap-2 border-b border-zinc-900/60"><span className={`text-[10px] uppercase tracking-widest font-medium ${CAT_META[c].headerClass}`}>{CAT_META[c].label}</span><span className="text-[10px] text-zinc-400">{all.length}</span></div>
                {['P1','P2','P3'].map(p=>grouped[c][p]?.map(a=>(<QuickHealth key={a.id} account={a} isSelected={a.id===selectedId} onClick={()=>setSelectedId(a.id)}/>)))}
              </div>);
            })}
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-9 px-10 py-8 overflow-y-auto">
          {account&&(<>

            {/* Account header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 mr-6">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-[11px] uppercase tracking-widest text-zinc-400">{account.industry}</p>
                  <CatBadge cat={cat} sub={sub}/>
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl text-zinc-100" style={{fontFamily:'Instrument Serif, serif',letterSpacing:'-0.02em',fontWeight:700}}>{account.name}</h2>
                  {editMode&&<button onClick={()=>setEditingAccount(account)} className="text-zinc-600 hover:text-amber-400 transition-colors mt-1"><Pencil className="w-3.5 h-3.5"/></button>}
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-400 mt-2 mb-3" style={{fontFamily:'JetBrains Mono, monospace'}}>
                  <span>{fmtC(Number(account.arr))} ARR</span><span className="text-zinc-700">·</span>
                  <span>Renews {account.contractEnd}</span><span className="text-zinc-700">·</span>
                  <span>{account.tenureMonths}mo tenure</span>
                </div>
                {/* Renewal Outlook block */}
                {(() => {
                  const r = account.renewal || {};
                  const prob = r.probability || 'medium';
                  const probColors = { high:'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', medium:'text-amber-400 bg-amber-500/10 border-amber-500/30', 'at-risk':'text-rose-400 bg-rose-500/10 border-rose-500/30' };
                  const probLabels = { high:'High Confidence', medium:'Needs Attention', 'at-risk':'At Risk' };
                  const expColors = { none:'text-zinc-300', rumored:'text-amber-400', 'active-eval':'text-rose-400' };
                  const expLabels = { none:'None detected', rumored:'Rumored', 'active-eval':'Active eval' };
                  const RField = ({label, value, valueClass='text-zinc-200'}) => (
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
                      <p className={`text-sm font-medium ${valueClass}`}>{value}</p>
                    </div>
                  );
                  return (
                    <div className="border border-zinc-800 rounded p-4 mb-4 bg-zinc-900/20">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] uppercase tracking-widest text-zinc-400">Renewal Outlook</span>
                        {r.updatedAt && <span className="text-[10px] text-zinc-400" style={{fontFamily:'JetBrains Mono, monospace'}}>Updated {r.updatedAt}</span>}
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">Probability</p>
                          <span className={`text-[11px] uppercase tracking-widest px-2 py-1 rounded border font-medium ${probColors[prob]||probColors.medium}`}>
                            {probLabels[prob]||prob}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1.5">Competitive Exposure</p>
                          <span className={`text-sm font-medium ${expColors[r.competitiveExposure]||'text-zinc-300'}`}>
                            {expLabels[r.competitiveExposure]||'Unknown'}
                          </span>
                        </div>
                        <RField label="Contract Type" value={r.contractType ? r.contractType.charAt(0).toUpperCase() + r.contractType.slice(1) : '—'} />
                        <RField
                          label="Auto-Renew"
                          value={r.autoRenew === undefined ? '—' : r.autoRenew ? 'Yes' : 'No — Manual'}
                          valueClass={r.autoRenew ? 'text-emerald-400' : 'text-amber-400'}
                        />
                      </div>
                    </div>
                  );
                })()}
                <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-zinc-700 pl-3 mb-3">{tldr}</p>
                {isStale&&<div className="flex items-center gap-2 text-xs text-amber-400/70 mb-3"><AlertCircle className="w-3.5 h-3.5"/><span>Analysis is {staleHours}h old — consider re-running.</span></div>}
                {analysis?.immediateActions&&(
                  <div className="border border-zinc-800/60 rounded p-3 bg-zinc-900/20">
                    <div className="flex items-center gap-2 mb-2"><Clock className="w-3 h-3 text-zinc-400"/><span className="text-[10px] uppercase tracking-widest text-zinc-400">Action Items · {fmtDate(analysis.analyzedAt)}</span></div>
                    <ul className="space-y-1">{analysis.immediateActions.map((item,i)=>(<li key={i} className="flex gap-2 text-xs text-zinc-400"><span className="text-amber-400/50 mt-0.5 flex-shrink-0">→</span><span className="text-zinc-300">{item}</span></li>))}</ul>
                  </div>
                )}
              </div>
              <button onClick={analyzeAccount} disabled={!!loadingPhase} className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-zinc-950 text-sm font-medium rounded hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {loadingPhase==='primary'?<><Loader2 className="w-4 h-4 animate-spin"/>Scoring…</>:loadingPhase==='secondary'?<><Loader2 className="w-4 h-4 animate-spin"/>Analyzing…</>:<><Sparkles className="w-4 h-4"/>Analyze with AI</>}
              </button>
            </div>

            {/* Signal cards — 6 cards, no Support */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              <SignalCard icon={Activity} label="Product Adoption"
                value={`${account.usage.utilization}% utilized`}
                sublabel={`${account.usage.change30d>0?'+':''}${account.usage.change30d}% last 30d · ${account.usage.trend}`}
                accent={account.usage.utilization>=75?'emerald':account.usage.utilization>=50?'amber':'rose'}/>
              <SignalCard icon={Target} label="Exec Sponsor"
                value={account.engagement.execSponsorStatus}
                sublabel={`Last QBR: ${account.engagement.lastQbr||'—'} · ${account.engagement.qbrAttendance}`}
                accent={account.engagement.execSponsorStatus==='highly active'||account.engagement.execSponsorStatus==='active'?'emerald':account.engagement.execSponsorStatus==='transitioning'?'amber':'rose'}/>
              <SignalCard icon={Calendar} label="Engagement Cadence"
                value={`${account.engagement.lastTouchDays}d since last touch`}
                sublabel={`QBR attendance: ${account.engagement.qbrAttendance}`}
                accent={account.engagement.lastTouchDays<14?'emerald':account.engagement.lastTouchDays<30?'amber':'rose'}/>
              <SignalCard icon={DollarSign} label="Expansion History"
                value={account.expansion.historyArr>0?`+${fmtC(account.expansion.historyArr)}`:'None'}
                sublabel={account.expansion.historyNote}
                accent={account.expansion.historyArr>0?'emerald':'zinc'}/>
              <SignalCard icon={Users} label="Champion"
                value={account.relationship.championStable?'Stable':'Disrupted'}
                sublabel={account.relationship.recentChanges}
                accent={account.relationship.championStable?'emerald':'rose'}/>

              {/* Live External Signal card */}
              <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Zap className="w-3.5 h-3.5"/>
                    <span className="text-[10px] uppercase tracking-widest">External Signal</span>
                  </div>
                  <button onClick={fetchNews} disabled={loadingNews} className="flex items-center gap-1 text-[10px] text-zinc-600 hover:text-amber-400 transition-colors disabled:opacity-40">
                    {loadingNews?<Loader2 className="w-3 h-3 animate-spin"/>:<RefreshCw className="w-3 h-3"/>}
                    {news?fmtAge(news.fetchedAt):'fetch'}
                  </button>
                </div>

                {!news&&!loadingNews&&(
                  <div>
                    <p className="text-[11px] text-zinc-400 mb-2">{account.external}</p>
                    <button onClick={fetchNews} className="text-[10px] text-amber-400/60 hover:text-amber-400 transition-colors">↻ Fetch live news</button>
                  </div>
                )}

                {loadingNews&&<div className="flex items-center gap-2 text-xs text-zinc-400"><Loader2 className="w-3 h-3 animate-spin"/>Fetching live news…</div>}

                {news&&!loadingNews&&(<>
                  {newsStale&&<p className="text-[10px] text-amber-400/60 mb-1.5">⚠ Fetched {hoursAgo(news.fetchedAt)}h ago</p>}
                  <p className="text-[11px] text-zinc-300 leading-relaxed mb-2">{news.summary}</p>
                  <div className="space-y-1">
                    {news.articles.map((a,i)=>(
                      <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-1.5 text-[10px] text-zinc-500 hover:text-amber-400 transition-colors group">
                        <ExternalLink className="w-2.5 h-2.5 mt-0.5 flex-shrink-0 group-hover:text-amber-400"/>
                        <span className="truncate text-zinc-400">{a.source} · {a.title}</span>
                      </a>
                    ))}
                  </div>
                </>)}

                {newsError&&<p className="text-[10px] text-rose-400 mt-1">{newsError}</p>}
              </div>
            </div>

            {error&&<div className="p-4 border border-rose-500/30 bg-rose-500/5 rounded text-sm text-rose-300 mb-6">{error}</div>}

            {!analysis&&!loadingPhase&&!error&&(
              <div className="border border-dashed border-zinc-800 rounded p-10 text-center">
                <Sparkles className="w-6 h-6 text-zinc-700 mx-auto mb-3"/>
                <p className="text-sm text-zinc-400">Click <span className="text-amber-400">Analyze with AI</span> to generate health score, risk flags, and prescriptive next actions.</p>
                {!news&&<p className="text-xs text-zinc-400 mt-2">Tip: fetch live news first for a more accurate analysis.</p>}
              </div>
            )}

            {(phase1Ready||loadingPhase==='primary')&&(
              <div className="space-y-6">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-4 border border-zinc-800 rounded p-6 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900/40 to-transparent">
                    {loadingPhase==='primary'?<div className="flex flex-col items-center gap-3"><Loader2 className="w-8 h-8 animate-spin text-zinc-700"/><p className="text-xs text-zinc-400">Scoring…</p></div>:<>
                      <HealthRing score={analysis.healthScore}/>
                      <button onClick={()=>setReasoningOpen(!reasoningOpen)} className="mt-4 text-[11px] uppercase tracking-widest text-zinc-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
                        {reasoningOpen?<ChevronDown className="w-3 h-3"/>:<ChevronRight className="w-3 h-3"/>} Score Breakdown
                      </button>
                    </>}
                  </div>
                  {phase1Ready&&analysis?.nextAction&&(
                    <div className="col-span-8 border border-amber-400/30 rounded p-6 bg-amber-400/5">
                      <div className="flex items-center gap-2 mb-3"><Target className="w-4 h-4 text-amber-400"/><span className="text-[11px] uppercase tracking-widest text-amber-400">Next Best Action</span><span className="ml-auto text-[10px] uppercase tracking-widest text-zinc-400" style={{fontFamily:'JetBrains Mono, monospace'}}>{analysis.nextAction.owner} · {analysis.nextAction.timeline}</span></div>
                      <h3 className="text-xl text-zinc-100 mb-3" style={{fontFamily:'Instrument Serif, serif'}}>{analysis.nextAction.headline}</h3>
                      <p className="text-sm text-zinc-300 leading-relaxed">{analysis.nextAction.rationale}</p>
                    </div>
                  )}
                </div>

                {reasoningOpen&&phase1Ready&&analysis.signalScores&&(
                  <div className="border border-zinc-800 rounded overflow-hidden bg-zinc-900/20">
                    {/* Score reasoning — clearly labeled */}
                    <div className="px-6 py-5 border-b border-zinc-800 bg-zinc-900/30">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Score Reasoning</p>
                      <p className="text-sm text-zinc-200 leading-relaxed">{analysis.scoreReasoning}</p>
                    </div>

                    {/* Signal breakdown table */}
                    <div className="px-6 py-4 border-b border-zinc-800">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-4">Signal Breakdown</p>
                      <div className="space-y-4">
                        {Object.entries(analysis.signalScores).map(([key, s]) => {
                          const contribution = ((s.score * s.weight) / 100).toFixed(1);
                          const barColor = s.score >= 75 ? 'bg-emerald-400' : s.score >= 50 ? 'bg-amber-400' : 'bg-rose-400';
                          const labelMap = {
                            productAdoption: 'Product Adoption',
                            execSponsor: 'Exec Sponsor',
                            engagementCadence: 'Engagement',
                            expansionHistory: 'Expansion',
                            champion: 'Champion',
                            renewalOutlook: 'Renewal',
                            external: 'External',
                            usage: 'Usage',
                            engagement: 'Engagement',
                            commercial: 'Commercial',
                            relationship: 'Relationship',
                          };
                          const label = labelMap[key] || key;
                          return (
                            <div key={key}>
                              <div className="flex items-start justify-between mb-1.5 gap-4">
                                <div className="flex items-start gap-3 min-w-0">
                                  <span className="text-[11px] uppercase tracking-widest text-zinc-400 flex-shrink-0 w-28">{label}</span>
                                  <span className="text-xs text-zinc-300 leading-relaxed">{s.note}</span>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0" style={{fontFamily:'JetBrains Mono, monospace'}}>
                                  <span className="text-[11px] text-zinc-400">{s.weight}%</span>
                                  <span className={`text-sm font-medium w-8 text-right ${s.score>=75?'text-emerald-400':s.score>=50?'text-amber-400':'text-rose-400'}`}>{s.score}</span>
                                  <span className="text-[11px] text-zinc-400 w-10 text-right">+{contribution}</span>
                                </div>
                              </div>
                              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{width:`${s.score}%`}}/>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-800">
                        <span className="text-[11px] uppercase tracking-widest text-zinc-400">Weighted Total</span>
                        <span className="text-lg font-light text-amber-400" style={{fontFamily:'JetBrains Mono, monospace'}}>
                          {Object.values(analysis.signalScores).reduce((sum,s)=>sum+((s.score*s.weight)/100),0).toFixed(1)} → {analysis.healthScore}
                        </span>
                      </div>
                    </div>

                    {/* Category assignment — readable explanation */}
                    <div className="px-6 py-4 bg-zinc-900/10">
                      <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-3">Category Assignment</p>
                      <div className="flex items-start gap-3">
                        <span className={`text-[9px] uppercase tracking-widest px-1.5 py-1 rounded border flex-shrink-0 ${CAT_META[cat].badgeClass}`}>{CAT_META[cat].label} · {sub}</span>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {analysis.categoryScores?.categoryRationale || (() => {
                            if (cat === 'at-risk') return 'Risk signals across multiple dimensions outweigh positive factors — account flagged for immediate attention.';
                            if (cat === 'expansion') return 'Strong utilization, expansion history, and active signals indicate growth opportunity this quarter.';
                            return 'Account is tracking within healthy parameters across all signal categories.';
                          })()}
                        </p>
                      </div>
                      <div className="mt-3 pt-3 border-t border-zinc-900 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Health Score</p>
                          <p className="text-xs text-zinc-400">Weighted average of all 7 signal scores (0–100 each), multiplied by their respective weights</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Category</p>
                          <p className="text-xs text-zinc-400">Determined separately from health score — evaluates risk and expansion signal patterns across all account dimensions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {loadingPhase==='secondary'&&<div className="border border-dashed border-zinc-800 rounded p-6 flex items-center gap-3"><Loader2 className="w-4 h-4 animate-spin text-zinc-600"/><p className="text-sm text-zinc-400">Loading risk flags, expansion signals, and QBR points…</p></div>}

                {phase2Ready&&(<>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-3.5 h-3.5 text-rose-400"/><span className="text-[11px] uppercase tracking-widest text-zinc-400">Risk Flags</span></div>
                      <div className="space-y-2">{!analysis.riskFlags?.length?<div className="text-xs text-zinc-600 p-3 border border-dashed border-zinc-800 rounded">No active risks detected.</div>:analysis.riskFlags.map((r,i)=>(<div key={i} className={`p-3 border rounded ${sevColor[r.severity]}`}><div className="flex items-center gap-2 mb-1"><span className="text-[9px] uppercase tracking-widest opacity-70">{r.severity}</span><span className="text-sm font-medium">{r.title}</span></div><p className="text-xs opacity-80 leading-relaxed">{r.detail}</p></div>))}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><TrendingUp className="w-3.5 h-3.5 text-emerald-400"/><span className="text-[11px] uppercase tracking-widest text-zinc-400">Expansion Signals</span></div>
                      <div className="space-y-2">{!analysis.expansionSignals?.length?<div className="text-xs text-zinc-600 p-3 border border-dashed border-zinc-800 rounded">No expansion signals identified.</div>:analysis.expansionSignals.map((s,i)=>(<div key={i} className={`p-3 border rounded ${strColor[s.strength]}`}><div className="flex items-center gap-2 mb-1"><span className="text-[9px] uppercase tracking-widest opacity-70">{s.strength}</span><span className="text-sm font-medium">{s.title}</span></div><p className="text-xs opacity-80 leading-relaxed">{s.detail}</p></div>))}</div>
                    </div>
                  </div>

                  <div className="border border-zinc-800 rounded overflow-hidden">
                    <div className="flex border-b border-zinc-800">
                      <button onClick={()=>setCoachMode(false)} className={`px-5 py-3 text-[11px] uppercase tracking-widest transition-colors ${!coachMode?'bg-zinc-900 text-amber-400':'text-zinc-500 hover:text-zinc-300'}`}>QBR Talking Points</button>
                      <button onClick={()=>setCoachMode(true)} className={`px-5 py-3 text-[11px] uppercase tracking-widest transition-colors ${coachMode?'bg-zinc-900 text-amber-400':'text-zinc-500 hover:text-zinc-300'}`}>Coach Mode · What to Say</button>
                    </div>
                    <div className="p-6">
                      {!coachMode?(
                        <ol className="space-y-3">{analysis.qbrTalkingPoints?.map((p,i)=>(<li key={i} className="flex gap-4 text-sm text-zinc-300"><span className="text-amber-400/80" style={{fontFamily:'JetBrains Mono, monospace'}}>0{i+1}</span><span className="leading-relaxed">{p}</span></li>))}</ol>
                      ):(
                        <blockquote className="text-base text-zinc-300 leading-relaxed italic border-l-2 border-amber-400/40 pl-5" style={{fontFamily:'Instrument Serif, serif'}}>"{analysis.coachScript}"</blockquote>
                      )}
                    </div>
                  </div>
                </>)}
              </div>
            )}
          </>)}

          <footer className="mt-12 pt-6 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="text-zinc-400">Powered by Claude · Live news via Serper · {new Date().getFullYear()}</span>
            <button onClick={()=>editMode?setEditMode(false):setShowPasswordModal(true)} className={`transition-colors hover:text-zinc-400 ${editMode?'text-amber-400/60':'text-zinc-700'}`} style={{fontFamily:'JetBrains Mono, monospace'}} title={editMode?'Exit edit mode':'Edit mode'}>
              {editMode?'v0.6 · edit on':'v0.6'}
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
