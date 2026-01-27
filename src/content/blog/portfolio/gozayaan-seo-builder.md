---
pubDate: '2026-01-04T00:00:00.000Z'
title: SEO Content Builder - Growing Search Traffic 3.5X
description: >-
  Building an in-house drag-and-drop page builder that helped scale organic search traffic from 33k to 116k monthly visits.
postOrder: 4
heroImage: './gozayaan-seo.png'
category: 'Portfolio'
tags: ['portfolio']
---

**My Role:** Software Engineer 2, Frontend

**Tech Stack:** `Vue.js` `Nuxt.js` `JSON-LD/Structured Data`

## TL;DR

- Marketing needed SEO landing pages without waiting on engineers.
- I built a simple builder + component library that shipped structured data automatically.

<!-- PORTFOLIO_DEMO: Add a 30-60s Loom showing the builder (create page -> publish -> see live page). -->
<!-- PORTFOLIO_PROOF: Add a GSC/analytics chart for 33k -> 116k/month with a date range + what else changed during that period. -->

At GoZayaan, we had a classic bottleneck: marketing wanted to publish a lot of SEO pages (destinations, deals, guides), but every page required engineering time. That doesn’t scale. You either hire more engineers to do content work (bad use of engineers) or you build leverage.

So we built leverage: a drag-and-drop builder that non-technical teammates could use without breaking SEO.

### What the builder did (in practice)

- A **small set of reusable blocks** (hero, cards, CTA, tables, etc.).
- **Page duplication** so they didn’t start from scratch each time.
- An **image picker** that plugged into our CDN/assets.
- The important bit: **structured data was automatic.** The user picks a “FAQ block”, and the page gets `FAQPage` JSON-LD. Same idea for products, articles, whatever. No one had to remember schema rules.

### What was harder than it looks

- **Editable tables.** Tables are deceptively annoying: you want something that _feels_ like Notion/Sheets, but you also need a stable data model for saving/publishing. I ended up with normalized state (cells by position) and reactive watchers to keep the UI and saved state consistent.
- **Making it boring.** This is a weird goal, but it’s real: if the UI is clever, adoption drops. The tool needed to feel obvious so the marketing team actually used it.

### Result

- Organic traffic grew from ~33k/month to ~116k/month over time (3.5x).
- 57 SEO pages shipped by H2 2025.
- Marketing could publish without engineering involvement for each page.

If I rebuilt it, I’d spend even more time on guardrails: previews, validation, and “you can’t publish if this breaks SEO basics” checks. Those are the kinds of sharp edges non-engineers run into first.

[Back to Portfolio Overview](/post/portfolio/about-me)
