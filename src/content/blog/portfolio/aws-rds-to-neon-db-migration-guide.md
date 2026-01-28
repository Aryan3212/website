---
pubDate: '2026-01-28T00:00:00.000Z'
title: Migrating from AWS RDS to Neon (Postgres) for a Payload CMS app
description: >-
  Moved a small Payload CMS Postgres database from AWS RDS to Neon to eliminate a recurring ~$20/month bill, with ~5 minutes of downtime.
postOrder: 3
heroImage: './aws-cost-screenshot.png'
category: 'Tech'
tags: ['portfolio', 'tech', 'postgresql', 'aws', 'rds', 'neon', 'payloadcms']
---

I had a perfectly fine Postgres database on AWS RDS… for a side project that didn’t deserve a $20/month subscription.

## TL;DR

- Migrated a Payload CMS Postgres DB from AWS RDS → Neon.
- Cut hosting cost from ~`$20/month` to `~$0` (Neon free tier) for my usage.
- Used `pg_dump`/`pg_restore` with `--no-owner --no-privileges` to avoid role/permission mismatches.
- End-to-end took ~30 minutes, with ~5 minutes of downtime while swapping `DATABASE_URI` and restarting.

**At a glance**

- **Role:** solo (I’m the only person breaking prod).
- **Stack:** Payload CMS + Node, Postgres, AWS RDS → Neon.
- **Scale:** small app, small DB (restore finished fast).
- **Timeline:** ~30 min including “why is zsh mad at my connection string?”.

![AWS billing screenshot showing monthly spend around ~$20/month for my small RDS setup](./aws-cost-screenshot.png)

## Why I Moved

I was paying ~$20/month for AWS RDS to host a relatively small Payload CMS database. It worked fine, but it was basically a “subscription” for a side project.

Neon’s free tier covers my usage, and the DX is nicer than I expected. It also _feels_ faster for my workload, but I don’t have baseline metrics because I added PostHog **after** migrating (10/10 planning).

Constraints I cared about:

- **Keep it boring.** No re-platforming, no schema changes, just “same Postgres elsewhere”.
- **Low downtime was fine, but not zero-downtime.** This isn’t a bank.
- **Don’t fight permissions.** Managed Postgres products all have slightly different roles/privileges.

## The Migration (what I actually ran)

### Step 1: Dump from AWS RDS

I dumped the entire DB from RDS. The key flags were `--no-owner` and `--no-privileges` because provider defaults (roles/users/grants) don’t match 1:1.

```bash
pg_dump \
  -h <your-rds-endpoint>.rds.amazonaws.com \
  -U <your_user> \
  -d <your_db_name> \
  --no-owner \
  --no-privileges \
  -F c \
  -f database_dump.dump
```

Two quick notes:

- The dump file saves to your **local machine**, not “inside RDS”. (This tripped me up.)
- `-F c` is Postgres’s **custom format** (compressed, and it can be restored in parallel).

### Step 2: Upgrade pg_dump (if needed)

If your local `pg_dump` is _ancient_, upgrade it. I used Homebrew on macOS:

```bash
brew update
brew install postgresql@16
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
```

In general: a **newer** `pg_dump` can dump from an **older** Postgres server, but not the other way around.

### Step 3: Restore to Neon

This is where I hit the only “wait what” moment.

My first attempt used a full connection string directly:

```bash
pg_restore -v \
  -d postgresql://<neon_user>:<neon_password>@<neon-host>/<neon_db>?sslmode=require \
  database_dump.dump
```

And I got:

```
zsh: no matches found: postgresql://neondb_owner:<pass>@...?sslmode=require
```

Turns out zsh treats `?` as a wildcard, so it tries to glob your connection string. Fix: quote it, or use individual flags.

I went with flags (and kept the role/privilege suppression):

```bash
pg_restore -v -j 4 \
  --no-owner \
  --no-privileges \
  -h <neon-host> \
  -U <neon_user> \
  -d <neon_db> \
  database_dump.dump
```

For larger restores, I’d also recommend using Neon’s **direct** connection (not the pooler) for the import, then use the pooler connection string in your app. (Less mystery during restore.)

### Step 4: Update environment variables

Then I swapped my app’s `DATABASE_URI`/`DATABASE_URL` to the Neon connection string:

```diff
- DATABASE_URI=postgresql://user:pass@rds-endpoint.amazonaws.com/db
+ DATABASE_URI=postgresql://<neon_user>:<neon_password>@<neon-host>/<neon_db>?sslmode=require
```

Payload picked it up on restart. No schema changes, no migrations — it’s the same database, just living somewhere else.

### Step 5: Quick smoke test (do this before deleting anything)

- Open the admin panel and confirm you can log in.
- Create a record, edit a record, delete a record.
- Run one “real” query path in the app (whatever hits your most-used collections).
- Check logs for connection churn/timeouts (pooler vs direct string matters here).

## What I Learned

**1. Role mismatches are real.** Different providers ship different default roles/grants. `--no-owner --no-privileges` saved me from a bunch of noisy restore errors.

**2. Check extensions.** If you rely on extensions (ex: `uuid-ossp`, `pg_trgm`, PostGIS), confirm they exist on the target before you commit.

**3. Quote connection strings in zsh.** If your command has `?` (like `sslmode=require`), zsh will happily interpret it as a glob.

**4. Measure before migrating.** I should’ve put PostHog (or even just a basic p95 endpoint timer) on RDS first. Now I’m stuck with vibes.

## The tradeoff (what you give up for “free”)

This wasn’t a free lunch:

- **Neon’s serverless model can behave differently** than a constantly-on RDS instance (connection pooling is more important, and long-lived connections can be a footgun).
- **Vendor UI/DX is nicer**, but you’re trusting another provider with your production data. (It’s still Postgres, but it’s not your box.)

## Results

- **Cost:** ~$20/month → ~$0 for my usage (≈ $240/year saved).
- **Downtime:** ~5 minutes (I was okay with that).
- **Effort:** ~30 minutes end-to-end.
- **Data integrity:** no data loss, no compatibility issues (for this schema/extension set).

## Links

- Neon: https://neon.tech
- `pg_dump`: https://www.postgresql.org/docs/current/app-pgdump.html
- `pg_restore`: https://www.postgresql.org/docs/current/app-pgrestore.html

If you’re running a side project on RDS and paying more than you’d like, this migration is one of the rare “boring changes” that pays for itself immediately.
![AWS billing screenshot showing monthly spend around ~$20/month for my small RDS setup](./aws-cost-screenshot.png)
