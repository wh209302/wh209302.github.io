---
layout: post
title: "One line of sign-off, six mood effects: lightning, cave dust, and a drunk screen"
date: 2026-11-01 17:10:00 +0900
category: notebook-rpg
tags: [AI collaboration, screens, animation, decisions]
image: /assets/img/posts/mood-effects/effects-en.webp
summary: I handed over the six mood-effect ideas from the last post in a single line, and in one day the game got lightning silhouettes, falling cave dust, a night-road lantern, drunk, poisoned and sick screens, tavern lamplight and a landscape phone layout.
---

At the end of [the last post](/en/2026/11/01/screen-check/) Claude listed six mood effects worth adding next: lightning, cave dust, a lantern for night roads, a drunk screen, indoor lighting, and a landscape layout for phones. They all sounded too good to rank, and picking between them felt like more work than just doing them. So I stamped the whole list with one line: "Go through them in order."

<figure><img src="/assets/img/posts/mood-effects/talk-en.webp" alt="Five scenes from the mood-effects work, laid out as what I said, what Claude did, and what changed" loading="lazy"><figcaption>After one line of sign-off, the moments where Claude fixed its own work.</figcaption></figure>

## One stamp on the paperwork

Because the ideas had already arrived as a tidy numbered list, all I really had to do was stamp the top corner. **When the list is clear, "in order" turns straight into a work order.** Claude screenshotted each effect as soon as it finished and fixed anything that looked off without even waiting for me. Meanwhile, I was off having coffee and doing something else.

## When lightning strikes, the world turns into a paper cut-out

First up was the lightning silhouette. In an outdoor storm, at the exact instant of the flash, the sky blows out to white while the ground, houses, and people stay behind as stark black shadows.

<figure><video src="/assets/img/posts/mood-effects/bolt.mp4" poster="/assets/img/posts/mood-effects/bolt.jpg" controls muted playsinline preload="none"></video><figcaption>Once every eight seconds, just for that flash, the game turns into a shadow play.</figcaption></figure>

The first try was the funny part. The silhouettes came out washed-out grey instead of black. Looking at its own screenshot, Claude spotted the culprit: the white flash layer covering the whole screen was sitting on top of the shadows too, bleaching them out. Lifting that layer and the storm shade for that single instant gave a crisp **white sky with ink-black shapes**.

## A noisy cave feels like the ceiling is coming down

The rest marched in right behind it.

<figure><img src="/assets/img/posts/mood-effects/effects-en.webp" alt="Seven new mood effects: lightning silhouette, cave ceiling dust, night-road lantern, drunk screen, poisoned screen, sick screen, tavern lamplight" loading="lazy"><figcaption>Lightning, dust, lantern, drunk, poisoned, sick and lamplight on one sheet.</figcaption></figure>

1. **Noisy cave**: when the noise in a cave builds up just before monsters swarm in, dust drops from the ceiling and the scene trembles. At first the dust specks were so tiny you needed a magnifying glass, so the clumps doubled in size and got a little bounce where they land.
2. **Night-road lantern**: walk a road at night and the hero carries a lantern, keeping only a warm circle lit around them. When a wolf steps out of the dark beyond, it's genuinely creepy.
3. **Drunk, poisoned, sick**: drunk, the world tilts and people double up. Poisoned, greenish blotches creep in from the edges. Sick, the color drains out and everything turns pale. The poison blotch first landed smack in the middle of the hero's face, so it got banished to the corners.
4. **Tavern lamplight**: in a tavern or inn event, a lamp hangs overhead with flickering amber light. You're indoors now, so the rain outside politely stops.

## Turn the phone sideways and the notebook opens into two columns

Last was the landscape phone layout. Before, turning a phone sideways left the notebook floating narrow in the middle with acres of empty desk on both sides, forcing you to scroll forever just to reach the diary and choices.

<figure><img src="/assets/img/posts/mood-effects/landscape-en.webp" alt="Phone turned sideways, before and after. Before, a narrow notebook floats in the middle; after, the scene and bag are on the left and the route board, diary and choices on the right" loading="lazy"><figcaption>Scene on the left, diary and choices on the right, all visible without scrolling.</figcaption></figure>

Now the page splits cleanly into two columns. There was a sneaky trap where an overflowing left column spawns an unwanted third one, so **the scene now shrinks automatically to fit the screen height**. Re-running [last time's checker](/en/2026/11/01/screen-check/) over the new layout also caught station names elbowing each other on busy routes—a free bonus fix.

## Three-line summary

1. Ask the AI for a numbered list of ideas, and "go through them in order" is all the sign-off you need.
2. Have it screenshot each piece as it finishes—it will catch slips like grey shadows or poison blotches on someone's face on its own.
3. Re-run the checker you built last time whenever you add something new. It almost always hands you a free bug.
