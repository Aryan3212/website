---
pubDate: '2025-01-01T23:10:00.000Z'
title: 'Microservices Part 1: Why Microservices?'
description: 'The reasoning behind choosing microservices architecture and why jobs require them.'
tags: ['technical', 'portfolio']
heroImage: '../../assets/images/te.jpg'
category: 'Tech'
---

## Intro

I was looking at LinkedIn the other day and noticed something interesting - there are about 50,000 jobs mentioning 'microservices' compared to 400,000 mentioning 'software developer'. What exactly are microservices, and do we really need them?

## What is microservices architecture?

Let me break it down for you. Microservices is an architectural pattern in software engineering. Think about traditional software - it's basically a program, right? Just lines of code running on your computer. Usually, all the features and business logic live in one codebase and run as a single process. This is what we call a monolithic architecture - everything runs as one unit. Sure, we can copy this code to run on multiple machines, but at its core, we're just replicating and running the same codebase (that's what scaling is!).

Microservices flips this on its head. Instead of keeping everything together, it splits features (or business logic) into separate services. We're talking completely different codebases running independently from each other. When you deploy a microservices system, you're running multiple isolated processes. These services talk to each other through network calls or message brokers.

You can write the same software either way. But why pick one over the other? And why are so many job postings asking for microservices experience?

## Pros and cons discussion: Monolith vs Microservices

Let's look at the trade-offs. With monoliths, you've got a single codebase where everything runs in one process in memory. Business logic runs faster because you're only querying one database for every feature, and logic can be easily shared between services. Everything being in the same process means faster execution.

Managing one codebase is simpler, and you've got better control over concurrency since it's all happening in the same process - unlike dealing with network-level concurrency where things get trickier.

But monoliths have their issues. The biggest one is people-related: when your codebase gets huge and multiple teams are working on it, things get messy. One team changes something in commit 1, another team changes something else in commit 2, and when these commits merge, work can get overwritten. Unless you've got specific tests for every case, you might not know about problems until something breaks in production.

There's also the scaling problem. Say your app's chat feature needs way more resources than other features. With a monolith, you'd have to scale everything together - you can't just scale the chat feature without adding extra complexity. Plus, large codebases take longer to deploy, test, and modify.

Microservices were created to tackle these problems. Small teams can work independently on their own codebases. They only need to know other services' APIs to communicate - no need to touch other services directly. They can run their specific tests and deploy just their service. Need 1000 instances of one feature? No problem - you don't have to scale everything else.

## Do we need microservices?

Here's the real talk though: microservices usually aren't solving technical problems. They're solving people problems. The technical issues I mentioned? They can be handled other ways and really only matter for extremely large codebases. And let's be honest - most software doesn't live long enough or grow big enough to need microservices.

So why do companies still want them?

My theory? Everyone wants to be the next big thing. They're all looking up to FAANG/MAANG companies, and even if they'll never reach that size, they want to keep that door open.

Understanding microservices helps you visualize how to transition from a monolith when needed. It's not rocket science - you can even create microservices without Docker or Kubernetes (though they do make deployments easier).

Bottom line? Knowing microservices helps us design better monoliths because we learn to think about services in isolation. This leads to lower coupling and higher cohesion\*, making our software more manageable and easier to adapt as business needs change. Because at the end of the day, software's biggest challenge is managing complexity. Once your codebase becomes unmanageable, you're in trouble - you won't be able to keep up with competition.

## Conclusion

Jobs therefore will still want microservices experience even though I believe this shouldn't be a hard requirement. But, the knowledge still helps us understand networks and handling data in a distributed fashion which can be beneficial for us.

/\* Coupling and cohesion: Loose coupling is good, when software is loosely coupled, unique features are properly isolated. High cohesion is good, when related features work together and have their code in the same place it's called high cohesion. Both these features combine to make good software, for example groups and pages are completely different features in Facebook so they should be loosely coupled and have code in separate places.

Likes and posts are features that are closely intertwined so they should share some functionality. Therefore, they should be highly cohesive.
