---
draft: false
pubDate: '2026-10-28T00:00:00+07:00'
title: Building an Offline-First Currency Converter
description: >-
  A multiple currency converter that saves conversions and works offline using cached exchange rates and a service worker.
postOrder: 6
heroImage: './currency-converter.png'
demoVideo: 'https://res.cloudinary.com/dwz8ueclf/video/upload/f_auto,q_auto/v1793173381/untitled_h13rl7.mp4'
category: 'Portfolio'
tags: ['portfolio']
---

I built this currency converter in 2024 to solve a problem I faced myself. I was travelling in Vietnam, and I often had to convert between Bangladeshi taka, US dollars, and the local currency, whether that was Vietnamese dong or Indonesian rupiah. I wanted a currency converter that could do all of that at the same time and save my conversions. It's 2026 now, and I'm travelling in Indonesia and still using it.

You can add currencies, save your conversions, and use it offline. If I don't have Wi-Fi, it still loads my conversions and values from localStorage. The website itself loads from the browser's service worker cache.

[Open the currency converter](https://multiplecurrencyconverter.fly.dev/)

## How it works

On the server, we use Fixer as the currency data API. The free tier I was using allowed 100 requests per month, so we save the results in Redis on Upstash. We also need to update the rates: even if the data is eight hours old, it's still useful to me because I can get an estimate.

In the video I describe refreshing the Redis cache after 10 hours and calling Fixer again. The current code uses a 50,000-second expiry (about 14 hours). There are also permanent caches and fallbacks for when Fixer isn't available.

In the browser, the calculations are stored in localStorage, so they are still there when I reload. The service worker acts like a proxy between the browser and server. When the server isn't available because there's no internet, it can return the saved webpage. That's how I can still use the website without Wi-Fi.

This was also one of the first times I tried agentic coding. I used the Droid coding agent, and I still needed to be very hands-on with the code itself back then.
