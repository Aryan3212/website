---
pubDate: '2025-01-09T15:51:00.000Z'
title: 'Why Types Matter in Programming'
description: 'Understanding the purpose of types in programming languages and their role in managing code complexity'
tags: ['technical', 'portfolio']
heroImage: '../../assets/images/te.jpg'
category: 'Tech'
---

## Backstory

When I was learning Java in university, using types, classes, and other language features made me think types were a central part of programming and computers.

My brain got tricked into thinking the CPU somehow needed to know the types or it would explode (or at least wouldn't work correctly). I even thought there was some magic validation happening with user input when we used types.

Then I wrote some Assembly code for another university course and had an epiphany: the CPU doesn't know what types are. At the fundamental level, it only understands binary, or more specifically, bytes of binary (8 bits).

## How CPUs see types

Types don't exist in the CPU's worldview. It only knows it can perform certain actions (instructions), and those actions work with data. Both actions and data are just bytes.

I won't dive into how CPUs work, but fundamentally, the core components of computing—the CPU, RAM, and storage—only understand bytes and their own instructions. So why do we need types?

Let me introduce a fundamental principle of writing software:

> The central problem of writing software is managing complexity. This complexity isn't about performance (time and space complexity). This is the cognitive complexity you face when trying to maintain a codebase and add, remove, or update code.

This is where types come in. Types don't help the computer, nor do they help the user. They help YOU.

In fact, the whole premise of OOP, types, classes, coupling, cohesion, testing, and many other design patterns and software architecture principles is to help us—the developers—write code that our peers can understand and modify at a reasonable pace.

## Why types?

Types give us information about the structure of the data we use in our code. The same can be said for classes and interfaces, though they have different use cases.

Types are simpler. You define how arguments and return values should look in your function. Then when you or another developer uses that function, they instantly know what it expects and returns without looking at the code.

Furthermore, when you come back to modify the function, you know you need to return data that matches the structure defined in the type you wrote before.

Even if you change the return type, your code editor/linter (if set up correctly) will tell you whether your type change breaks code elsewhere, written by other developers.

Therefore, types help us set and meet expectations of the code around us. It's hard to appreciate their benefit without working on a large, frequently changing codebase maintained by many people.

When handling user input or fetching data from an external API, once we validate that data, we can attach a type to it so that all other code in our codebase can expect a consistent structure.

This consistent structure and predictability is what types offer us.

## Types in the wild

I particularly explored this topic when a few popular open-source libraries moved away from types, namely Svelte and Turbo. They had their reasons—[Svelte now uses JSDoc](https://news.ycombinator.com/item?id=35892250) as a replacement for types because they wanted their library source code to be more readable\* (TypeScript transpilation made the code quite unreadable), while Turbo felt they could move faster without types.

I prefer using types. I know what the code expects and don't have to do any guesswork. I have a tiny brain, and keeping track of what hundreds of methods expect me to pass and what they return is difficult.

So, types FTW!

\* The library maintainers would test the library package using their own projects, if you go into `node_modules` from npm, you'll see that the JS code is uglified and minified in some cases making it hard to debug what's happening with your code.
