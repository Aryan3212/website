---
pubDate: '2097-06-15T00:00:00.000Z'
title: SEO Content Builder - Growing Search Traffic 3.5X
description: >-
  Building an in-house drag-and-drop page builder that helped scale organic search traffic from 33k to 116k monthly visits.
heroImage: './gozayaan-seo.png'
category: 'Portfolio'
tags: ['portfolio']
---

**My Role:** Software Engineer 2, Frontend

**Tech Stack:** `Vue.js` `Nuxt.js` `JSON-LD/Structured Data`

---

## The Problem

GoZayaan's marketing team needed to publish SEO-optimized landing pages for travel destinations, deals, and guides. Every page required engineering involvement - creating bottlenecks and slowing down content production.

The team was stuck at ~33k monthly organic visitors, and scaling content meant scaling engineering time.

---

## The Solution

We built an in-house drag-and-drop content builder with SEO optimization baked in. The design principle was simplicity - the marketing team needed to push content without asking engineering for help.

**Key features:**

- Reusable component library (hero sections, cards, CTAs, tables)
- Auto-generated JSON-LD structured data for each component type
- Image library selection component for asset management
- Page duplication flow for faster content creation

---

## Impact

- **Organic traffic: 33k → 116k/month (3.5X increase)**
- 57 SEO-optimized content pages published by H2 2025
- Marketing team gained full independence for content publishing

---

## Technical Challenges

### Editable Tables

The toughest challenge was creating tables that could be edited inline while maintaining data integrity.

The solution involved a normalized state structure where cells were indexed by position, with reactive watchers handling the UI updates.

### Image Library Component

Built the image library selection component from scratch. It needed to integrate with our existing asset CDN while providing a smooth UX for non-technical users.

### Structured Data Generation

Each component type had its own JSON-LD schema requirements. I created a mapping system where adding a component automatically injected the appropriate structured data into the page head.

For example, FAQ components generated `FAQPage` schema, product cards generated `Product` schema, and so on. This automated what would otherwise be manual SEO work for each page.

---

## Key Takeaways

**Building tools for non-technical teams multiplies your impact.** The 57 pages weren't built by me - they were built by the marketing team using the tool I built. That's leverage.

**SEO is a long game.** The traffic growth happened over months, not days. Proper foundations compound.

**Simplicity is a feature.** The marketing team's adoption was high because the tool was simple. Complex features that don't get used don't matter.

---

[Back to Portfolio Overview](/post/portfolio/about-me)
