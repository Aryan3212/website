---
pubDate: '2025-09-26T00:00:00.000Z'
title: BDJobs Scraper
description: >-
  Scraping 5000 job posts in 10 minutes
postOrder: 9
heroImage: './bdjobs-scraper.png'
category: 'Portfolio'
tags: ['portfolio']
---

A scraper for BDJobs.com that collects job market data from Bangladesh (salary, requirements, company info, etc.). It extracts 31+ fields per job.

> **Disclaimer:** This scraper is bound to be brittle and may break if any of the APIs change. For educational and research purposes only.

## TL;DR

- BDJobs moved to an Angular SPA, so HTML scraping got painful. I switched to their internal JSON APIs.
- Pulled ~5.5k job details in ~10 minutes using async batching + retries.

<!-- PORTFOLIO_PROOF: Add a small visualization from the dataset (top roles, salary distribution, etc.) + a short note on rate limiting / ToS / ethics. -->

**Tech Stack:** `Python` `asyncio` `aiohttp` `BeautifulSoup4`

### How it works

BDJobs migrated from server-rendered pages to an Angular SPA, which broke my original HTML scraper. But digging through the Network tab revealed something better: their internal REST API.

Two endpoints power the whole thing:

- **List API** — returns paginated job listings (~60 per page)
- **Details API** — returns complete job info (found buried in Angular's bundle)

No authentication, lenient rate limits, structured JSON. Much cleaner than parsing brittle CSS selectors.

### Performance

- ~110 pages of listings in ~28 seconds
- ~5,500 job details in ~8 minutes (batched, 20 concurrent)
- **Total:** ~10 minutes for the complete dataset

### The bits I cared about

**Dynamic CSV columns** — automatically detects new API fields and adds them. Future-proof.

**Batch processing** — processes jobs 20 at a time with connection pooling. Doesn't overwhelm the server, doesn't eat memory.

**Retry mechanism** — failed requests get queued and retried up to 10 times.

One note: I’m careful about not hammering sites. Concurrency is capped, and this is meant for research/learning, not abuse.

## Links

- **GitHub:** [github.com/Aryan3212/bdjobs-scraper](https://github.com/Aryan3212/bdjobs-scraper)
- **Kaggle Dataset:** [kaggle.com/datasets/aryanrahman/bdjobs-all-job-listings-20-november-5pm](https://www.kaggle.com/datasets/aryanrahman/bdjobs-all-job-listings-20-november-5pm)
