---
layout: post
title: "A war broke out and the notebook didn't say a word"
date: 2026-10-30 20:30:00 +0900
category: notebook-rpg
tags: [AI collaboration, measurement, design, decisions]
image: /assets/img/posts/life-branches/chart-en.webp
summary: I measured whether lives really branch apart, and 335 wartime periods left only 8 lines in the notebook. This is how we weighed an outside review, built a measuring tool first, and measured again.
---

In this game, when you die you move on to the next life. So each life had better feel different, or what's the point? I started wondering whether it actually does. Does a noble's life read differently from a serf's? Does a childhood in wartime read differently from one in a year of plenty? So I asked Claude to measure it. The answer was a little embarrassing.

<figure><img src="/assets/img/posts/life-branches/talk-en.webp" alt="Five scenes from the life-branch check to the re-measurement, laid out as what I said, Claude's answer, and what changed" loading="lazy"><figcaption>Five scenes, from asking for a check, to handing over someone else's review, to tapping one card.</figcaption></figure>

## 335 wars, 8 lines in the notebook

Claude lived 420 lives across twenty-one origins and came back with numbers. Born a serf's kid or a temple novice in the same reed village, you ended up living almost the same adult life. Run the same seed as a man and as a woman, 84 pairs, and **not a single pair lived through a different event.** The one that really stung was something else. Over 335 periods of war, famine and the like, the era's own events showed up 8 times. A war broke out, and the notebook carried on as if nothing happened.

Meanwhile, another thread was working on race differences. Both jobs touched the same pool of events, so they were bound to step on each other. I merged them and asked: "Look again, carefully, at whether the two designs mesh with each other, and whether the directions I gave are actually covered by that design, and redesign it." The merged design, version 1, came back in five stages.

## "Don't just accept it all"

I got version 1 reviewed elsewhere, and it came back with fourteen things to fix. Pasting them straight in would have been easy, but swallowing someone else's notes whole is a good way to turn a design into a patchwork. So I handed them over like this: "This isn't something to accept unconditionally. Look at it, and carefully check which parts hold up or need more work, then design from there."

Claude weighed the fourteen one by one and accepted all of them. Better than that, along the way it **owned up to its own mistakes first**. Two things it had marked "met" in version 1 hadn't been met, and one number couldn't be recounted because the counting method was never written down.

<figure><img src="/assets/img/posts/life-branches/fix-en.webp" alt="A table setting Claude's verdicts in version 1 beside the corrected ones: same origin 4.5% missed, era scenes only for adults, the soldier-arc number could not be recounted" loading="lazy"><figcaption>The target was 4% and it wrote "met" next to 4.5%. Now every number keeps its counting script next to the raw data.</figcaption></figure>

Version 2, with the review folded in, gained a new stage 0. Before adding more scenes, set the rules for when scenes collide, and build the tool to measure it. I tapped "Go with v2, multiply both factors" on the decision card.

## Rules first, then 1,610 lives

Adding scenes really did make them collide. Elves live for centuries, so a wedding, a child and a war could all pile into one year. So three rules came first.

1. **What comes first**: birth, losing someone, the era of a great event, growing up, then marriage and children.
2. **Half a year apart**: scheduled scenes keep six months between them. At first we tried stretching that by each race's pace, but for elves it became ten years and every scene got dropped.
3. **Same-meaning bundles**: the wartime recruiter, the levy that comes with your origin, and the recruiter in human villages all tell the same story, "the army calls," so only one comes within ten years.

Then the new tool ran 1,610 lives. The share of eras where you saw at least one era scene jumped from 1% to 90% for human adults, and from 0% to 94 to 100% for adults of other races.

<figure><img src="/assets/img/posts/life-branches/chart-en.webp" alt="Share of eras where at least one era scene appeared. Before, 0 to 1%. After, 90 to 100% for adults and 100% for children" loading="lazy"><figcaption>The grey bars you can barely see are the before. The child bars count wartime only.</figcaption></figure>

The tool also found a hidden hole. We had written eight new era scenes for children, and six of them never showed up once in 700 lives. It turned out children could only live through three great events, a flood, a war and a comet, and only the war left an era behind. **We had written the famine scenes and never built a road for famine to arrive.** So we added a childhood lean year, plague and great harvest.

## The extra soldiers were the pencil's fault

One number still bothered me. After adding war scenes, lives that took the soldier road went from 1% to 11%, and lives with children dipped a little. Were the scenes dragging lives in one direction?

So we measured with different pencils. The pencil is the autoplay that picks choices for you, and we had it choose carefully, boldly, and at random per life. Then we lined up the same twenty seeds in front of the recruiter and forced half to enlist and half to hide.

<figure><img src="/assets/img/posts/life-branches/pencil-en.webp" alt="Share of lives on the soldier arc by pencil temper. Default 9%, careful 6%, bold 3%, random 4%, forced to enlist 100%, forced to hide 0%" loading="lazy"><figcaption>All twenty who enlisted became soldiers. None of the twenty who hid did.</figcaption></figure>

The culprit was the default pencil, which had a habit of enlisting in front of the recruiter. It also means that when a person chooses, the life really does split. We learned something about personality as a bonus. Even with a random pencil, 72% of lives came out hot-headed, so that skew comes from the events and choices, not the pencil. That gets fixed in the stage that deals with personality.

That's what went out this time. Slightly fewer lives with children, and married and single lives still not splitting much, get measured again in the next stage, which gives each race its own family shape. Before that, I want to sort out five states such as legal status, affiliation and livelihood, plus how a neighborhood decides how it looks at you.

## Three-line summary

1. Don't settle "is it really different?" by feel. Ask the AI to measure it. Numbers like 335 wars and 8 lines never come out in words.
2. Hand over outside reviews with "weigh it, don't just accept it." While weighing the review, the AI will find its own mistakes first.
3. Leave a counting method next to every number. A number you can't recount can't hold up a decision.
