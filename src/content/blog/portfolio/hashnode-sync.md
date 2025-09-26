---
pubDate: '2099-09-23T23:11:00.000Z'
title: Hashnode Sync - A CLI for syncing with Hashnode
description: >-
heroImage: './hsync.png'
category: 'Portfolio'
tags: ['portfolio']
---

**My Role**: Sole Developer\
**Timeline**: 1 day\
**Tech Stack**: `Node.js` `JavaScript` `GraphQL` `npm` `CLI`

## The Problem

This was my Hashnode GraphQL hackathon submission. I wanted a tool that I could use to sync my markdown blogs with Hashnode without many extra steps. It will track the blogs, see whether they changed and sync with my online blog.

## The Solution

I built `hashnode-sync`, an npm command-line tool that automatically synchronizes local markdown files with a Hashnode blog. It detects changes, additions, or deletions and uses the Hashnode GraphQL API to keep the blog content in sync, enabling a seamless "content as code" workflow.

## Impact & Results

- Automated the publishing workflow, reducing the time to post or update an article from several minutes to a single command.
- Enables a "content-as-code" approach, allowing writers to use tools like Git for versioning and collaboration on blog posts.
- Published on npm for anyone to use.

## Key Takeaways

- Gained practical experience designing a CLI tool and integrating with a third-party GraphQL API.
- Learned the process of publishing and versioning a public package on npm.
- Discovered that advanced language features like Proxies can offer elegant solutions to common problems like state persistence.

## My Contributions

- Designed the core change-detection logic using SHA-256 content hashing to minimize API calls.
- Built the end-to-end CLI experience, from an interactive setup prompt to full integration with Hashnode's GraphQL API for CRUD operations on posts.
- Engineered an elegant configuration persistence layer using JavaScript Proxies for simplified state management.

## Technical Challenges & Decisions

**Challenge:** Persisting the sync state (which files were synced, their IDs, and last-known state) across separate CLI runs.
**Solution:** Instead of manual read/write operations, I used a JavaScript `Proxy` to wrap the configuration object. This automatically intercepted any modification and seamlessly persisted the state to the `hashnode-syncrc.json` file. This choice greatly simplified the codebase.

```javascript
// sync-json.js
function getSyncedJson(path) {
	const data = fs.readFileSync(path)
	const obj = JSON.parse(data)
	return new Proxy(obj, {
		set(target, property, value) {
			Reflect.set(target, property, value) // Update in-memory object
			saveJsonFile(path, target) // Persist change to disk
			return true
		}
	})
}
```

**Challenge:** Avoiding redundant API calls for files that hadn't been modified.
**Solution:** I stored a SHA-256 hash of each file's content and metadata. On subsequent runs, the CLI only triggers an API update if a file's calculated hash differs from the stored one, ensuring API calls are made only when necessary.

## Links

**GitHub**: [https://github.com/Aryan3212/hashnode-sync](https://github.com/Aryan3212/hashnode-sync)
