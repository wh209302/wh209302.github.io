---
layout: post
title: "Reference Sites I Collected While Building With AI"
date: 2026-10-27 15:45:00 +0900
category: dev-tips
tags: [references, AI collaboration, pixel art, tokens, writing]
image: /assets/img/posts/reference-sites/refs.webp
summary: Out of the sites I handed to Claude with "check this out" while building the game, only the ones that truly earned their keep. A treasure chest I keep updating as I dig up new ones.
---

Whenever I find a great community tip or a nifty web tool while making the game, I first toss the link to Claude with **"hey, read this."**

Quite a few sites paid off nicely that way, but the problem was that after just a few days I'd be scrambling to find them again, going "what was that site's address again?" So I'm pinning down here only **the gems that really earned their keep** after I tried them myself.

<figure><img src="/assets/img/posts/reference-sites/refs.webp" alt="Reference site cards, sorted into writing, Claude settings, pixel art, and ideas" loading="lazy"><figcaption>A bookmark list picked out by category.</figcaption></figure>

## Writing and polishing tone

**[Humanize KR](https://github.com/epoko77-ai/im-not-ai)** · A skill made for Claude that smooths the awkward translation-ese and robotic sentence lineups typical of AI-written Korean into natural human speech. It leaves facts and numbers alone and only evens out the texture of the sentences. We lean on it to polish drafts before posting to this blog too.

## Claude settings and a token diet

**DCinside [AI Dev Gallery post](https://gall.dcinside.com/mgallery/board/view/?id=aidevelop&no=4369) and [AI Usage Gallery post](https://gall.dcinside.com/mgallery/board/view/?id=ai_utilize&no=137000)** · Posts where veteran Claude Code users generously spill their practical setups for saving tokens. They hold solid, meaty tips like running the automatic conversation summary early and not summoning helper agents carelessly. How I had Claude read these posts, fact-check them against the official manual, and apply them to our environment is written up in detail in the [saving tokens post](/en/2026/10/27/ai-tokens/).

## Pixel art and graphics tools

**[Pixel Refiner](https://pixel-refiner.app/)** · A handy free web tool that snaps "pixel in name only" art, which the AI only imitated convincingly, onto a **real pixel grid**. You just visit the site and drag your image file onto it with the mouse, and you're done. I compared it side by side with the touch-up feature of the asset workbench we built ourselves, and the results were neck and neck. For anyone without their own workbench, it's my number one recommendation.

<figure><img src="/assets/img/posts/reference-sites/refiner.webp" alt="Three AI-drawn characters compared side by side: original, Pixel Refiner, workbench polish" loading="lazy"><figcaption>From the left: the AI original, the Pixel Refiner result, and our own workbench result. The messy pixel lines get cleaned up neatly.</figcaption></figure>

**[claude-pxl](https://github.com/augusto-scarvalho/claude-pxl)** · A tool that stamps out pixel art and frame animations from a short bit of code, designed from birth to be easy for an AI to handle. I handed it to Claude and asked for a fire magic effect, and at first the pastel flames got buried in the bright notebook background color and were hard to see. Just adding an option for a dark outline instantly gave us game-worthy quality.

<figure><img src="/assets/img/posts/reference-sites/pxl-fire.webp" alt="Five fire magic scenes. Top is default colors, bottom is notebook colors with an outline" loading="lazy"><figcaption>Top is the fire magic with default settings, bottom is the version with an outline added to fit the notebook background.</figcaption></figure>

**[Pixel Shading Glossary](https://tuiella.github.io/pixel-glossary/)** · A Korean visual dictionary that explains the technical terms for light, shadow, and color in pixel art with cute before-and-after pictures. If you just tell the AI "make the shadows look more natural," it brings back something off every time, but if you pinpoint it with the exact terms from this dictionary (for example, no pillow shading, apply hue shifting), the results come out surprisingly consistent. I even had Claude memorize this dictionary whole and turn it into a checklist for reviewing art.

## Treasure chest of effect ideas

**[Opus 5.5 video collection](https://github.com/yihui-dev/awesome-opus5-5-videos)** · A repository gathering 703 videos of results from having AI write animations in code, along with the actual prompts. When it's frustrating to explain an effect that only exists in your head, you can find a video with a similar feel here and borrow the prompt wording, which gets you there directly. The analog effect in our game where pencil lines jitter slightly came from a hint found right here, and I applied it in the [video-making post](/en/2026/10/27/ai-clip/).

## Three-line summary

1. When you find a good tip site, first toss it to the AI to cross-check against the official docs, then take only the real gems.
2. For AI pixel art, line up the grid with Pixel Refiner, stamp out effects with claude-pxl, and hold quality with the glossary checklist, and you're in good shape.
3. I'll keep adding to this post whenever I find tools that earn their keep in real use.
