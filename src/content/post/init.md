---
title: "Init"
publishDate: "21 December 2023"
description: "First post that is not a thing ok guys!!! Oh I need this to be 50 characters!!"
tags: ["example", "blog", "cool"]
---

## Hello World

Following is an example blog post written in an mdx file. You can find me @ src/content/post/hello-world/index.mdx. Here you can add/update/delete details and watch the changes live when running in develop mode, `pnpm dev`

![A pug in the woods, wrapped in a blanket](./hello-world/pug.jpeg)

## Using some markdown elements

Here we have a simple js code block.

```js
let string = "JavaScript syntax highlighting";
```

This is styled by Shiki, set via the [config](https://docs.astro.build/en/guides/markdown-content/#syntax-highlighting) for Astro.

You can choose your own theme from this [library](https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes), which is currently set to Dracula, in the file `astro.config.mjs`.

Here is a horizontal rule.

---

Here is a list:

- Item number 1
- Item number 2
- Item number 3

And an ordered list:

1. James Madison
2. James Monroe
3. John Quincy Adams

Here is a table:

| Item         | Price | # In stock |
| ------------ | :---: | ---------: |
| Juicy Apples | 1.99  |        739 |
| Bananas      | 1.89  |          6 |

## Tailwind CSS Prose styling

> I'm a simple blockquote.
> I'm styled by Tailwind CSS prose plugin