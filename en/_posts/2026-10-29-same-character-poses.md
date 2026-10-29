---
layout: post
title: "Pose by Words, Face by Picture: Drawing One Pixel Character in Many Poses"
date: 2026-10-29 15:00:00 +0900
category: ai-lab
series: comfyui-lab
tags: [AI art, ComfyUI, pixel art, test log]
image: /assets/img/posts/same-character-poses/poses.webp
summary: I tested whether one pixel character I liked could be drawn attacking, casting and knocked down. I was ready to haul out Blender poses, but a single line of text won.
---

No sooner had I narrowed the art style down than the next worry showed up. Game characters don't just stand there. They swing swords, cast spells and occasionally end up flat on the floor, and when you ask an AI to change the pose, the face and outfit change right along with it. So this time the challenge was **keeping the character I picked and changing only the pose**.

<figure><img src="/assets/img/posts/same-character-poses/talk-en.webp" alt="Table of six scenes, New toy, The Blender idea, Order question, Picking styles, One line of consent and V2 dropped today, with what I said, Claude's answer and what changed" loading="lazy"><figcaption>A day of back-and-forth, boiled down to six scenes.</figcaption></figure>

## "Check if we can use it here"

It started with a toy I found online: a reference adapter for Anima that takes one picture and redraws the same character in a new scene. We had actually used it once in the [earlier motion test]({% post_url 2026-10-28-anima-motion %}), and Claude pointed out it was already installed on my PC.

My ambitions were a step further ahead, though. I figured I could build a pile of poses in Blender, feed them in as references and let everything run automatically. **The big picture was a program that collects poses, where picking one just makes the drawing happen.**

Claude's answer was half yes, half no. The adapter is built to read only *who* is in the picture and deliberately ignore the pose. To feed a pose as an image, we'd need a separate tool that takes a depth map (a grey picture where near things are bright and far things are dark).

## "Do I set the pose first, or do you combine them?"

This is where I got confused. Do you pose first and then apply the adapter, or the other way round? The answer was **not an order but a single pass**. The reference image says "draw this person", the depth map says "stand like this", and the AI looks at both while drawing one image. Think of handing an animator a headshot and a storyboard at the same time. The catch was that nobody had confirmed the two tools work together, and that became the heart of the test.

I also settled the style question while I was at it. Looking back at the old comparison sheet: "t08 looks best, but the plain base s00 looks good too." So both ran under identical conditions. t08 has glossy eyes and hair and busier outfit patterns; s00 is flat and simple and reads well on a small screen.

<figure><img src="/assets/img/posts/same-character-poses/styles.webp" alt="Elf archer, princess, cat thief and old wizard drawn side by side in the s00 and t08 pixel styles" loading="lazy"><figcaption>Left is s00, right is t08. Both have clean dots; the right one is a notch flashier.</figcaption></figure>

## Consent, in my own words

Something funny happened midway. I said it was fine to install the depth tool, and the install got blocked anyway. Because my approval went through Claude before reaching the PC, the PC's automatic safety check decided it wasn't something I had said myself. So I typed one more line into the chat: "You can install the depth ControlNet node and weights."

It felt like a hassle at first, but it's a good safeguard. **Putting someone else's code on my computer can't be settled by AIs passing messages to each other.** Claude also skimmed the code before installing to make sure there were no surprise network calls or install scripts.

## "I heard it updated to V2, did you check?"

In the middle of testing, word came of an adapter V2. It turned out to have been released at noon that very day. The training set had grown from 300 characters to 2,300 and it was nearly twice as fast, so we switched and reran. On my PC, one image went from 55 seconds to 33. Sadly, the author noted that development has stopped for lack of funding.

The results were pretty clear. Without the adapter, adding a pose to the character description meant the elf **aimed her bow in all four panels**, whether told to attack, cast a spell or fall down. The "aiming a bow" in her original description simply beat the pose instruction. With the reference adapter and the pose written as plain text, attack, cast and lying-on-the-floor all came out as asked, with the face, hair and outfit almost unchanged.

<figure><img src="/assets/img/posts/same-character-poses/poses.webp" alt="Elf archer and princess compared across reference, first adapter, V2 and text-only, each in stand, attack, cast and fallen poses" loading="lazy"><figcaption>The bottom row of each character is text only, no adapter. The elf never lets go of that bow.</figcaption></figure>

## No need to go all the way to Blender

So how did the depth maps I'd been looking forward to do? Happily, the adapter and the depth tool didn't fight. They kept the character while following the standing shape, the lean and the lying pose. But depth maps made from a simple mannequin were too blunt to place arms and weapons. **In the end they weren't much better than writing the pose in text.** Using the depth map alone without the adapter even produced two people in one picture.

<figure><img src="/assets/img/posts/same-character-poses/depth.webp" alt="Four mannequin depth maps on top, then the elf archer and princess compared with text pose, adapter plus depth, and text plus depth" loading="lazy"><figcaption>Top row: the mannequin depth maps. The silhouette follows, the arms don't quite.</figcaption></figure>

So the default for now is "reference adapter V2 + pose in text". Blender poses go back on the shelf until we need depth maps crisp enough to show arms and weapons. Two chores remain: a glowing blob that appears in the hand in every casting pose, and a weapon that keeps changing from scythe to staff to sword. Next time I'll lock in one style and draw a pose set with the weapon spelled out.

## Three-line summary

1. To draw one character in many poses, split the job into one reference picture plus one line of pose instead of piling the pose onto the character description.
2. Before bolting on more tools, check how far plain text gets you. The fancier gear doesn't always win.
3. When you hear a tool you use has a new version, ask the AI to check it right away. This time that one question made things nearly twice as fast.
