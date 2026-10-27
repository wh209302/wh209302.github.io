---
layout: post
title: "Photos and Videos Instead of \"Fixed It!\""
date: 2026-10-27 12:50:00 +0900
category: ai-work
series: ai-tips
tags: [AI collaboration, screens, mobile, Playwright]
image: /assets/img/posts/ai-screens/before-after.webp
summary: AI would cheerfully announce "All screens fixed!", and then I'd open it on my phone to find clipped text and buttons that had run away from home. This is the peace I found after making it report with photos and video instead of words.
---

In the early days, Claude would proudly announce **"I've cleaned up the screen!"** and I'd open it on my phone, all excited, only to find text cut in half or buttons piled on top of each other in the wrong place. A small disaster, and not a rare one.

There were no errors in the code, so the AI honestly believed it was done. What my eyes saw was something else entirely. So I changed the rule. For any task that touches the screen, the AI has to open a virtual browser itself, take captures, and **report with photos and a screen recording attached**.

<figure><img src="/assets/img/posts/ai-screens/talk-en.webp" alt="A table of four scenes about switching from 'fixed it' to photos and video: what I said, Claude's answer, what changed" loading="lazy"><figcaption>How the "no more done-reports in words only" rule came to be, as a conversation.</figcaption></figure>

## No photo, no "done"

The first rule I nailed down was just one. **"If you fixed a screen, bring captures at phone size and at PC size. No photo proof, no done-report."**

A screen that looks perfect on a PC falls apart on a narrow phone so often that I made the two sizes a mandatory pair.

That one rule cut way down on the ping-pong where I check on my phone, shout "hey, this is broken!", and send it back. Funnily enough, Claude started **spotting the breakage itself while taking the report photos, quietly fixing it with a bit of embarrassment, and only then coming back with a clean picture**.

<figure><img src="/assets/img/posts/ai-screens/pc.webp" alt="Game screen captured at PC size. Scene and log on the left, route map and to-dos on the right" loading="lazy"><figcaption>The PC-size proof shot Claude took and handed over. A phone-ratio capture always comes along as a pair.</figcaption></figure>

## Plastic-surgery style: before and after, side by side

Once I looked at a redesigned screen and bluntly said, **"Ugh, this looks lame. Make it more polished."**

Since then, Claude doesn't just bring the finished result. It **stitches the Before and After photos into one picture, side by side**. Looking at the new screen alone, I often can't remember what's actually better than before. With before and after next to each other, I can rule in three seconds: "Oh, way better! Approved."

<figure><img src="/assets/img/posts/ai-screens/before-after.webp" alt="A side-by-side comparison of the phone screen before and after the fix" loading="lazy"><figcaption>The phone screen before (left) and after (right). Put side by side, there's no time left to agonize.</figcaption></figure>

## Anything that moves comes as a video

The first time I added the animation where the notebook flips open when the game starts, the cover and the pages moved awkwardly, like two separate acts. So I asked: **"The cover and the paper are moving separately. Make it as realistic as possible, like turning a real notebook."**

From then on, Claude started recording the phone screen as a video (mp4) for its reports. You can never judge how an animation feels or how its timing works from a single still screenshot, so video reports became a must.

<figure class="narrow"><video src="/assets/img/posts/ai-screens/book-open-phone.mp4" poster="/assets/img/posts/ai-screens/book-open-phone.jpg" controls muted playsinline preload="none"></video><figcaption>A report video of the notebook-opening effect, recorded on the phone screen.</figcaption></figure>

When I got a video of the rain and snow weather effect, I answered in just three syllables: **"Hurts my eyes."** Claude got it right away, cut the raindrops in half, and came back with a new video. Even without technical terms, trading videos like this keeps the conversation flowing, even if all I do is toss out how it feels.

By the way, the story of how I fixed the choppy video problem when the AI records the screen, with a neat trick, is in a separate post: [the one about making video from one frame at a time](/en/2026/10/27/ai-clip/).

## Three-line summary

1. For UI work, make the AI capture at phone and PC resolutions itself, and don't accept a done-report without proof photos. (It catches its own bugs while shooting.)
2. Have it report every fixed screen with before and after side by side, and the sign-off takes three seconds.
3. For motion like animation, take a video, and feeling-level feedback like "they're moving separately" or "hurts my eyes" is enough, no jargon required.
