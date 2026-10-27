---
layout: post
title: "Picking the Game's Art Style: The Story of Getting Lost Three Times"
date: 2026-10-27 12:30:00 +0900
category: ai-work
series: ai-tips
tags: [AI art, art style, license, ComfyUI]
image: /assets/img/posts/ai-art/talk-en.webp
summary: I tried to describe the art style I wanted in words alone and ended up tearing up the style three times in a week. Here's what wrestling with AI taught me about finding my own taste.
---

While generating game characters with AI, I tore up the art style three times in just a few days. Looking back, the reason I got lost was always the same: I kept trying to explain the vague feeling in my head **in words**.

<figure><img src="/assets/img/posts/ai-art/talk-en.webp" alt="Table of the five scenes up to the art style change, with date, what I said, Claude's answer, and what changed" loading="lazy"><figcaption>The tearful chat log from trying to settle on one art style with AI.</figcaption></figure>

## "It's just so... too Western..."

The first character the AI proudly brought me was classic Western fantasy, with tightly packed muscles and shading. I wanted that Japanese indie game feel with a big head and sparkling eyes, but when I tried to explain it as a prompt, the words wouldn't come out.

All the feedback I managed was vague stuff like **"too Western"** and **"make it a bit cuter,"** and of course no matter how many times I regenerated, the art stayed in place.

In my frustration, I tossed over one example image with the feel I usually like, and suddenly we started understanding each other. Claude picked that image apart, worked out the colors, the head-to-body proportions, and the facial features on its own, and regenerated to that standard. One image beat a hundred words.

## Oops, I couldn't sell that art

On a day when I was thrilled that the art was coming out so pretty, Claude carefully poured cold water on it.

It had checked the terms of the pixel art model we were happily using, and it turned out to be **a license that doesn't allow commercial use without the original author's permission.** I'd assumed that as long as the art came out pretty, that was that, and never even glanced at the license. If I'd kept using it without knowing and later released the game as a paid product, I'd have had to throw hundreds of images in the trash overnight.

Since that day, before downloading any new image model, Claude always reports its license terms in a table. When I said "I haven't decided whether to release it as paid yet, so quality comes first for now," it came up with a wise compromise: use non-commercial models for testing too, but stick a red tag on them in the table so we don't get confused later.

## Only after tasting all 32 flavors

At one point, pixel art felt stuffy, so I swung the wheel over to smooth, regular illustration. But once I'd generated it, that wasn't satisfying either.

When I wobbled and couldn't make up my mind, Claude went all in and **generated the same character in 32 versions, changing only the art style, and laid them all out on one sheet.** The character settings, pose, and size were locked identical, with the "art style" as the only variable, a kind of tasting counter.

<figure class="narrow"><img src="/assets/img/posts/ai-art/styles-b.webp" alt="Comparison chart of the same three characters in ink line, soft pastel, felt doll, and 3D figure styles" loading="lazy"><figcaption>A slice of the 32-style tasting counter. We tried everything from ink pen lines to wool felt dolls to 3D figure style.</figcaption></figure>

I crossed my arms and stared at the 32 for a long while, and arrived at a conclusion that was both anticlimactic and certain.

**"Forget all 32, the pastel pixel I saw at the very start is the prettiest."**

At a glance it looks like a long detour for nothing, but it was actually a necessary step. Because I'd seen the other possibilities with my own eyes and ruled them out, I finally became 100% sure of the first style. If I'd charged ahead with the first style without this comparison, I'd have spent the whole project unable to let go, thinking "ah, maybe I should've just gone with illustration?"

The few that survived as final candidates, I decided on by placing them on an actual game background. Art that looks pretty alone on a white background and art that blends into the game screen turned out to be two entirely different things.

<figure><img src="/assets/img/posts/ai-art/sticker-abcd.webp" alt="Game screen comparing four sticker methods applied to the same scene" loading="lazy"><figcaption>I put four character sticker treatments on the real game screen and held the final interview.</figcaption></figure>

## Same face, different poses

Once the style was settled, the next homework was waiting right away. One character has to take several poses, like standing, casting a spell, and hurt, but whenever I asked for a fresh drawing per pose, a different person with the same name was born each time.

After experimenting back and forth, Claude found that **"an editing approach that takes one standing image as the original and only fixes the posture"** keeps the face and outfit the most consistent. And lately it has evolved a step further, to drawing the head and body separately and assembling them like Lego. That tearful kit-style asset story continues in the [asset workbench post](/en/2026/10/27/ai-assets/).

<figure><img src="/assets/img/posts/ai-art/pose-edit.webp" alt="Working, spellcasting, hurt, and collapsed poses made by editing one standing character" loading="lazy"><figcaption>Keeping the face and clothes of the original character on the far left, only the working, spellcasting, injured, and fainted poses were newly molded.</figcaption></figure>

## Three-line summary

1. Don't struggle to explain the art style you want in words. Showing one reference image you like is a hundred times faster.
2. Only by laying several art styles side by side on one screen can you be truly sure of your taste, with no regrets.
3. Have the AI check the commercial-use license of an art model before you get attached to it. Otherwise you'll have to throw it all out later.
