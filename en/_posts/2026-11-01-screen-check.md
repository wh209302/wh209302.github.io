---
layout: post
title: "I keep seeing clipped text here and there"
date: 2026-11-01 15:20:00 +0900
category: notebook-rpg
tags: [AI collaboration, screens, phone, automation, animation]
image: /assets/img/posts/screen-check/effects-en.webp
summary: Claude shot the game at nine screen sizes to hunt down clipped text and misplaced buttons on phone and PC, then added four mood effects, from rain puddles to a dying torch.
---

Every now and then the game looked a little off on my phone. An origin cut short with a "…" next to the hero's name, a button on PC that had wandered off somewhere. Each one was tiny, but once you notice them you can't stop noticing them. So I handed the whole thing to Claude, and while I was at it I asked whether there was room for more mood effects like the cave darkness I've grown fond of.

<figure><img src="/assets/img/posts/screen-check/talk-en.webp" alt="Five scenes from the screen check, laid out as what I said, what Claude did, and what changed" loading="lazy"><figcaption>From one request to four new mood effects, in five scenes.</figcaption></figure>

## A checker before the eyeballs

My request went roughly like this: when I look at the mobile or desktop UI I keep seeing clipped text and weird layouts, so check carefully and fix them.

Claude didn't dive straight into fixing. First it built **a checker to scan screens instead of a pair of human eyes**. It opens 34 screens (the cover, birth, fights, caves, the map, the last page) at nine sizes from a small phone to a big monitor, takes a shot of each, and flags any text spilling out of its box or sitting on top of other text. It's like buying nine phones, lining them up on the desk and squinting at each one, except a machine does the squinting.

<figure><img src="/assets/img/posts/screen-check/sizes.webp" alt="The same game scene shown at nine sizes: three phones, a phone in landscape, two tablets, a laptop, a PC and a large screen" loading="lazy"><figcaption>Lay the same scene out at nine sizes and the hidden problems show up.</figcaption></figure>

The first pass came back with 380 issue groups. Not all of them were bugs, of course. Stamps I stuck on at a jaunty angle and giant monsters bursting out of the notebook also count as "overlaps". After weeding those out screenshot by screenshot, the real fixes were left.

## The choices were hiding under the bag

The most annoying one on PC was on the right-hand page. When a question note, the dream picker and a hint all showed up at once, the to-do column grew long and its bottom slid under the "My bag" slots. The buttons you needed were buried under your own bag, and players would have been left wandering around wondering why.

<figure><img src="/assets/img/posts/screen-check/pc-en.webp" alt="Right-hand page on PC, before and after. Before, the choices slide under the bag slots; after, they stop above them" loading="lazy"><figcaption>The to-do column now stops above the bag and fades out a little when there's more below.</figcaption></figure>

Now only the to-do column scrolls, with a fade when there's more below. At laptop size (1280×650) the "Write the next one" button on the last page had been pushed into an invisible third column, so that page now splits evenly into two. Finishing a whole life and not finding the button to open the next notebook would have been a pretty big blunder.

## "Human · Human serf"?

On phones the trouble was the profile line under the name. On a 360px phone it showed "Human · 20 …" and the origin got chopped off. While staring at the clipped text Claude found a bonus problem: the origin name already contained the race, so the line was saying **the same word twice**, as in "Human · Human serf".

<figure><img src="/assets/img/posts/screen-check/phone-en.webp" alt="English screen on a 360px phone, before and after. Before, the profile line is clipped and station names overlap; after, the whole line shows and nothing overlaps" loading="lazy"><figcaption>In English even the station names on the route board were elbowing each other.</figcaption></figure>

On narrow phones the profile line now drops to a wide row under the name and the date, and the doubled race name is gone. The English route board shortens "5 days 23 hours" to "5d 23h", and standing a tablet upright no longer squeezes the notebook down to phone width.

## Dark caves, and a pencil that shakes when you're scared

Now the fun part. All I said was that I liked how caves go dark except the torchlight and how the weather changes the look. Claude went through the effects we already had and came back with **four moments that had nothing going on**.

<figure><img src="/assets/img/posts/screen-check/effects-en.webp" alt="Four new mood effects: puddles and rain splashes, winter breath, fear pencil hatching at the screen edges, and a shrunken torch circle in a dark cave" loading="lazy"><figcaption>Rain splashes, winter breath, fear hatching and a dying torch.</figcaption></figure>

1. **Rainy days**: outdoors, raindrops splash on the ground and puddles glint. Butterflies fluttering through the rain got cleaned up while we were there.
2. **Cold days**: in snow or winter, a white puff of breath comes out of the hero's mouth.
3. **When you're scared**: as the fear gauge climbs, the screen edges darken with pencil hatching that tightens like a heartbeat.
4. **Down to the last torch**: the bright circle in the cave shrinks and the flame flickers like it's about to go out.

As a bonus, the chicken that used to sprint across clear night skies is now a shooting star. A chicken at night just felt wrong.

## When the torch is down to its last use

My favorite of the four is the torch. The first version was so subtle you could barely tell anything had changed, but Claude watched its own recording and made it darker on its own.

<figure><video src="/assets/img/posts/screen-check/torch.mp4" poster="/assets/img/posts/screen-check/torch.jpg" controls muted playsinline preload="none"></video><figcaption>With one torch use left, the light circle shrinks to 70% and the flame wavers. Time to think about heading out.</figcaption></figure>

## "Run it again on high effort"

After sending the request I added a single line: run it again on high effort. Claude has a setting for how much care it puts into thinking, and I asked for it to go up. From then on Claude **re-shot the screen after every fix to make sure it really held**, and ran the full check twice more.

<figure><img src="/assets/img/posts/screen-check/count-en.webp" alt="Issue groups found by the checker: 380 on the first pass, 125 on the third" loading="lazy"><figcaption>From 380 to 125. Most of what's left is decoration that overlaps on purpose.</figcaption></figure>

If you take an AI's "fixed it" at face value, things easily end up half fixed. **Asking it to re-shoot the screen after each fix** was the most useful trick I picked up this time. The checker stays in the repo, so it can run again whenever the screens change a lot.

Next I'll pick from the effects that only made the shortlist this time: a silhouette flashing when lightning strikes, dust falling from the ceiling when a cave gets noisy, a lantern circle on night roads, and a blurry screen when you're drunk or poisoned.

## Three-line summary

1. Before hunting broken screens by eye, have the AI build a checker that shoots every screen at several sizes.
2. When the AI says "fixed", ask it to re-shoot the screen and show you.
3. For mood effects, a single "I like this kind of thing" is enough for it to find the empty moments and fill them.
