---
pubDate: '2070-09-23T23:11:00.000Z'
title: Hashnode Sync
description: A CLI for syncing with Hashnode - Hashnode Hackathon Submission
heroImage: './hsync.png'
category: 'Portfolio'
tags: ['portfolio']
---

A CLI tool that syncs local markdown files to Hashnode. Built in a day for the Hashnode GraphQL hackathon.

**Tech Stack:** `Node.js` `GraphQL` `npm`

## The Trick: Auto-Persisting State with Proxies

The CLI needs to remember sync state between runs - which files were synced, their Hashnode IDs, content hashes. The typical approach: manual read/write calls everywhere.

Instead, I wrapped the config object in a JavaScript Proxy. Any property change automatically persists to disk:

```javascript
function getSyncedJson(path) {
	const obj = JSON.parse(fs.readFileSync(path))
	return new Proxy(obj, {
		set(target, property, value) {
			Reflect.set(target, property, value)
			saveJsonFile(path, target) // Auto-persist on any change
			return true
		}
	})
}
```

Now `config.lastSync = Date.now()` just works - no explicit save calls. The codebase got much simpler.

## Change Detection

SHA-256 hashing on file content + metadata. Only files with changed hashes trigger API calls. No diff logic needed - if the hash matches, skip it.

## What It Does

- Watches a folder of markdown files
- Detects new/changed/deleted posts
- Syncs to Hashnode via their GraphQL API
- One command: `hashnode-sync`

Published on npm. Content-as-code workflow for blogs.

## Links

- **GitHub:** [github.com/Aryan3212/hashnode-sync](https://github.com/Aryan3212/hashnode-sync)
- **npm:** [npmjs.com/package/hashnode-sync](https://www.npmjs.com/package/hashnode-sync)
