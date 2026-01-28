---
pubDate: '2025-09-26T00:00:00.000Z'
title: Worklist Job Board
description: PostgreSQL full-text search + payment webhooks
postOrder: 7
heroImage: './wkl.png'
category: 'Portfolio'
tags: ['portfolio']
---

A job board with proper search. Built to learn PostgreSQL full-text search and payment webhook handling.

> Project is no longer running - this is a retrospective.

## TL;DR

- Implemented Postgres full-text search (ranking > naive `LIKE`).
- Made payments reliable via server-to-server webhooks (not browser redirects).

**Tech Stack:** `Django` `PostgreSQL` `SSLCommerz API`

The two interesting bits in this project were search and payments. Everything else was normal CRUD.

### Search: why not just `LIKE`?

`LIKE '%python developer%'` is the obvious approach. It's also slow and dumb - no relevance ranking, no stemming, breaks on word order.

PostgreSQL has built-in full-text search. You create a `SearchVector` on your text columns, query with `SearchQuery`, and get ranked results with stemming and stop-word handling for free:

```python
from django.contrib.postgres.search import SearchVector, SearchQuery

Job.objects.annotate(
    search=SearchVector('title', 'description')
).filter(search=SearchQuery('python developer'))
```

No Elasticsearch needed. The database handles indexing, ranking, and query parsing. I wrote a full blog post on this: [Simple and Efficient Full-Text Search using Django and Postgres](/post/fts-django/)

### Payments: why webhooks matter

Job posts required payment before going live. The naive approach: user pays → redirect back → activate post. Problem: what if the redirect fails? User paid but post never activates.

The fix: SSLCommerz webhooks. Payment processor calls your endpoint when payment succeeds, regardless of what happens on the frontend. Post activation is decoupled from the user's browser session.

```
User pays → SSLCommerz processes → Webhook fires → Post activates
                                      ↑
                         (happens server-to-server)
```

### Deployment

EC2 + RDS + Nginx + Gunicorn + SSL. Standard Django production setup on AWS.

## Links

- **GitHub:** [github.com/Aryan3212/worklist](https://github.com/Aryan3212/worklist)
- **Blog Post:** [Full-Text Search with Django + Postgres](/post/fts-django)
