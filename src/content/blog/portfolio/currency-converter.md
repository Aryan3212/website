---
pubDate: '2026-01-04T00:00:00.000Z'
title: Building an Offline-First Currency Converter
description: >-
  Built a production currency converter that serves unlimited users with just ~60 API calls/month using multi-tier caching and offline-first architecture
postOrder: 6
heroImage: './currency-converter.png'
category: 'Portfolio'
tags: ['portfolio']
---

**My Role:** Full Stack Software Engineer

**Tech Stack:** `Remix` `Workbox` `Upstash Redis` `Service Workers` `localStorage`

## TL;DR

- Fixer’s free tier is 100 requests/month, so I treated rates as “slow-moving data” and cached aggressively.
- Works offline after the first visit: server cache + localStorage + a service worker fallback.

**Live:** [multiplecurrencyconverter.fly.dev](https://multiplecurrencyconverter.fly.dev/)

Fixer’s free tier is basically unusable for a real product (100 requests/month). But currency rates also don’t change every second. So I stopped thinking “API problem” and started thinking “caching problem”.

The goal was simple:

- Unlimited users (within reason) without blowing the API limit.
- Works offline after you’ve opened it once.
- Doesn’t hard-fail when Fixer (or the network) is down.

### The core idea

Cache rates for ~14 hours on the server. That’s 2 calls/day → ~60 calls/month. Everything else is just layers of fallback around that.

### Server-side cache (so traffic doesn’t matter)

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

Result: traffic can spike and the API call count stays basically flat.

### Client-side cache (so offline works)

I persisted the last good payload locally, so if you lose network you still get a usable converter:

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

Remix client loader fallback:

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

Service worker: try network first, but don’t make the UI wait forever:

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

### Things I learned

- Rate limits are rarely “API problems”. They’re usually “you didn’t cache” problems.
- Service worker lifecycle matters. If you don’t manage activation/old caches, you’ll get weird stale behavior that’s hard to debug.
- Multiple fallbacks are worth it. Redis → localStorage → hardcoded fallback is the difference between “offline-first” and “offline-broken”.

---

[Back to Portfolio Overview](/post/portfolio/about-me)
