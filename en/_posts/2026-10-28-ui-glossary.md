---
layout: post
title: "I Tossed Over One Link and Six Parts of the Screen Changed"
date: 2026-10-28 10:20:00 +0900
category: ai-work
series: ai-tips
tags: [AI collaboration, screens, mockups, decisions]
image: /assets/img/posts/ui-glossary/five.webp
summary: I handed Claude a link to a game UI glossary. It compared every entry against our screens, picked out six missing pieces, shot mockups, and then built them into the real game. Here's what I learned along the way.
---

When you're building game screens, you keep saying things like "you know, that thing where the screen edges turn red when you get hit." I didn't know the name, so the explanation got long, and the longer the explanation, the more off-target the AI's result.

Then I found a Korean [UI glossary](https://tuiella.github.io/ui-glossary/) that gives names to about 140 game UI parts. I tossed the link to Claude with a single line: **"Check if there are any ideas I could use in my project."**

<figure><img src="/assets/img/posts/ui-glossary/talk-en.webp" alt="A table of four scenes, link, mockups, measuring and go, showing what I said, what Claude answered and what changed" loading="lazy"><figcaption>The conversation that turned one link into six changes on screen.</figcaption></figure>

## The whole dictionary as a checklist

Claude read the glossary front to back and searched our game's code for each term. The answer came back in three piles: **things we already have, things that don't fit this game, and things that are actually missing.**

Choices that write themselves out one by one, and a success-chance preview, were already there. Crosshairs, battle passes and gacha animations got dropped, since they belong to real-time shooters or pay-to-play games. Closed captions for sounds clashed with my old rule of "no onomatopoeia," and Claude filtered that out on its own. Seeing it remember a decision from weeks ago was oddly heartwarming.

Six were left: a notebook edge for when you're near death, shadows of monsters you haven't met, a proper confirm dialog, word-explanation notes, a cut-in for big moves, and buttons that are easier to tap.

<figure><img src="/assets/img/posts/ui-glossary/danger.webp" alt="Before: only the health chip turns red. After: red hatching spreads along the notebook edges" loading="lazy"><figcaption>The glossary's "damage vignette," notebook style. When health runs out, red pencil hatching creeps in from the edges.</figcaption></figure>

## Pick from pictures, not words

Choosing from a list alone gave me no feel for it. So I said, **"Show me mockups of what it looks like with them in."**

Without touching the code, Claude launched the actual game, laid each mockup over it temporarily, and brought back before-and-after shots. Left is now, right is with the change, like a makeover photo. Because they sat on the real game screen, I could see right away what it would be like in our game. My only job was flipping through photos and nodding.

<figure><img src="/assets/img/posts/ui-glossary/confirm.webp" alt="A gray default browser confirm box next to a notebook-note confirm that lists what gets erased with red Xs" loading="lazy"><figcaption>The gray confirm box that broke the notebook mood became a notebook note. The button says what it actually does, like "Erase all," instead of "OK."</figcaption></figure>

## A ruler instead of a hunch

The sixth one, "easy to read," was different from the other five. You can't show it in a picture; you have to measure it. Claude measured every button size and text contrast on the phone screen and came back with numbers.

22 buttons were too short for a finger. The recommended height is 44px, and the header chips were 24px, barely more than half. **The screen looked fine to me, so without the numbers I'd have walked right past it.** The fix was clever too: the buttons look exactly the same, and only the invisible area your finger can hit got bigger.

<figure><img src="/assets/img/posts/ui-glossary/measure.webp" alt="Check results on the phone screen: buttons too small to tap in pink dashes, low-contrast text in orange boxes" loading="lazy"><figcaption>Pink dashes are buttons too small to tap; orange boxes are text that blends into the background.</figcaption></figure>

## "Go ahead, in order."

After seeing all the mockups, that was all I said. Claude built numbers 1 through 6 into the real game and shot fresh phone and PC screens. When health drops, the edges darken and fade like breathing, and when you throw a firebomb, a torn paper strip with the hero's face swoops across the scene.

<figure><img src="/assets/img/posts/ui-glossary/five.webp" alt="Five phone screens: danger edge, monster shadows, confirm note, word note, cut-in" loading="lazy"><figcaption>Five of them, now in the real game. The sixth (tap area) is supposed to be invisible.</figcaption></figure>

<figure class="narrow"><video src="/assets/img/posts/ui-glossary/pulse.mp4" poster="/assets/img/posts/ui-glossary/pulse.jpg" controls muted playsinline preload="none"></video><figcaption>The edge at 1 health. The lower it goes, the wider and faster it pulses.</figcaption></figure>

## Three-line summary

1. When you find a good glossary, have the AI compare it line by line with your project. What you have, what doesn't fit and what's missing sort themselves out.
2. Before choosing, get mockups laid over the real screen. Deciding gets several times faster than with a list of words.
3. For things that are hard to judge by eye, like readability, ask it to measure. Numbers turn up even on screens that look fine.
