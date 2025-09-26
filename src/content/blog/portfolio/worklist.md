---
pubDate: '2099-09-23T23:11:00.000Z'
title: Worklist Job Board
description: >-
heroImage: './wkl.png'
category: 'Portfolio'
tags: ['portfolio']
---

_Sorry for the scribbled image the project is not running now and I didn't take any screenshots :(_

**My Role**: Sole Developer\
**Team Size**: 1\
**Timeline**: 1 Month\
**Tech Stack:** `Django, Django Rest Framework, PostgreSQL, SSLCommerz API`

## The Problem

Job seekers often struggle with generic search results. The goal was to create a platform where users could find relevant job postings using a powerful search experience, moving beyond simple keyword matching.

## The Solution

I built a full-stack job board application. The core feature was a full-text search capability powered by PostgreSQL, allowing for efficient querying of job descriptions to deliver more accurate results.

## Impact & Results

- Successfully implemented a search feature that was more effective than standard `LIKE` queries.
- Integrated a complete payment flow using SSLCommerz for posting jobs.
- Authored a technical blog post on the search implementation to share the knowledge. Can be found here: [Simple and Efficient Full-Text Search using Django and Postgres](/post/fts-django/)

## Key Takeaways

- Gained a deeper understanding of leveraging database-native features like full-text search.
- Learned how to handle asynchronous, event-driven processes using webhooks for payment processing.

## My Contributions

- I architected and built the entire application, including the REST API and database schema.
- I implemented the full-text search indexing and query logic within Django's ORM.
- I integrated the SSLCommerz API and managed webhook events for payment processing.
- Deployed to production using AWS EC2 and RDS with Nginx and Gunicorn, including SSL setup.

## Technical Challenges & Decisions

**Challenge: Inefficient Job Post Searching**

- **Problem:** Basic database queries (`LIKE`) were too slow and inaccurate for searching through large job descriptions.
- **Solution:** I used PostgreSQL's built-in `SearchVector` and `SearchQuery`. This offloaded search logic to the database, resulting in faster, more relevant results and a simpler application layer.

**Challenge: Handling Payment Transaction State**

- **Problem:** Reliably updating a job post's status after payment, even with potential network failures.
- **Solution:** I used SSLCommerz Webhooks to listen for payment success events asynchronously. This decoupled payment verification from the user request, ensuring job posts were only activated after a confirmed payment.

## Links

- **GitHub:** [github.com/Aryan3212/worklist](https://github.com/Aryan3212/worklist)
- **Blog Post:** [Simple and Efficient Full-Text Search using Django and Postgres](/post/fts-django)
