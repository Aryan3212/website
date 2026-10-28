---
draft: true
pubDate: '2026-01-04T00:00:00.000Z'
title: SEO Content Builder - Growing Search Traffic 3.5X
description: >-
  Building an in-house drag-and-drop page builder that helped scale organic search traffic from 33k to 116k monthly visits.
postOrder: 4
heroImage: './gozayaan-seo.png'
demoVideo: 'https://res.cloudinary.com/dwz8ueclf/video/upload/f_auto,q_auto/v1793170999/2026-10-28_13-53-45_oyx0ib.mp4'
category: 'Portfolio'
tags: ['portfolio']
---

In 2023, I worked on a webpage builder at GoZayaan. The marketing team was writing blogs and creating content, but they had to work with the development team to deploy it. We wanted them to be able to publish without the development team in the middle of the process.

We built a dashboard where the team could drag and drop pre-built components, change the layout, and add their own images, text, and cards. Once published, the page would be available at a URL on the website.

[![A GoZayaan page built with the webpage builder](./gozayaan-seo.png)](https://gozayaan.com/route/saint-martin-ship)

The data model used an array of components, each with a type and its associated data. In the Vue frontend, we checked the type and populated the corresponding component with that data.

When we finished the project, organic traffic was around 33,000 monthly visits. By March 2025, it was around 100,000. The builder supported the marketing team in publishing the content behind that growth.

We also generated an XML sitemap when a page was published, giving search engine crawlers information about the pages. At the time of the recording, the sitemap contained 73 pages. We generated structured data for pages as well, using script tags to provide information that can be used for rich search results.

My main contributions were the components and the builder panel. We also built a dynamic table and an image library, which I found challenging to design.
