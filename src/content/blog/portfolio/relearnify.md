---
pubDate: '2096-09-23T23:11:00.000Z'
title: Relearnify
description: >-
  A notes app that emails you what to review
heroImage: './relearnify.png'
category: 'Portfolio'
tags: ['portfolio']
---

A notes app that emails you scheduled reviews based on spaced repetition. You take notes, it tells you when to revisit them.

**Tech Stack:** `Next.js` `tRPC` `PostgreSQL` `BullMQ` `Tiptap` `Gemini API`

**Try it:** [relearnify.vercel.app](https://relearnify.vercel.app/)

[![Demo](./relearnify-demo.png)](https://www.loom.com/share/85dd30e9d272471cadba553f48bafe9e?sid=52464fca-7d46-484d-a3da-1300471e3ea9)

## How It Works

1. Write notes in a rich text editor (Tiptap)
2. FSRS algorithm schedules optimal review times
3. Background jobs (BullMQ) queue up daily emails
4. You get an email with notes to review

![Email example](./relearnify-mail.png)

## The Interesting Bits

**Monkeypatching Tiptap** — Tiptap's default YouTube handling embeds videos inline. I wanted links instead (lighter, less distracting). Ended up patching the extension's node view to render as a styled link rather than an iframe.

**FSRS integration** — The Free Spaced Repetition Scheduler is an open algorithm that calculates optimal review intervals. Integrating it meant understanding its state model (stability, difficulty, retrievability) and persisting that per-note.

**Gemini summarization** — Long notes get a "summarize" button. Useful for reviewing dense content quickly.

## What I Learned

Note-taking UX has a lot of invisible details. Keyboard shortcuts, paste handling, list indentation, mobile responsiveness - you only notice when they're broken. Spent more time on these edge cases than core features.

## What's Next

Working on v2 as an offline-first app. The current version needs internet for everything. Local-first with sync would be more resilient.

## Links

- **Live:** [relearnify.vercel.app](https://relearnify.vercel.app/)
