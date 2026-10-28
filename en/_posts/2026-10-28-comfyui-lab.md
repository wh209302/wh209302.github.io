---
layout: post
title: "ComfyUI Picture Factory Test Log: What Survived Sixteen Runs"
date: 2026-10-28 11:00:00 +0900
category: ai-lab
series: comfyui-lab
tags: [AI art, ComfyUI, pixel art, LoRA, test log]
image: /assets/img/posts/comfyui-lab/talk-en.webp
summary: I ran sixteen tests in two days on a ComfyUI picture factory set up on my own PC. Here's what worked, what didn't, and what's worth pulling out again for the next project.
---

I installed ComfyUI on my PC and let Claude drive it remotely so I could generate my own game characters. Two days and sixteen test runs later, the game's art is now made with a different tool. That doesn't make the tests a waste, though. I'm writing them up like lab notes **so the next game doesn't repeat the same digging**. Every run used a single RTX 4070 Ti (12GB).

<figure><img src="/assets/img/posts/comfyui-lab/talk-en.webp" alt="Five scenes (pixel, shrink, walk, pose, LoRA) laid out as what I said, Claude's answer, and what changed" loading="lazy"><figcaption>Sixteen runs squeezed into five scenes. Grey boxes are failures, green ones are keepers.</figcaption></figure>

## Run 1: the winning model couldn't be sold

The first order was simple: I wanted pixel-art characters. Claude fed the same prompt to four SDXL pixel models and lined up an herbalist, a goblin and a cave from each. With everything on one tasting tray, the choice was easy. One model had flat color areas and crisp outlines and beat the rest by a mile.

Then we read that winner's terms: **you can't sell images from it without the creator's permission**. From that day on, every test sheet ended with a license column. Pretty pictures still get me excited, but now the prettier the picture, the faster I check the fine print.

One bonus lesson: write "sprite sheet" in the prompt and the models happily line up ten or twenty people. So we switched to one character per image by default.

## Shrinking to 18×22 erased the face

To fit the game, the art had to shrink to fingernail size. The problem was that at 18×22 cells the face melted into a single skin-colored blob. The hood and clothes still read fine, but with no eyes it looked more like a ghost than a character.

While zooming into the originals, Claude spotted something fun. The pixel models' output looks like a big picture, but **it's actually already pixel art drawn on a grid of roughly 8px cells**. So instead of forcing it smaller, you find that grid and read one representative color per cell. The first version squeezed the colors down to 16 before reading the cells and lost the eyes and pink cheeks again; flipping the order kept even one-cell eyes alive.

<figure><img src="/assets/img/posts/comfyui-lab/native-grid.webp" alt="The original herbalist, the grid-recovered version, and a half-size version side by side" loading="lazy"><figcaption>Far left is the AI original, next to it the recovered grid. The small ones on the right check whether the face survives at half size.</figcaption></figure>

## Is "just move the legs" really that big an ask?

I assumed a walk cycle would be easy since only the legs change. We tried img2img, which redraws from the first frame, and raised how far it may drift (denoise) to 0.5 and 0.7. As you can see, the cloak pattern shifted a little and the legs didn't budge.

<figure><img src="/assets/img/posts/comfyui-lab/img2img-walk.webp" alt="The same herbalist redrawn with img2img, legs in nearly the same pose every time" loading="lazy"><figcaption>Told to "walk" three times, she stood at attention three times.</figcaption></figure>

Next we brought out ControlNet poses, which force a pose with a skeleton drawing. But the pose detector didn't even recognize a chibi with a head half the size of its body as a person. Even when we drew a chibi-proportioned skeleton by hand, the legs stayed put. That's where we called it: **for a walk that moves a pixel or two, hands are faster than AI**.

## A new art style, and the edit model shone

Meanwhile the game's look changed to smooth pastel stickers (the saga is in [Picking the Game's Art Style]({% post_url 2026-10-27-ai-art-style %})). The homework changed too: now the same character needed to swing, pray, get hurt and fall down.

The fixer here was Qwen-Image-Edit, an image editing model. Instead of drawing from scratch, you give it one standing picture and say "change only the pose". In 20–25 seconds per image, **the pose changed while face, clothes, colors and style stayed almost the same**. It was the biggest win of the sixteen runs.

<figure><img src="/assets/img/posts/comfyui-lab/qwen-pose.webp" alt="One standing farm girl turned into swing, pray, hurt and fallen poses" loading="lazy"><figcaption>Only the leftmost image was given; the other four are edits. Please forgive the kerchief that refuses to fall off.</figcaption></figure>

## I baked my own style LoRA in 26 minutes, but

Last, I got greedy. What if we just taught the model the style of the example art I liked? A style LoRA trained on 13 examples was baked in 26 minutes; running it to 2,100 steps showed about 1,400 steps was best. For version 2 we added 10 images made with the edit model and tags like "two heads tall" and "three-quarter view".

<figure><img src="/assets/img/posts/comfyui-lab/style-lora.webp" alt="Three example images compared with a girl, goblin and dwarf from style LoRA v1 and v2" loading="lazy"><figcaption>Top row is the examples, the two rows below are LoRA output. The colors match, but they keep getting taller.</figcaption></figure>

It picked up the colors and details like patched cloth pretty well, but the characters kept growing to 2.5–3 heads tall and the lines came out darker than the examples. Thirteen images apparently weren't enough to teach the stubborn rule of "big head".

## If I set up the factory again

Around then I decided to move image generation to another tool and paused the ComfyUI tests. If I build the factory again for the next game, here's the order I'd follow.

1. Put the licenses in a table before choosing a model.
2. Don't shrink pixel art; find and recover its original grid.
3. For many poses of one character, edit one image instead of drawing new ones.
4. Bake a style LoRA only after collecting dozens of examples.

Next time: I brought ComfyUI back out this week to see whether it can make a pixel sprite of one character walking and swinging.

## Three-line summary

1. Pixel models already draw on a grid, so recover that grid instead of shrinking.
2. For many poses of one character, editing one image is far more consistent than drawing new ones.
3. Always add a license column to your test results. The winning model may be one you can't sell.
