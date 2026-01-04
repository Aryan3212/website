---
pubDate: '2097-09-20T00:00:00.000Z'
title: Custom URL Feature - Enterprise SaaS at Scale
description: >-
  Infrastructure-level feature work across CloudFront, Lambda@Edge, DynamoDB, that served 1M+ assets/day
heroImage: './custom-url.png'
category: 'Portfolio'
tags: ['portfolio']
---

**My Role:** Full Stack Software Engineer

**Tech Stack:** `AWS CloudFront` `Lambda@Edge` `DynamoDB` `Python`

---

## The Problem

Enterprise clients needed custom URL paths for their content. The challenge wasn't just "add a feature" - it was making it work within an existing CDN infrastructure that served branded domains.

**Constraints I had to work around:**

- Previous URLs must continue working (backwards compatibility)
- System-reserved URL formats couldn't be overwritten by users
- Existing custom URL paths couldn't collide
- Had to integrate with current branded domain infrastructure (required infra refactor)

---

## The Architecture

```
User Request
    ↓
   CDN
    ↓
Edge Function (URL lookup)
    ↓
DynamoDB (custom URL mappings)
    ↓
Reverse Proxy
    ↓
Kubernetes Pods
    ↓
S3 (content storage)
```

The Lambda@Edge function intercepts requests at the CDN level, looks up custom URL mappings in DynamoDB, and routes accordingly - all before the request hits our k8s infrastructure.

---

## What I Built

**1. URL Validation with Restricted Regex**

System URLs couldn't be overwritten. I implemented strict regex patterns to validate custom URLs against reserved paths before allowing creation.

**2. CDN/Infrastructure Configuration**

Changed CloudFront behavior configs to ensure Lambda@Edge had the correct request metadata for lookups. This required understanding CDN request/response lifecycle - origin requests vs viewer requests, header forwarding, cache behavior.

**3. Lambda@Edge URL Resolution**

The edge function performs DynamoDB lookups to resolve custom URLs to internal paths. Edge functions have different constraints than regular Lambdas - no VPC access, size limits, regional replication.

**4. Kubernetes Debugging**

When things didn't work in production, I had to debug across the stack - from CloudFront logs to Lambda@Edge logs (which are in different regions than you'd expect) to k8s pod logs.

---

## Learnings

**CDN behavior is nuanced.** Request vs response triggers, origin vs viewer events, header forwarding rules - getting these wrong means silent failures at the edge.

**Lambda@Edge logs are regional.** Unlike regular Lambda, edge function logs appear in the region closest to where the request was served, not where you deployed. Spent time learning this the hard way.

**Infrastructure changes require coordination.** CDN config changes propagate globally. Secrets management across edge functions and k8s needed careful handling.

---

## Impact

- Feature shipped to enterprise clients without any outages
- Added documentation for future infrastructure work

## Key Takeaways

**Infrastructure features are different.** Application code is one thing. CDN configs, edge functions, and k8s debugging require understanding how requests flow through the entire system.

**Backwards compatibility at the edge is hard.** You can't just version an API - you're changing how URLs resolve globally.

**Documentation compounds.** The docs I wrote for this feature will save the next engineer significant debugging time.

---

[Back to Portfolio Overview](/post/portfolio/about-me)
