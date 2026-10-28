---
draft: false
pubDate: '2026-10-28T00:00:00+07:00'
title: No-code Webpage Builder Overview
description: >-
  Building an in-house drag-and-drop page builder that helped scale organic search traffic from 33k to 100k monthly visits.
postOrder: 4
heroImage: './gozayaan-seo.png'
demoVideo: 'https://res.cloudinary.com/dwz8ueclf/video/upload/f_auto,q_auto/v1793170999/2026-10-28_13-53-45_oyx0ib.mp4'
category: 'Portfolio'
tags: ['portfolio']
---

This is an overview of the webpage builder I worked on at GoZayaan in 2023.

GoZayaan is an online travel agency, and we needed search traffic to come to the website. One way to do that was to consistently publish blogs with internal links. The marketing team was writing blogs and creating content, but they had to communicate with the development team to deploy it. We decided they should be able to do this without the development team in the middle of the pipeline.

## The builder

We created a dashboard where the team could add pre-built components and change the images and text. They could drag and drop components, add cards, and change the layout. When they published a page, it would be available at a URL on our website.

[![A GoZayaan page built with the webpage builder](./gozayaan-seo.png)](https://gozayaan.com/route/saint-martin-ship)

The data model was an array of components, with the type of each component and the data associated with it. In our Vue frontend, we checked the type and populated the corresponding component with that data to show the content on the website.

When we finished the project, traffic was about 33,000 monthly visits. By March 2025, it was around 100,000, roughly a threefold increase in search traffic. The builder supported the marketing team in publishing the content behind that growth.

## Search features

When a page was published, we generated an XML sitemap to give the Google crawler information about the webpages. At the time of the recording, there were 73 pages in the sitemap.

We also generated structured data on the fly for the webpage builder. This is added in a script tag and can help search engines show richer results, such as the recipe displays you see on Google. An FAQ block could generate `FAQPage` JSON-LD automatically.

## My contributions

My main contributions were the components and the builder panel. We also built a dynamic table and an image library, which I found challenging to design.

I was very new to software engineering then and I feel I didn't make the right abstractions with regards to validation and component structure.
