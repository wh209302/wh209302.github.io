---
layout: post
title: "Handing Login to AI—and Messing Up Secret Keys Twice in One Day"
date: 2026-10-27 12:40:00 +0900
category: ai-work
series: ai-tips
tags: [security, secret keys, login, Cloudflare]
image: /assets/img/posts/ai-secrets/talk-en.webp
summary: "Claude wrote all the Kakao and Google login code without breaking a sweat. The one small part left to the human—handling five secret keys—went wrong twice in a single day."
---

I decided to add Kakao and Google login to the game so players could store their records safely on the server.

Claude wrote every line of the integration code without breaking a sweat. For security reasons, though, issuing the **secret keys** and plugging them into the server was the one part left to the human—me. Sure enough, I managed to blow that one part twice before the day was over.

<figure><img src="/assets/img/posts/ai-secrets/talk-en.webp" alt="A table of three scenes of mistakes made while adding login: what I did, Claude's answer, what changed" loading="lazy"><figcaption>One very sweaty day with secret keys, October 22.</figcaption></figure>

## Mistake #1: Pasting five secret keys straight into the chat

I copied five freshly minted keys from the Kakao and Google developer consoles and, without a second thought, pasted them right into Claude's chat window. My logic was innocent enough: "I don't really know where these go, so you put them in the right place."

Claude immediately put the brakes on.

**"A secret key that has been typed into a chat window even once must be treated as already leaked. Discard all five right now and get new ones issued."**

Nothing wakes you up faster than your AI assistant lecturing you on opsec. I went back to both developer consoles, revoked every key I'd just created, and generated five new ones. That day I adopted a simple rule: **never show the AI a secret key's value—only ask where the blank field lives.**

## Mistake #2: They're in the settings, so where's the login button?

Next, I typed the five brand-new keys directly into the server admin panel myself. I opened the game, waited for the login buttons, and got nothing. Just staring at the screen told me zero about whether I'd mistyped a key or broken the code.

Seeing me stuck, Claude built a tiny **self-diagnosis page** on the server. It never prints a single character of any actual key; it just reports, yes or no, **which named keys the server currently sees as missing**.

I opened the diagnostic page and stared at the result: all five keys I had just entered were listed as "missing."

The culprit was two nearly identical sections stacked right on top of each other in the server settings UI. Instead of **the fields the live server reads while running (runtime variables)**, I had diligently filled in **the fields used only while building the site (build variables)**. The second I moved the keys to the right box, the login buttons appeared.

<figure><img src="/assets/img/posts/ai-secrets/where-keys-go.webp" alt="Two places not to put secret keys (the chat window, the build settings box) and the one place to put them (the secret value box in the server runtime settings)" loading="lazy"><figcaption>Where secret keys belong—and where they don't. I drew a diagram instead of screenshotting the real admin panel, rather than tempting fate a third time.</figcaption></figure>

## What the two detours taught me

Handling secret keys is one job you can't hand off to even the sharpest AI; it stays 100% on the human. What an AI *can* build in minutes, though, is **a blindfolded diagnostic tool** that tells you what you misconfigured without ever seeing the secrets. Without that "hide the values, just flag missing names" check, I might still be typing and erasing keys in the wrong box at two in the morning.

While I was at it, I asked Claude for the safe way to rotate keys later on. You cross it like stepping stones: **add the new key → verify it works → disable the old key → delete the old key**. Delete the old one first and login breaks for everyone mid-swap—glad I asked before learning that one the hard way too.

## Three-line summary

1. Never paste a secret key into an AI chat window. If it happens even once, revoke it right away and issue a fresh one.
2. Ask the AI *where* a key goes, never *what* it is—and when it doesn't work, have it build a diagnostic that hides values and only flags missing names.
3. When rotating keys later, follow `add new → verify → disable old → delete` so login never drops mid-swap.
