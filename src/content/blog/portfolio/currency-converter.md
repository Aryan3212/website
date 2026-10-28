---
draft: false
pubDate: '2026-10-28T00:00:00+07:00'
title: Building an Offline-First Currency Converter
description: >-
  Built a production currency converter that serves unlimited users with roughly 72 API calls/month using multi-tier caching and offline-first architecture
postOrder: 6
heroImage: './currency-converter.png'
demoVideo: 'https://res.cloudinary.com/dwz8ueclf/video/upload/f_auto,q_auto/v1793173381/untitled_h13rl7.mp4'
category: 'Portfolio'
tags: ['portfolio']
---

I built this currency converter in 2024 after running into a problem while travelling in Vietnam. I often needed to convert between Bangladeshi taka, US dollars, and the local currency, and I wanted to see those conversions at the same time and save them for later. In 2026, I'm still using it while travelling in Indonesia.

The app lets me add currencies, saves my conversions, and works offline. When there is no internet connection, it loads saved values from localStorage and the website from the service worker cache.

**My Role:** Full Stack Software Engineer

**Tech Stack:** `Remix` `Workbox` `Upstash Redis` `Service Workers` `localStorage`

## TL;DR

- Fixer’s free tier is 100 requests/month, so rates were treated as “slow-moving data” and cached aggressively.
- Works offline after the first visit: server cache + localStorage + a service worker fallback.

**Live:** [multiplecurrencyconverter.fly.dev](https://multiplecurrencyconverter.fly.dev/)

Fixer’s free tier is very limited for a real product (100 requests/month). Since currency rates also do not change every second, the problem was handled as a caching problem rather than an API-throughput problem.

The goal was simple:

- Unlimited users (within reason) without blowing the API limit.
- Works offline after you’ve opened it once.
- Doesn’t hard-fail when Fixer (or the network) is down.

### The core idea

Cache rates for 10 hours on the server. That’s up to roughly 72 calls in a 30-day month if the cache is refreshed as soon as it expires. Everything else is just layers of fallback around that.

### Server-side cache (so traffic doesn’t matter)

```typescript
// app/lib/currency.server.ts
const cacheResponse = await redis.get('currency_response') // TTL: 36,000s
const fallbackCache = await redis.get('currency_response_fallback') // Permanent

if (cacheResponse) {
	return cacheResponse // Cache hit - no API call
}

try {
	const data = await fetch(`https://data.fixer.io/api/latest?access_key=${key}`)

	// Store with 10-hour TTL
	await redis.set('currency_response', data, { ex: 36000 })
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

The app persists the last good payload locally, so it remains usable when network access is lost:

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

- Rate limits are usually caching problems, not raw API problems.
- Service worker lifecycle matters. Without careful activation and cache cleanup, stale behavior becomes hard to debug.
- Multiple fallbacks are worth it. Redis → localStorage → hardcoded fallback is the difference between “offline-first” and “offline-broken”.

This was also one of the first times I tried agentic coding. I used the Droid coding agent, but I still needed to be very hands-on with the code.

---

[Back to Portfolio Overview](/post/portfolio/about-me)
