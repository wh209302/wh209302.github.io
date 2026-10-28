---
layout: page
title: Tech Shelf
permalink: /en/shelf/
description: Tools and references I'm not using right now but might pull out for a future game.
---

Working with AI, you trip over a "whoa, this is huge" tool almost every day. The catch is that **most of them don't fit the game I'm making right now**. Let them slip by, though, and three months later I'm back in the search bar going "what was that thing again?"

So I made a shelf. Every time I toss a link over, Claude checks what it does, whether it's OK for commercial use, and whether my home PC can run it, then files it here. When I start the next game, this shelf is the first thing I'll open.

**Status:** Looked at (read and weighed) · Tried (actually ran it) · In use · Dropped

## Art and characters

### [see-through](https://github.com/shitagaki-lab/see-through)

- **What:** Feed it one anime-style illustration and it splits hair, face, eyes, clothes and more into up to 23 transparent layers, fills in the hidden parts, and hands back a Photoshop file (PSD). It's a SIGGRAPH 2026 paper. It doesn't rig anything, so free tools like [StretchyStudio](https://github.com/MangoLion/stretchystudio) take over from there.
- **Where it could fit:** Big standing portraits on a dialogue screen with blinking and lip movement. The tedious hand-splitting of layers just disappears.
- **License:** Code is Apache-2.0, the layer model is OpenRAIL++ (commercial use allowed, with misuse restrictions), the body-part model is Apache-2.0. The depth model's page wouldn't load, so that one isn't confirmed yet.
- **Hardware:** A 12GB graphics card runs it at about 10GB with the memory-saving setting (about 1.5x slower). There's a lighter 8GB version, and ComfyUI nodes exist.
- **Status:** Looked at (2026-10-28)
- **Verdict:** Notebook RPG draws face parts, head and body separately from the start, and they're small pixel stickers, so there's nothing to split. For a next game with big illustrated characters, it's the top candidate.

## Game screens (UI)

### [UI Glossary](https://tuiella.github.io/ui-glossary/) (Korean)

- **What:** A Korean dictionary of about 140 game screen parts, like health bar trails, hit vignettes and bestiary silhouettes, each with an example picture.
- **Where it could fit:** Go through it line by line while designing a new game's screens and the missing parts jump out. You can also order things from AI by their proper name instead of "you know, that thing."
- **License:** None stated. Linking is fine, but I don't copy its contents here.
- **Hardware:** Any web browser.
- **Status:** In use (2026-10-28)
- **Verdict:** Checking Notebook RPG's screens against it turned up six improvement ideas. It'll stay useful whatever the game.

## Pixel art

### [Pixel Shading Glossary](https://tuiella.github.io/pixel-glossary/) (Korean)

- **What:** A Korean guide to pixel art terms for light, shadow, color, animation and production, explained with before-and-after pictures.
- **Where it could fit:** A checklist for reviewing pixel art that AI drew. One proper term works far better than "make the shadows look natural."
- **License:** None stated. Linking is fine, but I don't copy its contents here.
- **Hardware:** Any web browser.
- **Status:** In use (2026-10-28)
- **Verdict:** Worth keeping nearby for any game that uses pixel art.
