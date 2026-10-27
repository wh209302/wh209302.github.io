---
layout: post
title: "Handing Login to AI, and Messing Up Secret Keys Twice"
date: 2026-10-27 12:40:00 +0900
category: ai-work
series: ai-tips
tags: [security, secret keys, login, Cloudflare]
image: /assets/img/posts/ai-secrets/talk-en.webp
summary: Claude wrote all the code for adding Kakao and Google login, but the secret keys were something I had to handle myself. A security lesson learned by pasting secret keys into the chat window and then putting them in the wrong settings box.
---

I decided to add Kakao and Google login to the game so players' records could be stored safely on the server.

Claude wrote all the complicated integration code on its own, but for security reasons, getting the **"secret keys"** issued and putting them in was something only a human, me, could do. And sure enough, I managed to blow it twice in a row.

<figure><img src="/assets/img/posts/ai-secrets/talk-en.webp" alt="A table of three scenes of mistakes made while adding login: what I did, Claude's answer, what changed" loading="lazy"><figcaption>A record of sweating over secret keys during one day, October 22.</figcaption></figure>

## Accident #1: I pasted five secret keys straight into the chat

I copied the five freshly issued secret keys from the Kakao and Google developer centers and, without a thought, pasted them right into Claude's chat window. My cheerful intent was "I don't know much, so you put them in the right place for me."

Claude then turned serious and issued a warning.

**"A secret key that has been typed into a chat window even once must be treated as already leaked. Discard all five right now and get new ones issued."**

It felt like being hit on the head. I rushed back to the developer sites, blew up every key I had just made, and got them issued all over again. And that day I set one iron rule. **To the AI, I don't show the "value" of a secret key. I only ask about the "location of the blank" where the key goes.**

## Accident #2: I put them in, so why is there no login button?

I carefully typed the newly issued keys myself into the server settings screen. But when I actually launched the game, the login button was nowhere to be seen. Just looking at the screen, there was no way to tell where it had gone wrong.

Seeing me stuck, Claude built a small **"self-diagnosis feature"** into the server. It was a safe checking tool that never shows the actual value of any secret key on screen, but tells me with a simple O/X **"which named keys the server currently sees as empty."**

I opened the diagnosis screen, and absurdly, all five keys I had just entered showed up as "empty (missing)."

The culprit was the confusing UI of the server admin screen. The settings page had two input boxes with almost identical names, one above the other, and instead of **the box the real server reads while running (runtime variables)**, I had diligently typed the keys into **the box used only briefly while the homepage is first assembled (build variables)**. The moment I moved them to the right box, the login button popped up like magic.

<figure><img src="/assets/img/posts/ai-secrets/where-keys-go.webp" alt="Two places not to put secret keys (the chat window, the build settings box) and the one place to put them (the secret value box in the server runtime settings)" loading="lazy"><figcaption>The proper resting place for secret keys. I used a drawing instead of capturing the real server screen, for fear of causing another accident.</figcaption></figure>

## What I learned by causing accidents

Handling secret keys is something even the most capable AI can't do for you. It's entirely on the human. But **a diagnostic tool that lets me find what I did wrong without ever seeing the secret keys** is something the AI can build amazingly well. Without a diagnostic that says "hide the values, just tell me which key names are missing," I'd still be pulling an all-nighter, writing and erasing keys in that wrong box.

While at it, I also asked Claude and wrote down the safety rules for rotating secret keys regularly later. You have to cross it like stepping stones: **"add the new key first, confirm it works, deactivate the old key, then finally delete the old key."** If you rush and delete the old key first, every user's login goes dead during the swap, so I'm glad I asked ahead of time.

## Three-line summary

1. Never paste a secret key into an AI chat window. If you paste one even by accident, discard it right away without regret and get a new one issued.
2. Ask the AI only about "where to put the key" instead of the value, and when it won't work, have it build a diagnostic tool that hides key values and just checks which are missing.
3. When rotating keys later, follow the order "add new key, confirm it works, turn off old key, delete" so login never breaks.
