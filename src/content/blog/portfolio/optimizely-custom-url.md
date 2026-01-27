---
pubDate: '2026-01-04T00:00:00.000Z'
title: Custom URL Feature - Enterprise SaaS at Scale
description: >-
  Infrastructure-level feature work across CloudFront, Lambda@Edge, DynamoDB, that served 1M+ assets/day
postOrder: 3
heroImage: './custom-url.png'
category: 'Portfolio'
tags: ['portfolio']
---

**My Role:** Full Stack Software Engineer

**Tech Stack:** `AWS CloudFront` `Lambda@Edge` `DynamoDB` `Python`

## TL;DR

- Custom URLs _at the CDN edge_ (so it works for branded domains and never hits the app unless it should).
- Backwards compatible, with guardrails for collisions + reserved system paths.

<!-- PORTFOLIO_PROOF: Add a redacted diagram + rollout notes (monitoring, rollback) and a screenshot of traffic/latency/error rate. -->

Custom URLs sound like a small “routing” feature until you’re doing it behind CloudFront on multiple branded domains. At that point, this isn’t a controller change. It’s changing how requests flow through the whole system.

Here’s the mental model that ended up mattering:

```
request -> CloudFront -> Lambda@Edge (resolve) -> reverse proxy -> k8s -> S3/app
```

### What I actually owned

- **Creating URLs safely.** Users shouldn’t be able to claim system-reserved paths, and they shouldn’t be able to collide with existing URLs. I added strict validation (regex + reserved path rules) before a mapping could be created.
- **Edge resolution.** The edge function does a DynamoDB lookup and rewrites the request to the internal path. (Edge functions have their own constraints: packaging limits, regional replication, and you don’t get the same runtime assumptions as normal Lambda.)
- **Making CloudFront behave.** A lot of this work was CloudFront config: which event triggers to use, which headers/metadata to forward, and how caching interacts with lookups.
- **Debugging across layers.** When this breaks, it can break silently. I ended up bouncing between CloudFront logs, Lambda@Edge logs (in “weird” regions), and k8s pod logs to trace the request end-to-end.

### Things I learned the hard way

- **CDN behavior is nuanced.** Viewer vs origin events and header forwarding rules can make everything “look fine” while still failing at runtime.
- **Lambda@Edge logging is confusing at first.** Logs show up in the region closest to where the request was served, not where you deployed the function.
- **Docs aren’t optional for infra features.** The next person needs a breadcrumb trail, otherwise they’ll spend a day just finding the right logs.

### Outcome

- Shipped to enterprise clients without outages.
- Left behind internal documentation that made this maintainable (not just “it works on my machine”).

[Back to Portfolio Overview](/post/portfolio/about-me)
