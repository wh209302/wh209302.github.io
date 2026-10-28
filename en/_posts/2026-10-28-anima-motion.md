---
layout: post
title: "Same Face, Walking and Swinging: Pixel Motion Sprites with Anima"
date: 2026-10-28 11:40:00 +0900
category: ai-lab
series: comfyui-lab
tags: [AI art, ComfyUI, pixel art, test log]
image: /assets/img/posts/anima-motion/talk-en.webp
summary: I tested three routes to see whether AI can make pixel sprites of one character walking and swinging a pitchfork with the same face every frame. The reference adapter I brought in at the end flipped the result.
---

The most maddening moment in AI-made game sprites is when the character shows up with a new face every frame. The girl with a bob in frame 1 has bangs in frame 2, and by frame 3 her apron has changed color. This had nothing to do with the current game; I just wanted to know if it could be done, so I asked Claude.

<figure><img src="/assets/img/posts/anima-motion/talk-en.webp" alt="Five scenes (ask, sheet, edit, tip, adapter) laid out as what I said, Claude's answer, and what changed" loading="lazy"><figcaption>A test that started with one question and ended with one link.</figcaption></figure>

## "Wait, is Anima a checkpoint?"

My question, translated: **"Can we combine the Anima model with pixel checkpoints or LoRAs in ComfyUI to get motion sprites of a consistent character?"**

Claude's first answer was that you can't just combine them. Anima is an image model that's great at anime styles, but its skeleton is different from the SDXL pixel models I used before, so the parts don't swap in. So I asked back, "So we don't use a checkpoint? Is Anima the checkpoint...?" Exactly: Anima itself is the base model, the thing that sits in the checkpoint slot. Civitai already had a few Anima-specific pixel and sprite LoRAs, and Claude laid out three routes with them.

## Route 1: draw them all in one image and you get twins

The first method stacked an RPG battle-sheet LoRA with a pixel style LoRA and **had the model draw the same girl in 50-some cells of a single image**. Drawing everything in one picture leaves the model no room to imagine each cell separately. The result was startlingly uniform: face, kerchief, apron patch, colors, even pixel size were twins across cells. At 55 seconds per sheet, about 1 second per frame, it was also the fastest.

<figure><img src="/assets/img/posts/anima-motion/sheet.webp" alt="A single sheet with the same farm girl drawn in 50-some cells doing different motions" loading="lazy"><figcaption>Fifty girls on one sheet. All the same person.</figcaption></figure>

The problem was motion. Following RPG battle-screen conventions, "walk" was breathing in place and "attack" was a small arm thrust. It never picked up a weapon like a pitchfork at all.

## Route 2: big poses, wandering direction

The second method was the one that worked well in my last tests: make one base image and have an edit model (Qwen-Image-Edit) "change only the pose" for each frame. This time the motion was big. The legs swapped front and back, and lifting the pitchfork and slamming it down read at a glance.

But now the girl turned whichever way she liked: right in one frame, facing us in the next, then her back. The pitchfork's length changed the fit scale per image, so her height jumped around too. It felt like I had to pick either consistency or big motion.

## One link flipped the result

That's when I tossed in a link: "By the way, there seems to be this technique for keeping consistency in Anima, too." It was Anima Ref Adapter, which keeps a character's look from one reference image while the prompt changes the pose.

Claude didn't install it right away; it asked first, since this meant putting someone else's code on my PC. After I said "you have my OK", it installed it, checked that the code made no network calls or external launches, and **fed one cell from the Route 1 sheet in as the reference**.

<figure><img src="/assets/img/posts/anima-motion/refadapter-raw.webp" alt="Four walk frames redrawn from one sheet cell as reference, with the same face and outfit and big strides" loading="lazy"><figcaption>The girl from the sheet finally takes real strides.</figcaption></figure>

It got the best of both routes. All four frames have the same face, kerchief, apron, side view and size, while the legs clearly swap. Running the three routes side by side in the video makes the difference obvious.

<figure><video src="/assets/img/posts/anima-motion/walk.mp4" controls muted playsinline preload="none" poster="/assets/img/posts/anima-motion/walk.jpg"></video><figcaption>From left: one sheet, edit, reference adapter. Only the right one really walks.</figcaption></figure>

It wasn't perfect. Even when told "face right" she mostly faced left, so the frames had to be flipped, and it drew a ground line under her feet nobody asked for. In the attack the pitchfork had to be handed to her fresh each time, so its shape changed a bit per frame, and with the Route 2 image as reference the apron patch turned into a flower print. At about 55 seconds per frame it was also the slowest.

<figure><video src="/assets/img/posts/anima-motion/attack.mp4" controls muted playsinline preload="none" poster="/assets/img/posts/anima-motion/attack.jpg"></video><figcaption>Attack comparison. The girl on the right hoists the pitchfork high over her head.</figcaption></figure>

There was one small accident along the way. The pixel cleanup step measured the grid size separately for each frame, so in some frames the girl shrank. Using the grid measured on the first frame for every frame fixed her height.

## So how should you use it

Here are the three routes side by side.

1. One sheet: best consistency, small motion, fastest at 1 second per frame.
2. Base image + edit: big motion but wobbling direction and size, about 31 seconds per frame.
3. Base image + reference adapter: both consistency and big motion, about 55 seconds per frame.

The best combo was **settling the character with a one-image sheet, then feeding one of its cells to the reference adapter for big motions**. Anima, the adapter and the sprite LoRAs are all non-commercial, though, so they can't go straight into a game I sell. I'm filing this away as a proven possibility and will pull it out again when a commercial route opens up.

## Three-line summary

1. If you want one character drawn identically across many cells, have the AI draw them all in one image.
2. If you also want big motions, feed one cell of that sheet back in as a reference and redraw.
3. When installing someone else's tool on your PC, have the AI ask permission first and check what the code does afterward.
