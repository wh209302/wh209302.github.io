---
layout: post
title: "Trading a subway map for colored pencil: how one 'looks lame' redrew the whole UI"
date: 2026-11-02 00:50:00 +0900
category: notebook-rpg
tags: [AI collaboration, screens, mockups, decisions]
image: /assets/img/posts/pencil-map/route-en.webp
summary: I ran someone else's UI checklist skill over my game and ended up with the route board, margin doodles and world map all redrawn in colored pencil.
---

Stare at your own screen long enough and your eyes go numb. You can tell something feels off, even if you can't put your finger on what. That's when I stumbled on a skill called [unslop](https://github.com/heydamir/unslop)—a checklist built to catch screens that look "AI-made." Curious whether my game had any giveaway machine habits, I tossed Claude the link and asked it to audit the UI.

<figure><img src="/assets/img/posts/pencil-map/talk-en.webp" alt="Five scenes of the UI polish, laid out as what I said, what Claude did, and what changed" loading="lazy"><figcaption>It started with one link and spread all the way to the world map.</figcaption></figure>

## Borrowing only half of someone else's checklist

Claude didn't blindly install the skill; it read it first. And the verdict was refreshingly clear: half of it didn't fit our game at all. The checklist was written for corporate dashboards and SaaS landing pages, so it tells you to ditch emoji and stickers, stick to grey backgrounds, ban wobbly borders, and kill looping animations. Our game is a grade-schooler's notebook RPG. **Stickers and wobbly handwriting are its entire soul—strip those away and you don't have a fantasy adventure anymore, you have a quarterly earnings report.** So Claude tossed out the mismatched rules, audited with the rest, and came back with seven concrete fixes.

<figure><img src="/assets/img/posts/pencil-map/fixes.webp" alt="Before and after of the header chips and route board text. After the fix, chips have no color by default and the sound button sits at the far right" loading="lazy"><figcaption>Six header chips used to be six different colors. Now they're plain paper until something matters.</figcaption></figure>

The list was surprisingly revealing: every header chip had its own bright color so real warnings didn't stand out, the route board text was tiny, winter snowflakes drifted right across the words, bag slot labels were faint, one cover button was stuck in default browser grey, and the PC diary box sat half empty. Best of all, the game was juggling *twenty-seven* different font sizes. I clicked start on the card, and those 27 sizes got wrangled into six clean steps from 12 to 28 pixels.

## Confession #1: the route board was lame

With those cleaned up, the route board started nagging at me. Thick blue lines with white circles in a neat row—it looked like a city subway map dropped straight into a kid's notebook. Too clean, too straight, completely out of place. So I didn't sugarcoat it: "The route board style looks kind of lame right now. Change it to something stylish that fits the concept."

Instead of pitching ideas in text, Claude painted two mockups onto real game screens. One was a colored-pencil path with tiny station doodles; the other was just a thin dotted pencil line. I picked the colored-pencil map without blinking.

<figure><img src="/assets/img/posts/pencil-map/route-en.webp" alt="Route board before and after. Before: thick blue line and white circles. After: pencil dashes over a colored-pencil band, with village, castle, fort and forest doodles" loading="lazy"><figcaption>Top is the old board, the two below are the colored-pencil map. Where you are gets a red pen circle.</figcaption></figure>

Now a village is a roof puffing chimney smoke, the capital is a castle, a fort is a flagged wooden stockade, and a forest is a cluster of pines. There are eight station doodles and nine roadside terrain marks—trees by forest paths, reeds in the marsh, gravestones near cemeteries. **Once the route board stopped looking like a transit sign and started looking like a sketch in the margin, the whole screen suddenly felt like one person's notebook.**

## Asking for mockups first kept the borders as they were

Greedy for more, I pushed further: richer margin doodles, and UI borders to match the notebook vibe. This time, though, I asked for mockups *before* touching anything.

The border options came in three flavors: a double-drawn pencil line, a colored-pencil inner border, and a cut-paper edge. Lined up side by side, though, the existing border actually looked the cleanest. **Seeing mockups first turned "leave it alone" into a real decision too.** If we'd charged ahead and repainted everything, rolling it back would have been a headache. The borders stayed, and only the doodles got a makeover.

<figure><img src="/assets/img/posts/pencil-map/doodles.webp" alt="Six redrawn margin doodles: flowers with a ladybug, a coin stack with a haggling stamp, rope knots and an anchor, vines, a hand rising from a grave, an axe stuck in a stump" loading="lazy"><figcaption>Flowers, coins, rope and anchor, vines, grave hand, axe in a stump, now with pencil hatching and crayon grain.</figcaption></figure>

A ladybug perched on the flowers, the coins got a red "haggle" stamp, and the axe now bites into a stump with visible tree rings. The crayon grain was too heavy at first and made lines look broken, but Claude caught it in its own screenshot and dialed it back before I even had to say anything.

## "When that's done, carry on with the next things in order"

By then, the leftover pieces were sticking out like sore thumbs. The world map still wore the old look, and three margin doodles—bunting, footprints, and frost—hadn't been touched. Calling them out one by one felt tedious, so I handed them all over in one line.

<figure><img src="/assets/img/posts/pencil-map/worldmap-en.webp" alt="World map before and after. After: line colors as faint colored-pencil bands with pencil dashes on top, and tree, reed and gravestone doodles by the roads" loading="lazy"><figcaption>The world map now shares the route board's colored-pencil look. The station circles that show where you've been stayed as they were.</figcaption></figure>

On the world map, roads cross colored land tiles, so copying the route board as-is made the bands disappear into the terrain. Pressing the colored pencil one shade darker fixed that, and the last three doodles followed in the same style.

<figure><img src="/assets/img/posts/pencil-map/doodles3-en.webp" alt="Bunting, footprints and frost before and after. Flags in four hatched colors with patterns, footprints as boot soles, frost as a hatched corner with a snowflake" loading="lazy"><figcaption>Bunting, boot prints and a frosted corner. The frost is shown five times bigger.</figcaption></figure>

The bunting hid a funny trap. The old version was a single image stretched to fit the screen width, so on a wide PC monitor the flags got squashed like pancakes. Now only the string stretches, and each flag hangs individually so they keep their crisp triangle shape at any width.

## Three-line summary

1. Have the AI read someone else's checklist first and filter out any rules that would kill your project's personality.
2. Even a blunt gripe like "it looks kind of lame" works—the AI turns it into a few mockups so you just pick.
3. Looking at mockups first makes "don't change it" an easy call, saving you from painful rollbacks.
