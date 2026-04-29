# Helix.cs — Enterprise Customer Health Engine

An AI-powered customer success tool that scores account health, surfaces churn risk, identifies expansion signals, and generates prescriptive next actions — built to demonstrate how I think about CS strategy, not just describe it.

**[Live Demo →](https://helix-cx.vercel.app)**

---

## What It Does

Select any account from a portfolio of six real enterprise companies. Hit **Analyze with AI** and the tool runs two sequential Claude calls against live account signals, producing a full health assessment in under 15 seconds.

**Call 1 — Loads fast (~3-5s):**
- 0–100 health score
- AI-written TL;DR specific to that account's situation
- Time-bound next best action with owner and timeline
- Three immediate action items
- Per-signal scores feeding the Score Breakdown

**Call 2 — Depth analysis (~3-5s after):**
- Risk flags ranked by severity
- Expansion signals ranked by strength
- QBR talking points
- Coach Mode — the exact words to open the next call with

The two-call split means the score and priority actions appear immediately while deeper analysis loads behind them.

---

## Signal Architecture

Seven weighted signals feed every health score:

| Signal | Weight | What It Measures |
|---|---|---|
| **Product Adoption** | 20% | Utilization % + 30-day trend |
| **Exec Sponsor** | 20% | Sponsor status + EBR attendance + exec accessibility |
| **Engagement Cadence** | 15% | Last touch days + QBR attendance pattern |
| **Expansion History** | 15% | Prior ARR expansion + active signals |
| **Champion** | 15% | Champion stability + stakeholder changes |
| **Renewal Outlook** | 10% | CSM probability assessment + competitive exposure |
| **External** | 5% | Live market signals via Serper |

Support metrics (tickets, CSAT) feed the AI analysis context but don't get a dedicated card — they're lagging indicators, not leading ones.

---

## Score Breakdown

Every health score is fully transparent. Click **Score Breakdown** under the health ring to see:

- Per-signal 0–100 scores with notes, weights, and weighted contributions
- Color-coded progress bars (emerald / amber / rose)
- Weighted total showing the math from raw scores to final number
- Category assignment with Claude's written rationale explaining why the account landed where it did

---

## Renewal Outlook

Each account carries a dedicated Renewal Outlook panel showing four CSM-set fields:

- **Probability** — High Confidence / Needs Attention / At Risk
- **Competitive Exposure** — None detected / Rumored / Active eval
- **Contract Type** — Annual / Multi-year
- **Auto-Renew** — Yes / No — Manual

Renewal probability and competitive exposure feed directly into the category scoring formula — an account with "At Risk" probability and "Active eval" exposure accumulates risk points that can push it from Stable into At Risk regardless of utilization.

All four fields are also passed as context into every AI analysis call, so health scores and risk flags reflect the full commercial picture.

---

## Live News Integration

Each account has a live **External Signal** card powered by [Serper](https://serper.dev).

Hit the refresh icon and the tool:
1. Searches Google News for the company name + universal keywords (`layoffs OR earnings OR acquisition OR leadership OR restructuring OR funding OR partnership OR expansion`)
2. Pulls the top 3 articles from the last 30 days
3. Sends headlines to Claude for a 1-2 sentence synthesis focused on CS impact
4. Displays the summary with clickable source links and a freshness timestamp

The live summary automatically replaces the static external field in the next analysis run — health scores reason against what's actually happening today.

---

## Portfolio

Six real enterprise accounts spanning the full health and commercial spectrum:

| Account | Category | Key Signal |
|---|---|---|
| **Anthropic** | Expansion P1 | $30B Series G, enterprise subs 4x YTD, CTO requesting capacity scope |
| **Netflix** | Expansion P1 | Q1 revenue +16% YoY, ad tier scaling to $3B, multi-year auto-renew |
| **FedEx** | Stable P2 | Q3 earnings beat, Network 2.0 delivering $1B+ savings, strong exec relationship |
| **Allstate** | At Risk P2 | Agency consolidation, champion disrupted, manual annual renewal, rumored competitive eval |
| **Nike** | At Risk P2 | Second layoff round 2026, DTC revenue declining, Win Now restructuring pressure, at-risk probability |
| **Oracle** | At Risk P1 | 20-30K layoffs, new co-CEOs, vendor budget freeze, annual manual renewal, active competitive eval |

---

## Category Logic

Accounts are automatically categorized across three tiers based on weighted signal scoring:

**At Risk** — elevated churn signals across usage decline, support severity, engagement drop, champion instability, sponsor disengagement, or commercial risk (renewal probability + competitive exposure). Sub-prioritized P1–P3 by risk intensity weighted against ARR.

**Expansion Opp** — strong growth signals: high utilization, expansion ARR history, active signals, positive trend momentum. Sub-prioritized P1–P3 by expansion ARR and contract size.

**Stable** — tracking well across all dimensions. Sub-prioritized P1–P3 by ARR and utilization health.

Renewal probability and competitive exposure contribute directly to the At Risk score — a "medium" probability adds 1 point, "at-risk" adds 2. "Rumored" competitive exposure adds 1, "active-eval" adds 2.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| AI Analysis | Claude Sonnet (claude-sonnet-4-5) via Anthropic API |
| Live News | Serper API (Google Search) |
| Backend | Vercel Serverless Functions |
| Persistence | localStorage (accounts, analyses, news — keyed per version) |
| Security | All API keys server-side only — never exposed to browser |

---

## Architecture

```
Browser (React)
    │
    ├── /api/analyze  ← Vercel serverless → Anthropic API
    │                   Two sequential calls per analysis:
    │                   Call 1: score + TL;DR + actions + signal scores
    │                   Call 2: risk flags + expansion + QBR + coach script
    │
    └── /api/news     ← Vercel serverless
                          → Serper API (fetch headlines)
                          → Anthropic API (synthesize summary)
```

Both API keys live in Vercel environment variables. The news fetch and health analysis are decoupled — refresh news independently without triggering a full re-analysis.

---

## Demo Features

**Protected by default** — all edit capabilities are hidden from demo visitors. Account data, signal cards, and renewal fields are read-only.

**Edit Mode** — unlocked via a password prompt (click the version number in the footer). Reveals account editing, adding new accounts, and JSON paste import.

**Stale analysis warning** — analyses older than 48 hours surface an amber warning prompting a refresh.

**Persistent state** — accounts, analyses, and news data survive page refreshes via localStorage. Re-opening the tab picks up exactly where you left off.

---

## Running Locally

```bash
git clone https://github.com/westineehn/helix-cx.git
cd helix-cx
npm install
```

Create a `.env` file:
```
ANTHROPIC_API_KEY=your_key_here
SERPER_API_KEY=your_key_here
```

```bash
npm run dev
```

Get your Anthropic API key at `console.anthropic.com`.  
Get your Serper API key at `serper.dev` (free tier: 2,500 queries/month).

---

## Why I Built This

I manage enterprise portfolios with technical buyers — CTOs, VPs of Engineering — where the difference between renewing and churning often comes down to reading weak signals early and acting before the conversation gets hard.

Most health scoring tools give you a number. This one shows you the math behind it, tells you what to do about it, and tells you what to say when you pick up the phone — with live market context pulled the same day.

It's also a live example of how I use AI in my CS workflow: not to replace judgment, but to compress the time between signal and action.

---

## About

Built by **Westin Eehn** — Senior Customer Success Manager with 6+ years managing enterprise SaaS portfolios. 95% GRR on $3.5M ARR. $800K+ in documented expansion.

[LinkedIn](https://linkedin.com/in/westineehn) · [GitHub](https://github.com/westineehn/helix-cx)
