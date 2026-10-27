---
layout: post
title: "My First Week Building a Fantasy Web Game With AI, Knowing Zero Code"
date: 2026-10-27 13:00:00 +0900
category: notebook-rpg
tags: [retrospective, AI collaboration, decisions, measurement]
series: rpg-weekly
pin: true
image: /assets/img/posts/first-week/cover.webp
summary: A survival report from someone who can't code at all, working a week with AI as the whole dev team, making calls, flailing, and checking things with numbers.
---

I broke ground on October 20, so today makes exactly one week.

Confession up front: I don't write a single line of code myself. My job is "drawing the big picture of what to build," "looking at what got built and deciding whether I like it," and "picking one when the road forks." The actual coding and document upkeep belong to Claude, my full-time developer.

In other words, I'm a director who's all talk, and the AI is the crew. This is a casual write-up of what the two of us decided, and what I learned from the flailing, over one week.

## What kind of game is this, anyway?

In this game you're reincarnated at random as an ordinary resident of a fantasy world. Not a world-saving hero, but the farmer's daughter next door or the blacksmith's third son. Someone thoroughly average.

You live by rolling a 20-sided die at every crossroads of life, and a whole life can be over in a few minutes. When you die, a gravestone and a death notice get slapped onto the last page of the notebook, and a **"Great job!"** stamp comes down on top. (Died on the road and still "great job"? A bit savage, I know.)

<figure><img src="/assets/img/posts/first-week/cover.webp" alt="Notebook cover screen showing a name field, a character sticker, and a list of past notebooks" loading="lazy"><figcaption>The title screen. One notebook is one person's whole life, and every time you die, another past notebook joins the pile at the bottom.</figcaption></figure>

When a life ends, the game retraces on a map everywhere that person went.

<figure><video src="/assets/img/posts/first-week/journey.mp4" poster="/assets/img/posts/first-week/journey-poster.jpg" controls muted playsinline preload="none"></video><figcaption>A recap video that toddles across the map from the birthplace village, following the big events.</figcaption></figure>

It looks like an adventure RPG a kid doodled in a notebook during class: ruled paper, spiral binding, wobbly pencil handwriting, even scrapbook stickers. But what happens inside is anything but sweet. **"Harmless and cute on the outside, ruthless and blunt in the results."** That's the core philosophy I nailed down on day one.

<figure class="narrow"><img src="/assets/img/posts/first-week/play-phone.webp" alt="Game screen on a phone: character sticker scene on top, a route-map style travel map in the middle, a log of what happened below" loading="lazy"><figcaption>Living a life on a smartphone. The current scene is on top, a subway-map style travel map is in the middle, and the log of every wild thing that's happened so far is at the bottom.</figcaption></figure>

## How to code with your mouth (feat. the guy who only makes decisions)

The way we work is simple. I decide, and the AI does the legwork.

When we hit a fork in the road, Claude brings me two or three alternatives plus its own recommended pick, neatly laid out as a "decision card." Then I just say "Hmm, let's go with B," like a boss. I signed off (?) on dozens of items that way this week. My tips for getting an AI to file reports like this are collected separately in [how to make it let you choose](/en/2026/10/27/ai-decision-cards/).

I'm greedy, so I often open several windows and run big jobs at once, like polishing combat or adding login. It's definitely faster, but now and then the AIs would touch the same file at the same time and get into a brawl (a conflict). Luckily, I now have an automation command that tidies up the overlapping parts when code gets merged, and peace has been restored ([parallel work post](/en/2026/10/27/ai-parallel/)).

One more thing: the moment you close a chat window, the AI loses all its memory, like a goldfish. So every time we make an important decision, I had it write down "why we chose that" in the project notepad itself, and the next-day habit of asking the same question all over again vanished like magic ([memory post](/en/2026/10/27/ai-memory/)).

## I tore up the art style three times

The first character the AI brought me had muscles and armor detail, classic Western fantasy. Cool, but not the feel I wanted at all. I wanted a two-heads-tall character in the Japanese indie game style, with a big head and round eyes.

After that I went from pixel dots to smooth illustration, and finally realized the "pastel pixel sticker" I'd glanced at as a first example was the prettiest, and wound up right back at the start.

<figure class="narrow"><img src="/assets/img/posts/first-week/style-compare.webp" alt="Comparison chart of the same three characters drawn in several art styles, side by side" loading="lazy"><figcaption>The same characters lined up in different art styles. Only when they're laid out side by side did my own taste finally show up.</figcaption></figure>

What I really took to heart this time: dropping one reference image you like is a hundred times faster than describing an art style in a hundred words. And until I'd compared several mockups side by side, even I didn't know exactly what I wanted ([order for picking an art style](/en/2026/10/27/ai-art-style/)).

## Dissecting it with numbers instead of "vibes"

By October 24, while testing, the complaints started creeping up on me. Things like *"too many random events keep firing, so I'm not getting anywhere"* and *"getting the job I want is like plucking a star from the sky."*

In the old days I'd have gone straight to tweaking the probabilities, but this time I decided to measure first. I had the AI run an auto-play bot through more than a hundred lives, then crunch stats on where characters actually spend their time once they grow up.

<figure><img src="/assets/img/posts/first-week/time-chart.webp" alt="Bar chart: one-year hire contracts 66%, taking on apprentices 12%, mountain training 11%, working their own job 1.4%" loading="lazy"><figcaption>What the grown-up characters spent their time on, laid bare. The culprit was somewhere unexpected.</figcaption></figure>

The result was pretty shocking. The characters were pouring a whopping **66% of their adult lives into "one-year gigs" (hire contracts)**, while **the time spent on their own actual job was just 1.4%**. When I dug into why, the gig pay beat what an entry-level job earned, so the AI kept doing nothing but gigs.

The job events weren't missing because there weren't enough of them. They never showed up because the characters were never doing the job in the first place. If I'd fixed it by gut feeling, I'd have pulled an all-nighter cranking out dozens more job events for nothing.

"When something bugs you, don't fix it right away, have it measured first." That's the most valuable habit I picked up this week.

## The login story that gave me a heart attack

This happened when I was hooking up Kakao and Google login. I absent-mindedly copied the five fresh-off-the-press secret keys and pasted them straight into the chat window, then realized what I'd done, scrapped every one of them, and had to reissue them all. That hair-raising blunder is preserved for posterity in the [secret keys post](/en/2026/10/27/ai-secret-keys/).

## What's next

Right now I'm weaving "cause and effect" between events. Someone who just brushed past you in childhood shows up years later as your nemesis, or a choice you made carelessly when young comes back like a boomerang in old age. I'll post another fun survival report as the work progresses.

## Three-line summary

1. I point the direction and sign off. The dirty work of coding and checking belongs entirely to the AI.
2. For things that are hard to put into words, like an art style, it's better for your sanity to have several mockups laid out side by side and pick one.
3. When the game feels off, have the AI run stats before you rip things apart on a hunch. The real culprit is always hiding somewhere unexpected.
