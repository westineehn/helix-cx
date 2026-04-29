# Helix.cs — Enterprise Customer Health Engine

A working AI-powered customer success tool that scores account health, surfaces churn risk, identifies expansion signals, and generates prescriptive next actions — built to demonstrate how I think about CS strategy, not just describe it.

**[Live Demo →](https://helix-cx.vercel.app)**

---

## What It Does

Select any account from a portfolio of real enterprise companies. Hit **Analyze with AI** and the tool runs two sequential Claude calls against live account signals:

**Call 1 — Scores fast (~3-5s):**
- 0–100 health score with reasoning
- AI-written TL;DR specific to the account's current situation
- Time-bound next best action with owner and timeline
- Three immediate action items

**Call 2 — Depth analysis (~3-5s after):**
- Five weighted signal factors (Usage, Engagement, Commercial, Relationship, External)
- Ranked risk flags by severity
- Expansion signals by strength
- QBR talking points
- Coach Mode — exact words to open the next call with

The two-call split means the score and action items appear fast while the deeper analysis loads behind them.

---

## Live News Integration

Each account has a live **External Signal** card powered by [Serper](https://serper.dev) (Google Search API).

Hit the refresh icon on any account and the tool:
1. Searches for recent news using the company name + universal keywords (`layoffs OR earnings OR acquisition OR leadership OR restructuring OR funding OR partnership OR expansion`)
2. Pulls the top 3 articles from the last 30 days
3. Sends the headlines to Claude for a 1-2 sentence synthesis specific to CS impact
4. Displays the summary with clickable source links

The live news summary automatically feeds into the next AI analysis as context — so health scores and risk flags reflect what's actually happening today, not static notes.

---

## Portfolio

Six real enterprise accounts spanning the full health spectrum:

| Account | Category | Key Signal |
|---|---|---|
| **Anthropic** | Expansion P1 | $30B Series G, enterprise subs 4x YTD |
| **Netflix** | Expansion P1 | Q1 revenue +16% YoY, ad tier scaling |
| **FedEx** | Stable P2 | Q3 earnings beat, Network 2.0 delivering $1B+ savings |
| **Nike** | At Risk P2 | Second layoff round 2026, DTC revenue declining |
| **Allstate** | At Risk P2 | Agency consolidation, champion disrupted |
| **Oracle** | At Risk P1 | 20-30K layoffs, new co-CEOs, vendor budget review |

---

## Signal Categories

Every account is automatically categorized and prioritized based on weighted signal scoring across five dimensions:

**At Risk** — accounts showing churn indicators (utilization decline, support severity, engagement drop, champion instability, disengaged sponsor). Sub-prioritized P1–P3 by risk score weighted against ARR.

**Expansion Opp** — accounts showing growth signals (high utilization, expansion history, active signals, positive trend). Sub-prioritized P1–P3 by expansion ARR and contract size.

**Stable** — accounts tracking well. Sub-prioritized P1–P3 by ARR and utilization health.

---

## Key Features

**Health scoring** — Claude evaluates all five signal categories and returns a 0–100 score with specific, data-referenced reasoning. Every recommendation is framed to be defensible to a CRO.

**TL;DR** — A 1-2 sentence account summary written by Claude, not a template. References the company name, the most urgent signal, and the implication.

**Action items with timestamp** — Immediate action items from the last analysis persist below the TL;DR with the date and time the analysis was run. Stale analysis (>48 hours) surfaces a warning.

**Coach Mode** — 3-sentence script the CSM could literally open their next call with. Conversational, account-specific, not a sales pitch.

**Demo-safe** — All edit capabilities are locked by default. The portfolio data is protected from accidental modification during demos.

**localStorage persistence** — Accounts, analysis results, and news data persist across sessions in the browser. Re-opening the tab picks up exactly where you left off.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| AI Analysis | Claude Sonnet (claude-sonnet-4-5) via Anthropic API |
| Live News | Serper API (Google Search) |
| Backend | Vercel Serverless Functions |
| Security | API keys server-side only — never exposed to browser |

---

## Architecture

```
Browser (React)
    │
    ├── /api/analyze  ← Vercel serverless proxy → Anthropic API
    │                   (ANTHROPIC_API_KEY server-side)
    │
    └── /api/news     ← Vercel serverless function
                          → Serper API (fetch headlines)
                          → Anthropic API (summarize)
                          (SERPER_API_KEY + ANTHROPIC_API_KEY server-side)
```

Both API keys live in Vercel environment variables and never touch the browser.

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

Most health scoring tools tell you a number. This one tells you what to do about it, why, and what to say when you pick up the phone — with live market context pulled the same day.

It's also a live example of how I use AI in my CS workflow: not to replace judgment, but to compress the time between signal and action.

---

## About

Built by **Westin Eehn** — Senior Customer Success Manager with 6+ years managing enterprise SaaS portfolios. 95% GRR on $3.5M ARR. $800K+ in documented expansion.

[LinkedIn](https://linkedin.com/in/westineehn) · [GitHub](https://github.com/westineehn/helix-cx)
