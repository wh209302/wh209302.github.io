---
layout: post
title: "What I Ran Into Running Several AI Jobs at Once"
date: 2026-10-27 12:20:00 +0900
category: ai-work
series: ai-tips
tags: [AI collaboration, git, automation, cost]
image: /assets/img/posts/ai-parallel/talk-en.webp
summary: I'm impatient, so I put several Claudes to work in one repository at the same time. Development got several times faster, but they overwrote each other's code and burned through the free server time in two days. A record of the trial and error.
---

I'm an impatient person, so when making this game I keep several Claude work windows open and give them all jobs at the same time. Room 1 polishes the battle balance, Room 2 writes class events, Room 3 runs the English translation, and so on.

Progress got dazzlingly fast compared to working alone, but too many cooks spoil the broth, as they say. The moment several AIs started sharing one house, all sorts of bizarre collisions broke out.

<figure><img src="/assets/img/posts/ai-parallel/talk-en.webp" alt="A table of three things that happened while running several jobs at once: what I said, Claude's answer, what changed" loading="lazy"><figcaption>Three crises I went through running the multi-job setup, and how they got solved.</figcaption></figure>

## "Too much hassle, just push straight to main!" (the calm before the storm)

At first, Claude did things by the book: for every job it made a separate branch and asked me for permission to merge it (a PR). But this is a solo project anyway, and clicking a confirm button every time was a chore.

In the end, on October 20, I ordered: **"Why do you keep branching off to upload? It's a hassle, just push straight to the main line (main)!"** I'd paved a nice open highway, but I hadn't foreseen the pile-up coming right behind it.

## I gave them different jobs, so why are they grabbing each other by the collar?

As soon as every job went straight to the main line (`main`), conflict alarms went off all over. One was fixing battles and another was fixing translations, so why were they colliding?

The culprit was **the spots everybody touches in common**. The content version number, the file integrity fingerprint (hash), the translation list, the last line of the patch notes: whatever the job, everyone is obliged to touch these shared zones at the end, and that's where the crashes kept happening. After about two days of this I'd hit my limit and asked: **"Can't we make these shared zones merge themselves automatically when uploading?"**

<figure><img src="/assets/img/posts/ai-parallel/shared-cells.webp" alt="A diagram of three jobs colliding in shared cells, and the steps that auto-fix them with the upload command" loading="lazy"><figcaption>The accident-prone zones were always the same: the shared cells where everyone stamps their seal on the way out.</figcaption></figure>

Claude dug through the recent conflict records, put the repeat-offender zones in a table, and set up two traffic rules.

1. **Values you can get by running the numbers**, like version numbers or file fingerprints, are not touched mid-work. They get calculated and stamped at the very last moment, when uploading to the server.
2. When it's something like docs or translation lists where **both sides only added lines at the end of the file**, don't fight, just keep both lines and join them together smoothly.

I bundled these two steps into one dedicated "upload command," then nailed a line at the very top of the constitution every AI reads (`CLAUDE.md`): **"When uploading code, use only this command."** After that, it only stops and waits for my ruling in the truly special case where two AIs edited the very same sentence in different ways. The rest of the little fender-benders get settled smoothly on their own.

## The mysterious "payment failed" message at dawn

Just when I thought peace had arrived, at dawn on October 22, a **"payment failed"** notification suddenly came from GitHub. I woke up with my heart sinking, thinking the code had blown up, but when I had Claude investigate, the cause was somewhere I'd never have guessed.

I had **burned through the 2,000 minutes of automatic check (CI) time that GitHub gives free each month for private repositories, all in just two days**.

<figure><img src="/assets/img/posts/ai-parallel/ci-minutes.webp" alt="The math: 1 upload times 2 Node versions times 25 minutes is 50 minutes, so 40 uploads finish a month's worth" loading="lazy"><figcaption>The math is honest. Every upload evaporates 50 minutes, so just 40 uploads turn the monthly free coupon to dust.</figcaption></figure>

Running the numbers was jaw-dropping. Every time I uploaded code, a 25-minute full check ran in two environments (50 minutes total), and with several AIs let loose uploading dozens of times a day, a month's worth was gone in two days, no surprise.

I hurriedly cut the heavy automatic check on the server down to once a day, and instead changed things so each AI runs the check on its own computer (locally) before uploading. If I'd multiplied **"number of uploads x check time per run"** just once before turning on the automation, I wouldn't have had that heart-stopping dawn.

## Three-line summary

1. Even if you give several AIs different jobs, collisions are certain at the chokepoints everyone passes through, like version numbers and list tables.
2. For repeat-collision zones, I had the AI survey them all, then solved it with a dedicated command that merges automatically at upload time.
3. Before giving eager AIs unlimited upload permission, do the multiplication first and check that the cloud's free check time isn't melting away.
