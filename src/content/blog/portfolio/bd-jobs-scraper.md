---
pubDate: '2089-09-23T23:11:00.000Z'
title: BDJobs Scraper
description: >-
  Scraping 5000 job posts in 8 seconds
heroImage: './bdjobs-scraper.png'
category: 'Portfolio'
tags: ['portfolio']
---

A high-performance web scraper for collecting job market data.

**My Role:** Sole Developer\
**Team Size:** Solo Project\
**Timeline:** 1 day\
**Tech Stack:** `Python` `asyncio` `aiohttp` `BeautifulSoup4`

## The Problem

To analyze the job market in Bangladesh, I needed access to a large, structured dataset of recent job postings. This data was unavailable in an easily accessible format, making any quantitative analysis of industry trends, required skills, or salary benchmarks difficult.

## The Solution

I developed an asynchronous Python script to scrape the BDJobs website, the largest job portal in the country. The script navigates through thousands of job listings, extracts key details from each posting—such as title, company, experience, and salary—and saves the structured data into a CSV file.

## **Impact & Results**

- Successfully collected a comprehensive dataset of over 5,000 job listings.
- Reduced data collection time by over 85% compared to a synchronous implementation.
- The generated dataset was processed and publicly shared on Kaggle to aid other researchers and analysts.
- Current Status: The project is now deprecated, as significant changes to the target website's UI made the original parsing logic obsolete.

## **Key Takeaways**

- Asynchronous programming is a powerful tool for optimizing I/O-bound applications.
- Building simple, effective fault-tolerance mechanisms is critical for reliable data collection.
- Even for personal projects, considering memory efficiency leads to more robust and scalable designs.

## My Contributions

- Built the end-to-end scraping pipeline using `asyncio` and `aiohttp` to make concurrent requests.
- Created a retry mechanism to handle network failures.
- Optimized for memory by streaming results directly to a CSV file, keeping memory usage low and constant.

## Technical Challenges & Decisions

**1. Challenge: Inefficient Sequential Scraping**

- **Solution:** A simple synchronous scraper would have taken over an hour to process ~5,000 pages. I chose `asyncio` and `aiohttp` to perform network requests concurrently. This reduced the total execution time from an estimated 83 minutes to under 10 minutes, an 8x speed improvement.

```python
# Utilizing asyncio.gather to run concurrent tasks for fetching all job links
tasks = [parse_links(page, session) for page in range(2, total_pages + 1)]
results = await asyncio.gather(*tasks)
links += flatten(results)

# A second, larger pool of concurrent requests for individual job detail pages
conn_new = aiohttp.TCPConnector(limit=15)
session_new = aiohttp.ClientSession(connector=conn_new)
tasks = [get_details_page(link, writer, session_new) for link in links]
(await asyncio.gather(*tasks))
```

**2. Challenge: Handling Intermittent Network Failures**

- **Solution:** To prevent data loss from failed requests, I implemented a simple retry queue. Any link that failed to fetch was added to a `retry` list, which the script would process again in batches until the list was empty or a max retry count was reached.

## **Links**

- **GitHub:** [github.com/Aryan3212/bdjobs-scraper](https://github.com/Aryan3212/bdjobs-scraper)
- **Kaggle Dataset:** [kaggle.com/datasets/aryanrahman/bdjobs-all-job-listings-20-november-5pm](https://www.kaggle.com/datasets/aryanrahman/bdjobs-all-job-listings-20-november-5pm)
