---
layout: post
title: "I Added Artist Names and the Last Step Erased Them: Hunting an Anime Pixel Style"
date: 2026-10-29 02:00:00 +0900
category: ai-lab
series: comfyui-lab
tags: [AI art, ComfyUI, pixel art, test log, prompts]
image: /assets/img/posts/pixel-style-hunt/cast.webp
summary: To find an anime pixel-character style I actually liked, I generated over 600 images across 12 styles, 30 artists and several finishing orders. The answer turned out to be the order of the pipeline, not the prompt.
---

Ask an AI for pixel characters and the first few look fine. Flip through a few more and the odd ones creep in: glassy eyes, mushy dots, and a strangely Western game face. So this time I set out to find a style I genuinely liked. It had nothing to do with the current game, and it ate a whole day.

<figure><img src="/assets/img/posts/pixel-style-hunt/talk-en.webp" alt="Table of five scenes, Start, Go wide, Artist tags, Reorder and Decide, with what I said, Claude's answer and what changed" loading="lazy"><figcaption>A day of back-and-forth, boiled down to five scenes.</figcaption></figure>

## "Not these weird pictures"

It started as a grumble: I wanted proper pixel characters instead of these weird pictures, and I added, "using the newest models and techniques you can."

Claude looked at how people make pixel characters in ComfyUI and pitted four engines against each other. Anima with a pixel LoRA had the best drawing; the newly released Krea 2 with a pixel LoRA had the cleanest dots. So it chained them: draw with Anima, then let Krea 2 redraw only the dots. I looked at the four results and said, "This feel is the best."

<figure><img src="/assets/img/posts/pixel-style-hunt/start.webp" alt="Four anime pixel characters: a vampire girl, a witch on a broom, a farm girl with a pitchfork, a knight with sword and shield" loading="lazy"><figcaption>The starting point, and the moment I started wondering whether something even better was out there.</figcaption></figure>

## Twelve styles, twelve identical twins

I got greedy. I asked for as many styles as possible in that direction, with detailed and varied prompts, and told Claude to find out how people craft prompts when they hunt for their own style.

From the official model card and community guides, Claude brought back three habits:

1. Change one thing at a time.
2. Every time you change something, compare at least four seeds side by side.
3. Don't just list tags; add at least two sentences of description.

With that we drew 12 styles and 12 new characters, from an elf archer and a dwarf smith to a cat thief, a fox shrine maiden and a bard. The detailed descriptions clearly worked. Aiming a bow, praying, crouching, curtsying with a skirt in hand: every pose came out as described.

The styles, though, were **twelve identical twins**. The culprit was the pixel LoRA. It was turned up so high that it flattened every style word, "thick outlines", "pastel" and "90s retro" alike. Halving its strength and pushing the style harder finally made the branches split.

<figure><img src="/assets/img/posts/pixel-style-hunt/styles.webp" alt="Comparison of an elf archer, priestess, cat thief and princess in four styles; the bottom two rows have bigger, rounder heads" loading="lazy"><figcaption>Top: the original style. Bottom two rows: style LoRAs mixed in. Bigger heads, rounder faces.</figcaption></figure>

## "Even the official docs say it's weak without them"

Here we bumped heads. Claude said it wouldn't put specific artist names in the prompt: copying someone's style wouldn't be our style, and it could cause trouble if the game is ever sold. I disagreed. **I told it to list artists whose style is close to what we want, since we'd just mix in our own colour, and pointed out that the official docs say the style is weak without the artist tag.**

Claude turned around straight away. It pulled the 400 artists most often tagged alongside pixel and chibi art on an image board, matched them against the 59,000 artists the model actually learned, and got down to 243. After dropping artists with a high share of adult work, it tried 30 of them one by one, same seed and same character, so only the artist changed.

And then **it found the disaster.** The artist names clearly worked at the Anima stage: sharper eyes, bigger heads, darker lines. But after the final step where Krea 2 redraws the dots, almost all of that difference was gone. It was like seasoning a dish carefully and then rinsing it under the tap.

<figure><img src="/assets/img/posts/pixel-style-hunt/erased.webp" alt="Two rows of an elf archer. The large drawings on the left differ clearly, but the redrawn pixel versions on the right look almost the same" loading="lazy"><figcaption>Top: no artist. Bottom: one artist added. Different on the left, nearly the same in the dots on the right.</figcaption></figure>

## The answer was the order, not the prompt

So Claude suggested changing the finishing order. Dropping the redraw and pixelizing the Anima drawing directly kept the artist flavour intact, but the character came out too large with stray colours. A few more rounds settled it:

1. Shrink the character to the target size (97 cells tall) first, then pixelize directly.
2. Let Krea 2 tidy up only very lightly. At 0.45 the artist flavour disappears; from 0.25 the mouth and eye highlights start to blur. 0.20 was just right.
3. Remove stray specks and wrap a dark one-cell outline around the figure. That part is code, not AI, so it takes 0.003 seconds per image.

<figure><img src="/assets/img/posts/pixel-style-hunt/outline.webp" alt="A boy swordsman and a princess compared with no outline and three outline methods; the edges get darker to the right" loading="lazy"><figcaption>Far left: no outline. Further right, the edges get crisper and read well even on white.</figcaption></figure>

The final pick happened on a decision card: the sharp-eyed artist, the round-faced artist, or a mix of both. Claude recommended the mix and I chose it too. Not copying one person's look also matched my original idea of adding our own colour. Here are the 12 characters, drawn again four times each.

<figure><img src="/assets/img/posts/pixel-style-hunt/cast.webp" alt="Twelve characters in the same pixel style: elf archer, dwarf smith, priestess, cat thief, dark mage, dragon knight, merchant, fox shrine maiden, old wizard, princess, ninja and bard" loading="lazy"><figcaption>Twelve characters in the final style. They finally look like they live in the same town.</figcaption></figure>

One thing to be clear about: the base model, Anima, has a non-commercial licence, so these images can't be sold as they are. Krea 2 can be used commercially while yearly revenue is under $1M. The next step is to train our own style LoRA on 20 to 30 favourites from this batch. The artist names were only a compass; the final style will be ours.

## Three-line summary

1. If style words aren't landing, check whether another LoRA is overpowering them and lower it before writing more prompt.
2. In a multi-step pipeline, look at the image after every step. A later step may be erasing what an earlier one added.
3. When the AI says it won't do something and the reason doesn't convince you, push back with your evidence. One line is enough to change direction.
