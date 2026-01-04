---
pubDate: '2096-09-20T00:00:00.000Z'
title: Building an Offline-First Currency Converter
description: >-
  Built a production currency converter that serves unlimited users with just ~60 API calls/month using multi-tier caching and offline-first architecture
heroImage: './currency-converter.png'
category: 'Portfolio'
tags: ['portfolio']
---

**My Role:** Full Stack Software Engineer

**Tech Stack:** `Remix` `Workbox` `Upstash Redis` `Service Workers` `localStorage`

---

Live at https://multiplecurrencyconverter.fly.dev/

## The Problem

Currency APIs like Fixer.io have strict rate limits (100 requests/month on free tier). Building a production app that serves thousands of users requires a smarter approach than direct API calls.

**Constraints I had to work around:**

- Free tier API limit: 100 requests/month
- Need to serve unlimited users
- Must work offline after first visit
- Currency rates need to be reasonably fresh but don't change frequently

---

## The Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ React/Remix  │──│ localStorage │──│ Service Worker   │  │
│  │    UI        │  │   Cache      │  │ (Workbox)        │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        SERVER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Remix Loader │──│ Upstash      │──│ Fixer.io API     │  │
│  │              │  │ Redis        │  │ (rate limited)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

The key insight: currency rates don't change frequently. A 14-hour cache is perfectly acceptable, allowing us to serve unlimited users with minimal API calls.

---

## What I Built

**1. Three-Tier Server Cache**

The server-side caching strategy bypasses rate limits entirely. Currency rates are cached in Upstash Redis with a 14-hour TTL, plus a permanent fallback for graceful degradation.

```typescript
// app/lib/currency.server.ts
const cacheResponse = await redis.get('currency_response') // TTL: 50,000s
const fallbackCache = await redis.get('currency_response_fallback') // Permanent

if (cacheResponse) {
	return cacheResponse // Cache hit - no API call
}

try {
	const data = await fetch(`https://data.fixer.io/api/latest?access_key=${key}`)

	// Store with 14-hour TTL
	await redis.set('currency_response', data, { ex: 50000 })
	// Store permanent fallback
	await redis.set('currency_response_fallback', data)

	return data
} catch {
	// Graceful degradation
	return fallbackCache ?? hardcodedFallbackRates()
}
```

Result: 1 API call per 14 hours regardless of traffic. 100 monthly requests → 2 calls/day × 30 = 60 used.

**2. Four-Layer Offline-First Cache**

Layer 1: Upstash Redis (Server) - Serverless Redis caches API responses with hot cache (TTL) and permanent fallback.

Layer 2: localStorage (Client) - Client-side persistence for offline access.

```typescript
// app/components/CurrencyPage.tsx
useEffect(() => {
	localStorage.setItem(
		'currencyData',
		JSON.stringify({
			currencyMap,
			timestamp,
			validatedCurrencies
		})
	)
}, [])
```

Layer 3: Remix Client Loader - Graceful fallback when network fails.

```typescript
// app/routes/convert.$path.tsx
export const clientLoader = async ({ serverLoader }) => {
	try {
		return await serverLoader()
	} catch {
		// Network failed - use localStorage
		const cached = localStorage.getItem('currencyData')
		if (cached) return JSON.parse(cached)
		throw new Error('No data available')
	}
}
```

Layer 4: Service Worker (Workbox) - NetworkFirst strategy with 3-second timeout, serves cached version if offline or slow.

```typescript
// app/plain-sw.ts
precacheAndRoute(manifest)

registerRoute(
	({ request }) => request.mode === 'navigate',
	new NetworkFirst({
		cacheName: 'pages',
		networkTimeoutSeconds: 3 // Try network, fallback after 3s
	})
)
```

---

## Learnings

**Cache aggressively when data is stable.** Currency rates are stable enough for 14-hour caching. This insight transformed the architecture from "how do we handle rate limits" to "how do we cache effectively."

**Multiple fallback layers prevent failures.** Redis → localStorage → hardcoded data ensures the app never completely fails, even when offline or when APIs are down.

**NetworkFirst > CacheFirst for user experience.** Users get fresh data when online, cached when offline. The 3-second timeout prevents slow network from blocking the UI.

**Service worker activation matters.** Clean up old caches on activate event to prevent stale data from persisting across deployments.

---

## Impact

- Converter serves unlimited users with just ~60 API calls/month
- Works completely offline after first visit
- Zero downtime during API outages (graceful degradation)
- Fast user experience with multi-layer caching

---

## Key Takeaways

**Rate limits are a caching problem, not an API problem.** By understanding that currency rates don't need real-time updates, I could design a caching strategy that made the rate limit irrelevant.

**Offline-first architecture improves UX.** The four-layer cache system means users get instant responses even when offline, and the app degrades gracefully when APIs fail.

**Client and server caching work together.** Server-side caching reduces API calls, client-side caching enables offline functionality. Both are necessary for a production app.

---

[Back to Portfolio Overview](/post/portfolio/about-me)
