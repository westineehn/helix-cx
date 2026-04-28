# Helix.cs — Enterprise Customer Health Engine

A working AI-powered customer success tool that scores account health, surfaces churn risk, identifies expansion signals, and generates prescriptive next actions — built to demonstrate how I think about CS strategy, not just describe it.

**[Live Demo →](https://helix-cx.vercel.app)**

---

## What It Does

Select any account from a portfolio of 6 enterprise accounts. Hit **Analyze with AI** and Claude evaluates five weighted signal categories in real time:

- **Usage** — utilization rate and 30-day trend
- **Engagement** — last touch, exec sponsor status, QBR attendance
- **Commercial** — ARR, expansion history, renewal timeline
- **Relationship** — champion stability, stakeholder changes
- **External** — market signals, funding, layoffs, M&A activity

The output includes a 0–100 health score with reasoning, ranked risk flags, expansion signals, a time-bound next best action, QBR talking points, and a **Coach Mode** — the exact words a CSM could open their next call with.

Every recommendation is specific to the account data. No generic platitudes.

---

## Why I Built This

I manage enterprise portfolios with technical buyers — CTOs, VPs of Engineering — where the difference between renewing and churning often comes down to reading weak signals early and acting before the conversation gets hard.

Most health scoring tools tell you a number. This one tells you what to do about it, and why, with the data to back it up.

It's also a live example of how I use AI in my CS workflow: not to replace judgment, but to compress the time between signal and action.

---

## Tech Stack

- **React + Vite** — frontend
- **Tailwind CSS** — styling
- **Claude (claude-sonnet-4)** — analysis engine
- **Vercel Edge Functions** — secure API proxy (key never exposed to browser)

---

## Running Locally

```bash
git clone https://github.com/westineehn/helix-cx.git
cd helix-cx
npm install
```

Add a `.env` file:
```
ANTHROPIC_API_KEY=your_key_here
```

```bash
npm run dev
```

---

## About

Built by **Westin Eehn** — Senior Customer Success Manager with 6+ years managing enterprise SaaS portfolios. 95% GRR on $3.5M ARR. $800K+ in documented expansion.

[LinkedIn](https://linkedin.com/in/westineehn)
