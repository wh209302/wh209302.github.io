---
layout: page
title: Tech Shelf
permalink: /en/shelf/
description: Tools, models and references I'm not using today, saved in one drawer for whatever game comes next.
---

Working with AI, you stumble across a "wait, this is wild" tool almost every day. The catch is that **most of them don't fit the game I'm making right now**. Let them float past, though, and three months later I'm digging through browser history muttering, "What was that thing called again?"

So I built a shelf. Whenever I toss a link over, Claude checks what it actually does, whether the license allows commercial use, and whether my home PC can run it without melting, then files it here. When the next game starts, this drawer is the first place I'll look.

**Status:** Looked at (read and weighed) · Tested (actually ran it) · In use · Dropped

## Art and characters

### [see-through](https://github.com/shitagaki-lab/see-through)

- **What:** Feed it a single anime-style illustration and it splits hair, face, eyes, clothes and more into up to 23 transparent layers, paints in the hidden areas behind them, and hands back a Photoshop file (PSD). It's a SIGGRAPH 2026 paper. It doesn't rig anything, so a free tool like Anime2.5DRig below takes the baton from there.
- **Where it fits:** Large standing portraits in dialogue scenes that need blinking and lip movement. The mind-numbing chore of cutting out every layer by hand disappears overnight.
- **License:** Code is Apache-2.0, the layer model is OpenRAIL++ (commercial use allowed, with misuse restrictions), and the body-part model is Apache-2.0. The depth model's page wouldn't load, so that one is still unconfirmed.
- **Specs:** Runs at about 10GB on a 12GB GPU with the memory-saving flag (~1.5× slower). There's a lighter 8GB build, and ComfyUI nodes already exist.
- **Status:** Looked at (2026-10-28)
- **Verdict:** Notebook RPG draws face parts, head and body separately from the start as tiny pixel stickers, so there's nothing to slice. For a future game with large illustrated portraits, this is first in line.

### [Anime2.5DRig](https://github.com/852wa/Anime2.5DRig)

- **What:** Drag a layered PSD into the browser and it rigs it automatically, adding breathing, blinking, mouth movement and swaying hair on the spot. It's built to ingest see-through's PSDs straight out of the box, so the two snap together like Lego bricks. Try it with no install on the [demo page](https://852wa.github.io/Anime2.5DRig/).
- **Where it fits:** Turning a static dialogue portrait into a short breathing, blinking loop. It records transparent WebM, ready to drop into a game. The real-time WebGL renderer is open too, so you could embed it directly if you're feeling ambitious.
- **License:** MIT (commercial use OK, keep the notice). The bundled PSD reader is MIT and face tracking is Apache-2.0. The sample art belongs to its artists, so don't reuse it.
- **Specs:** Just a browser. Everything runs locally and your art never leaves your machine.
- **Status:** Tested (2026-10-28, breathing and blinking verified on the sample)
- **Verdict:** Built for front-facing upper-body anime portraits, so tiny pixel stickers are out. Paired with see-through, "one picture → living portrait" is nearly automatic—definitely coming off the shelf together next time we do big portraits.

### Fixing AI-drawn fingers (community tips)

- **What:** Practical workarounds for when an image AI like GPT stubbornly mangles a hand no matter how politely you ask. Roughly in order of popularity: (1) dodge the pose altogether (a fist gripping a staff, hands tucked in sleeves or behind the back); (2) stop arguing in the same thread—open a fresh chat with the original image and one line about the hand only; (3) mask just the hand with a brush tool and redraw it; (4) graft a good hand from another frame or fix a few pixels manually; (5) crop the hand large, fix it in another tool, and shrink it back down.
- **Where it fits:** Small-hand art like 2-head-tall stickers. When a hand is only a handful of pixels, (1) and (4) save the most sanity. ComfyUI hand-fix nodes (HandRefiner, MeshGraphormer) were trained on realistic hands and get confused by chibi proportions.
- **License:** Not applicable—just hard-won workflow habits.
- **Specs:** Option (5) pairs an edit model like Qwen-Image-Edit in ComfyUI with a crop-and-stitch node ([Inpaint CropAndStitch](https://github.com/lquesada/ComfyUI-Inpaint-CropAndStitch)).
- **Status:** Looked at (2026-10-29)
- **Verdict:** Adding longer scoldings like "check every finger carefully" only makes the model forget your other instructions. Naming a simpler hand shape—or isolating the hand—beats lecturing the prompt.

## Image generation (ComfyUI)

Things I ran myself in ComfyUI on my home PC (12GB VRAM). Full lab write-ups live in the [AI lab](/en/categories/ai-lab/) section.

### [Anima](https://huggingface.co/circlestone-labs/Anima) + pixel/sprite LoRAs

- **What:** A 2B anime-focused image model. Its architecture differs from SDXL, so SDXL pixel checkpoints and LoRAs don't mix in—you grab Anima-specific LoRAs from Civitai. I tested an RPG side-view battle sheet LoRA (svactors), a pixel sprite style (Elin) and an RPG walk sheet (rpgchara).
- **Where it fits:** Generating multiple actions of one character on a single sheet. Because every frame is drawn inside one canvas, face, clothes, palette and pixel scale barely drift.
- **License:** The model itself is under the CircleStone Labs Non-Commercial License, but generated images may be used commercially (section 2(e)). Hosting it as a paid service or training commercial models on it is barred. The LoRAs block or restrict selling art, so test use only.
- **Specs:** About 55 seconds for one 2048×1360 sheet on 12GB (roughly a second per frame).
- **Status:** Tested (2026-10-28)
- **Verdict:** Top-notch consistency, timid motion. "Walking" looked more like breathing in place, and attacks were barely a nudge of the arm. For bold poses, the reference adapter below beat it hands down.

### [Anima Ref Adapter](https://github.com/ElectronGirl/ComfyUI-Anima-Ref-Adapter)

- **What:** ComfyUI nodes plus a tiny LoRA (92MB) that lock a character's hair, eyes and outfit to one reference picture while your prompt changes pose and background. No character name or appearance tags needed, so original characters work out of the box.
- **Where it fits:** Locking down a character from a sheet, then feeding one cell back in to generate big motions—walking, swinging, casting—without losing the face.
- **License:** Node code is Apache-2.0; adapter weights are under the CircleStone Non-Commercial License. As with Anima, output images may be used commercially.
- **Specs:** Anima base v1.0 and bf16 only (fp16 overflows), 30 steps, cfg 4.5, ref_guidance 4.5–5. V2 (183MB) dropped on 2026-10-29 as a single node and cut generation on 12GB from 55 seconds down to 33. Two reference images side by side even handle two characters. The author has since paused development due to funding.
- **Status:** Tested (2026-10-28, V2 2026-10-29)
- **Verdict:** The only route so far that delivered both consistency and big movement. Quirks: it strongly prefers facing left (easy flip), likes drawing a ground line under the feet, and small patterns or held props wander slightly between frames. Full story in [Same Face, Walking and Swinging](/en/2026/10/28/anima-motion/). With V2, plain-text poses were enough for attacks, spells and knockdowns, making it our go-to for multi-pose sheets ([Pose by Words, Face by Picture](/en/2026/10/29/same-character-poses/)).

### [Anima ControlNet VACE Depth](https://huggingface.co/TaihoC/Anima-ControlNet-VACE-Depth)

- **What:** Weights that steer an Anima pose and silhouette from a depth map (a grayscale image where near is bright and far is dark). Requires a patched Advanced-ControlNet node.
- **Where it fits:** Forcing a drawing to follow a pose staged in Blender or with a mannequin. Plays nicely alongside the reference adapter without stepping on its toes.
- **License:** Weights under the CircleStone Non-Commercial License; node under GPL-3.
- **Specs:** 596MB; about 37 seconds per image on 12GB paired with the reference adapter.
- **Status:** Tested (2026-10-29)
- **Verdict:** Follows the silhouette, but chunky mannequin depth maps couldn't tell arms from weapons, so it barely beat writing the pose in plain text. Depth without the adapter also occasionally spawned a bonus second person. Worth revisiting once we have crisp Blender depth passes.

### [Krea 2 Turbo](https://huggingface.co/krea/Krea-2-Turbo) + [pixel LoRA](https://huggingface.co/e-n-v-y/Krea-2-Pixel-Art)

- **What:** The fast 8-step edition of a 2026 image model topped with a pixel-art LoRA that draws cleanly onto a 128-cell grid.
- **Where it fits:** Ironing out messy dots from another model as a finishing pass. Redrawing at 0.45 strength gives the crispest grid. It does wipe out artist flavor from earlier stages, though—and dialing it down (0.20–0.30) or skipping it left the dots too jittery for real use.
- **License:** Model under the Krea 2 Community License (commercial use allowed under $1M annual revenue); pixel LoRA under MIT.
- **Specs:** fp8 build is 13.1GB, ~13 seconds per 1024² image, peaking around 11.2GB VRAM. Writing just "full body" loves to chop off the feet, so always add "head to toe, with margin."
- **Status:** Tested (2026-10-28)
- **Verdict:** Cleanest pixel grid of any commercially friendly route I've tried. On its own, different seeds look weirdly similar, so let another model supply the style and keep this for the final polish. Full tale in [Hunting an anime pixel style](/en/2026/10/29/pixel-style-hunt/).

### [Anima Style Explorer](https://github.com/ThetaCursed/Anima-Style-Explorer)

- **What:** A catalog of the 59,000+ artist names Anima actually knows, complete with a sample generated from the same prompt for each one.
- **Where it fits:** Steering style with artist tags. Putting in a name the model never learned does nothing, so checking here first saves hours of guesswork.
- **License:** Per the repository terms. We only used the name list.
- **Status:** Tested (2026-10-28)
- **Verdict:** Cross-checking 400 pixel/chibi artists from an image board against this list narrowed it down to 243 that Anima actually recognizes. Artist tags shine at the Anima stage, but a later redraw pass can erase them—always inspect outputs after every step.

### [Qwen-Image-Edit-2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)

- **What:** An edit model that modifies an existing picture by instruction ("change only the pose", "add a kerchief") rather than starting from scratch. With the 4-step Lightning LoRA and a 4-bit GGUF build, it fits inside 12GB VRAM.
- **Where it fits:** Turning one standing character into swing, pray, hurt and knockdown frames while keeping face, outfit, palette and style remarkably intact.
- **License:** Apache-2.0 (model, Lightning LoRA and GGUF builds).
- **Specs:** ~23GB download, 20–25 seconds per image, peaking around 11.4GB VRAM.
- **Status:** Tested (2026-10-21, retested on Anima art 10-28)
- **Verdict:** Still the most dependable tool I've tested for multi-pose consistency. Facing direction and scale can drift slightly between frames, so budget for a quick alignment pass afterward.

### [Z-Image Turbo](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo)

- **What:** A zippy 8-step image model that responds better to plain sentences than tag soup.
- **Where it fits:** Drafting commercially safe pixel characters—follows requests like two heads tall, big eyes and rosy cheeks surprisingly well.
- **License:** Apache-2.0.
- **Specs:** Use the int8 build on 12GB (bf16 overflows).
- **Status:** Tested (2026-10-20)
- **Verdict:** First stop when you need an unambiguously commercial pixel route. Fair warning: negative prompts are ignored, and writing "no white" will stubbornly paint white anyway.

### Baking a style LoRA with [kohya sd-scripts](https://github.com/kohya-ss/sd-scripts)

- **What:** A LoRA trainer that teaches a base model your look from a small batch of reference images.
- **Where it fits:** Once your art direction is locked and you need to crank out new characters in the exact same style.
- **License:** Apache-2.0 for the tool; the trained LoRA inherits the base model's license.
- **Specs:** SDXL base, 13 reference images, 2,100 steps in 26 minutes, 8.4GB VRAM.
- **Status:** Tested (2026-10-21)
- **Verdict:** Picks up palette and fabric details fast, but teaching a stubborn proportion like two-heads-tall takes dozens of samples, not a baker's dozen. Around 1,400 steps was the sweet spot.

### [Scenario Agent Skills](https://github.com/scenario-labs/skills)

- **What:** A pack of 175 skills (as of 2026-11) for AI coding agents like Claude Code from the game-art platform Scenario. Most connect to Scenario's MCP server to make art, sprite animations, textures, 3D, video and audio. A separate "expert tools" set drives Blender, Unity, Godot, Unreal, Maya, ZBrush and Roblox Studio right on your own PC—the 15 Blender skills alone were distilled from ~200 tutorial videos and tested on Blender 5.2.
- **Where it fits:** Worth reading even if you never sign up for Scenario. The docs pack solid notes on sprite-sheet grid math and cross-frame character consistency, and the local expert tools don't need a Scenario account at all.
- **License:** MIT (commercial use OK, keep the notice). Running Scenario's hosted skills requires an account and paid credits.
- **Specs:** Install with `npx skills add`; local expert tools require the host app installed.
- **Status:** Looked at (2026-11-07)
- **Verdict:** Since we generate art locally in ComfyUI, Scenario's cloud skills can sit on the shelf. Our home PC does have Blender 5.2, though, so the Blender pack is first up next time we stage 3D mannequins.

## Making motion (AI video)

Image models have goldfish memory between frames—generate poses one at a time and stitching them together looks choppy. The community workaround gaining steam is to **animate the character in a video model, then slice out frames**. My current game relies on five still poses plus code-driven bounce, so I don't need this yet, but the moment I build a game with full walk and run cycles, I'm reaching right here.

### Making 2D character motion with AI video (community recipe)

- **What:** A six-step pipeline making the rounds: ① draw an 8-direction sheet with an image AI like GPT; ② stage the target motion on a 3D mannequin (or just film yourself doing it); ③ feed both character art and motion clip to a video model like Alibaba's Wan family; ④ attach an acceleration LoRA to cut step count; ⑤ pull the character off the background with SAM2; ⑥ pad between-frames with RIFE for silky motion.
- **Where it fits:** Top-down 8-direction RPGs where direction × action explodes combinatorially, or smooth hand-drawn games that want fluid animation.
- **License:** Wan 2.2 (including Animate), acceleration LoRAs and SAM2 are Apache-2.0; RIFE is MIT. All commercially usable. Under OpenAI's terms, GPT outputs belong to you.
- **Specs:** Step ③ is the beast—a 14B model that barely squeezes onto 12GB VRAM as a 4-bit (GGUF) build.
- **Status:** Looked at (2026-11-18); step ③ tested on its own (2026-10-28)
- **Verdict:** Good to go for smooth art. **For pixel art, two steps actually work against you.** Smooth video frames shimmer when quantized into dots (lock the first frame's grid and palette onto every frame), and RIFE invents extra frames when pixel animation lives on snappy 6–8 frame cycles—you want to **prune** frames, not pad them. For pixel sprites, replace ⑥ with "pick one clean cycle → pin the feet → lock grid and palette."

### [Wan 2.2](https://huggingface.co/Wan-AI/Wan2.2-I2V-A14B) video models (I2V · [Animate](https://huggingface.co/Wan-AI/Wan2.2-Animate-14B))

- **What:** Alibaba's open video models. I2V animates one picture from text; Animate pairs one picture with a **motion clip** so your character mirrors the movement. A follow-up, [Wan-Animate-2](https://huggingface.co/Wan-AI/Wan2.2-Animate-2-14B), is out as well, and 12GB-friendly builds live at [QuantStack GGUF](https://huggingface.co/QuantStack/Wan2.2-Animate-14B-GGUF).
- **Where it fits:** Full-body motions that need real weight and continuity—walking, swinging, casting. Put the same image at both start and end and you get a clean walk loop.
- **License:** Apache-2.0.
- **Specs:** I2V 14B Q4 GGUF on 12GB takes ~89 seconds per short clip and fills 11.8GB VRAM (practically touching the ceiling).
- **Status:** Tested (I2V 2026-10-28; Animate looked at 2026-11-18)
- **Verdict:** Walks flowed and looped far better than frame-by-frame image generation. Three lessons from testing: putting the Lightning LoRA on the high-noise side freezes the legs, attacks need "feet planted" or the character ice-skates, and a fixed pixel grid beats auto-detection. The look drifted too far from the cute pixel style I wanted, so I pivoted back to style hunting. Reference pipeline: [pixel-video-sprites](https://github.com/cueqzapper/pixel-video-sprites) (MIT).

### Finishing tools: [SAM2](https://github.com/facebookresearch/sam2) cutouts · [RIFE](https://github.com/hzwer/Practical-RIFE) frame interpolation

- **What:** Click your character once on frame one and SAM2 tracks and cuts them out across the whole clip. RIFE invents intermediate frames to smooth out motion; in ComfyUI it's available via [Frame-Interpolation nodes](https://github.com/Fannovel16/ComfyUI-Frame-Interpolation).
- **Where it fits:** SAM2 when character colors bleed into the background and simple chroma key fails; RIFE when stretching smooth-art motion up to 24–60 fps.
- **License:** SAM2 is Apache-2.0, RIFE is MIT.
- **Specs:** Featherweight compared to the video model—practically free to run.
- **Status:** Looked at (2026-11-18)
- **Verdict:** If your video model gives a clean flat background, plain chroma key is enough and SAM2 can wait. Keep RIFE away from pixel sprites: blended in-between frames turn crisp pixels into blurry mush.

## Making 3D models

### One picture → a game-ready 3D prop (ComfyUI community pipeline, [original post](https://gall.dcinside.com/mgallery/board/view/?id=aidevelop&no=8429))

- **What:** A ComfyUI graph that turns a single front-facing picture into a ~2,000-face low-poly GLB with 2048px color, roughness, metallic and normal maps. The assembly line: background removal (BiRefNet) → camera angle estimate (MoGe 2) → mesh generation ([TRELLIS.2](https://github.com/microsoft/TRELLIS.2) or [Pixal3D](https://huggingface.co/TencentARC/Pixal3D)) → hole filling and decimation (WTiVo, LODTailor, calling Blender under the hood) → texturing ([UltraTex](https://github.com/Mstafa-awad/UltraTex-ComfyUI-nodes)). The appeal: zero Tripo or Meshy credits, so you can re-roll on your own PC all afternoon.
- **Where it fits:** Small props—crates, weapons, furniture—for non-first-person 3D games. No rig comes out, so characters still need AccuRIG or Mixamo, and whatever isn't in the picture (like the back) gets improvised by the AI.
- **License:** The geometry side (TRELLIS.2, Pixal3D, MoGe code, BiRefNet) is MIT and cleanup nodes are MIT or GPL-3.0—all clear. The landmine is texturing: UltraTex leans on FLUX.2 klein base 9B, which is **non-commercial**, so for a paid game stop after the mesh and paint textures with TRELLIS.2's built-in painter or by hand.
- **Specs:** On the author's RTX 5070 Ti 16GB: ~4.5 min at 1024, ~9.5 min at 2048, ~20 min at 4096. Keep it in a separate ComfyUI install (Python 3.12, torch 2.8) so it doesn't collide with your main setup. On Korean-locale Windows, one node trips over text encoding; launching in UTF-8 clears it up.
- **Status:** Looked at (2026-11-23)
- **Verdict:** Notebook RPG is 2D, so no job for it yet—but if I ever build a 3D game, this is candidate #1 for mass-producing props. With 12GB VRAM on my PC, 1024 is the sensible starting rung.

## Backgrounds and depth

### 3D blockout + AI paintover for 2D backgrounds with depth ([HD-2D](https://en.wikipedia.org/wiki/HD-2D), [Midjourney→Blender 2.5D test](https://hitmarker.net/news/utilizing-midjourney-generated-ai-artworks-to-create-a-2-5d-location-for-an-adventure-game-522580))

- **What:** I came across a four-step workflow: "generate character sprites with AI → build a gray 3D blockout in Blender and place the character → paint over that render with GPT Image → rebuild the 3D background in Blender from the painted render." Under the hood it isn't brand-new magic—it stitches together two classic tricks with AI: concept art's **gray blockout + paintover** and film VFX's **camera projection**. 3D locks down perspective and scale, AI supplies texture and mood, and returning to 3D buys parallax, lighting and occlusion that flat art can't fake.
- **Where it fits:** Quarter-view or top-down RPGs and adventures with a mostly fixed camera. HD-2D (*Octopath Traveler*: 3D sets with pixel characters) and *Disco Elysium* (hand paintover on 3D renders) run on the same principle. The closest AI example is a 2023 2.5D adventure demo that recovered Midjourney cameras with fSpy and rebuilt the scenes in Blender. I haven't spotted a shipped game using all four steps verbatim yet.
- **Tools:** [SpriteGen](https://spritegen.ai/) or [Ludo.ai](https://ludo.ai/features/sprite-generator) for sprites, Blender (free) for blockout and projection, fSpy (free) for camera matching from one image, and [StableGen](https://github.com/sakalond/StableGen) (a Blender–ComfyUI add-on) to paint and project right inside Blender.
- **License:** Blender is GPL, StableGen is GPL-3.0; check whatever image model you use for paintovers separately. SpriteGen allows commercial use of sprites made with paid credits.
- **Specs:** Blender and fSpy run on any ordinary PC; local StableGen paintovers want 8GB+ VRAM (SDXL baseline).
- **Status:** Looked at (2026-10-28)
- **Verdict:** Side-view pixel stickers leave no room for 3D sets in Notebook RPG. Still, "lock perspective with a gray blockout first, then let AI paint" is worth stealing on its own whenever you need consistent angles across multiple backgrounds—and for a quarter-view next game, the whole recipe is on the table.

## Game screens (UI)

### [UI Glossary](https://tuiella.github.io/ui-glossary/) (Korean)

- **What:** A Korean illustrated dictionary of ~140 game UI components—health-bar trails, hit vignettes, bestiary silhouettes and more—each with a visual example.
- **Where it fits:** Skim it while designing a new screen and every missing piece jumps out. Better yet, you can ask an AI for things by their real name instead of waving your hands at "you know, that red flash on the edges."
- **License:** None stated. Fine to link; we don't republish its contents.
- **Specs:** Any web browser.
- **Status:** In use (2026-10-28)
- **Verdict:** Running Notebook RPG's screens against it surfaced six concrete improvements right away. Staying permanently open on the desk.

### [Game UI Database](https://www.gameuidatabase.com/)

- **What:** A free library of game screenshots curated by UI designer Edd Coates, covering 300+ titles filterable by screen type (shops, inventories, HUDs, popups) and vibe (wood, paper, grunge). Plenty of 2D pixel games, roguelites and turn-based/card games like *Celeste*, *Shovel Knight* and *Rogue Legacy*.
- **Where it fits:** Before mocking up a new screen, when you want to see how ten shipped games solved the same layout. Handing an AI a screen type plus two reference games beats three paragraphs of description.
- **License:** No reuse terms stated; screenshots belong to their respective studios, so browse for inspiration only.
- **Specs:** A web browser. Free, no sign-up, just a tip jar.
- **Status:** Looked at (2026-11-06)
- **Verdict:** The UI Glossary gives you the names; this shows you the real furniture. Together they cut UI back-and-forth with AI in half.

### [skullet](https://github.com/lochie/skullet)

- **What:** A library that draws gray loading skeletons sized to the exact content about to arrive. Works with React, Vue, Svelte and plain JS, measuring bars for text lines and boxes for images so nothing jumps when data lands. Themeable shimmer, pulse and colors.
- **Where it fits:** Data-heavy screens—lists, cards, profiles—where the app shell is already loaded and only a few slots are waiting on the server.
- **License:** MIT (commercial use OK, keep the copyright notice).
- **Specs:** Any web browser. Still at v0.0.3 as of 2026-11, so very early days.
- **Status:** Looked at (2026-11-04)
- **Verdict:** Our longest wait happens while the game bundle itself downloads, before skullet would even arrive. Borrowing just the core idea—sketching the incoming screen's outline in place—as a pencil-draft loading screen baked right into the initial HTML was a much better fit.

### [Impeccable](https://github.com/pbakaus/impeccable)

- **What:** A skill pack that hands coding agents like Claude Code a real design vocabulary: 24 commands including `bolder`, `quieter`, `polish`, `critique` (scored usability review) and `audit` (accessibility, performance and responsiveness). It also ships 62 deterministic rules that catch classic "AI-generated page" tells—purple gradients, cards inside cards, Inter everywhere—and those run without an LLM in your terminal or CI.
- **Where it fits:** When "make it look nicer" is too vague to be useful. Pick one command for direction and point it at one target (`critique the pricing cards`), and the output stops drifting.
- **License:** Apache-2.0 (commercial use OK, keep the notices).
- **Specs:** `npx impeccable install`. Needs Node and downloads an engine binary on first run. One heads-up: in browser live mode, Apply invokes codex or claude with permission checks off if no chat agent is listening. Set `IMPECCABLE_LIVE_COPY_AGENT=chat` to stay safe.
- **Status:** Tested (2026-11-07)
- **What we found:** Running just the checker flagged 18 spots in code and 8 on our cover screen—and zero actually needed fixing. Most were thick left borders mistaken for an "AI tell," when in our game they're literally notebook margin lines and red-pen marks; the grid is graph paper, the stripes are ruled lines, and the cyan glint is a sticker hologram. Contrast and tiny-text checks, meanwhile, passed cleanly on both PC and phone. One quirk: scanning a URL only inspects the landing screen, so deeper screens needed saved HTML snapshots.
- **Verdict:** Same family as unslop, but richer commands and a mechanical linter attached. Tuned for crisp corporate sites, so filter out rules that clash with deliberately wobbly, hand-drawn charm. Great to pull out `critique` and `audit` on new screens.

## Game feel

### [Game Feel demo (Deepnight)](https://deepnight.net/games/game-feel/)

- **What:** A tiny 2D action toy Deepnight Games built to demonstrate game feel (v2, May 2024). Tap Enter to toggle one feel ingredient at a time and watch identical mechanics go completely lifeless the instant feedback disappears. Windows and WebGL downloads available, plus public [source](https://github.com/deepnight/gamefeel).
- **Where it fits:** Early prototype stage. Spend two minutes here before telling an AI to "add juice," and your requests suddenly sound like you know what you're talking about.
- **License:** Not stated on the page; check the source repository's license before borrowing any code.
- **Specs:** Windows, or grab the WebGL build and open it in a browser.
- **Status:** Looked at (2026-11-03)
- **Verdict:** Proves in thirty seconds that the exact same rules with different feedback feel like an entirely different game.

### [Juice It or Lose It](https://www.youtube.com/watch?v=Fy0aCDmgnxg)

- **What:** Martin Jonasson and Petri Purho's classic 2012 talk. They start with a bare-bones brick-breaker and layer on particles, audio, squash-and-stretch and screen shake one piece at a time to show what "juice" really does.
- **Where it fits:** Deciding what order to layer polish in—and where to stop before the screen turns into a fireworks show.
- **License:** Video—link only.
- **Specs:** Any web browser.
- **Status:** Looked at (2026-11-03)
- **Verdict:** The classic everyone cites for a reason. For a quiet game like Notebook RPG, half of what's in this talk is already plenty.

### [Names of Game Feel](https://tuiella.github.io/b3/sonmat/) (Korean)

- **What:** A B3 column from the author of the two glossaries above, breaking down thirteen game-feel parts—popping damage numbers, rolling counters, easing, hitstop, screen shake, coyote time—in a tight "when it feels flat → A/B demo → how to ask for it" format, complete with slow-motion playback.
- **Where it fits:** When you want exact words to hand an AI instead of "make hits feel punchier." Every entry includes a ready-to-copy prompt with real numbers ("pause both for 0.06 seconds") plus the English term.
- **License:** None stated. Link freely; don't republish.
- **Specs:** Any web browser.
- **Status:** Looked at (2026-11-06)
- **Verdict:** If talks teach you *why* feel matters, this teaches you *what to say*. "Feedback tiers"—saving big effects so big moments actually land—fits a calm game like ours like a glove.

### Measuring the moment of a press (screen recording + response time)

- **What:** A homegrown check we built ourselves. Headless Chrome's screencast (CDP) captures timestamped frames every 1/60 s after a click, while Event Timing measures "press → next frame" in milliseconds. A 4× CPU throttle mimics a tired old phone.
- **Where it fits:** Turning a vague "feels a bit sluggish" into hard numbers, and catching beats out of order—like an outcome showing up before its cause.
- **License:** Standard Chrome and Playwright features.
- **Specs:** Any laptop.
- **Status:** Tested (2026-11-03)
- **Verdict:** This caught our scene spoiling the outcome 1.1 seconds before the die even finished rolling. By eye alone, we never spotted it.

## Pixel art

### [Pixel Shading Glossary](https://tuiella.github.io/pixel-glossary/) (Korean)

- **What:** An illustrated Korean guide to pixel-art vocabulary—light, shadow, color, animation and workflow—with crisp before-and-after examples.
- **Where it fits:** A review checklist for AI-generated pixel art. One precise term gets ten times further than "make the shading nicer."
- **License:** None stated. Link only; don't copy contents.
- **Specs:** Any web browser.
- **Status:** In use (2026-10-28)
- **Verdict:** Permanent bookmark for any project that touches pixels.

### [Names of Pixel Problems](https://tuiella.github.io/b3/dot/) (Korean)

- **What:** Another B3 column from the same author, sorting fifteen pixel-art complaints—the "why is it buzzing?" kind—into symptom → cause → fix: boiling, pivot jitter, alpha fringe, mixels, integer scaling, rotation artifacts, fixed palettes and more. Interactive buttons let you highlight changed pixels or toggle a grid overlay.
- **Where it fits:** Reviewing AI-generated sprites and animations. If the shading glossary teaches how to paint, this one is the diagnostic chart for what went sideways.
- **License:** None stated. Link only; don't republish.
- **Specs:** Any web browser.
- **Status:** Looked at (2026-11-06)
- **Verdict:** If you generate animation frames one by one with AI, start with entry #1: "boiling." Separately drawn frames wiggle pixels that had no business moving.

### [You Need to Know Light](https://tuiella.github.io/b3/light/) (Korean)

- **What:** Part 1 of the same author's B3 series on graphics engines and light math. Eight interactive chapters follow a pixel from texture to screen: encoded values vs. linear light, gamma curves, linear math, HDR and exposure, tone mapping, LUT color grading, color gamuts and output encoding—ending with five questions to ask when colors look off.
- **Where it fits:** Troubleshooting "the colors look muddy," "highlights are blown out," or "it looks totally different on my phone." Even 2D games hit the exact same math whenever you layer alpha, downscale art, or tint for time of day.
- **License:** None stated. Link only; don't republish.
- **Specs:** Any web browser.
- **Status:** Looked at (2026-11-09)
- **Verdict:** Plenty of 3D engine talk, sure, but carrying away just one question—"where did the blending happen?"—untangles most 2D color mysteries too.

### [Dynamic Lights: How They Work and How to Use Them](https://tuiella.github.io/b3/light2/) (Korean)

- **What:** Part 2 of the series. Starts from baked light vs. distance-only light vs. surface-direction light (normal maps), then walks through light types, falloff, masking, 2D shadows and performance cost. Wraps up with adding a single torch, time-of-day moods, darkness as gameplay, and where lighting clashes with pixel art—backed by a tavern demo where you can flip every effect on and off.
- **Where it fits:** Night scenes, lanterns, torches and day/night cycles. Two takeaways transfer straight to an engine-less web game: "when ambient light is high, dynamic lights are just expensive decoration," and "pixel art keeps its palette when brightness snaps to a few steps."
- **License:** None stated. Link only (the demo's torch sprite is MIT).
- **Specs:** Any modern browser with WebGL2.
- **Status:** Looked at (2026-11-18)
- **Verdict:** Most games never need normal maps. Design just needs two short lists up front: which lights turn on and off during play, and what must remain readable no matter how dark the scene gets.

### Recovering the pixel grid ([unfake](https://pypi.org/project/unfake/), [proper-pixel-art](https://github.com/KennethJAllen/proper-pixel-art))

- **What:** Detects the hidden pixel grid inside an AI's "big picture that merely looks like pixel art" and samples one representative color per cell to restore true 1× pixel art. We rolled our own post-processor following the exact same steps.
- **Where it fits:** The final gate before AI pixel art enters a game. Naive downscaling smears cells and erases faces; recovering the native grid saves even single-pixel eyes.
- **License:** Check each tool's repository before use (our own script lives inside the game repo).
- **Specs:** Plain Python, no GPU required.
- **Status:** Tested (2026-10-20)
- **Verdict:** Always quantize colors *after* reading the grid cells. Flip that order and eyes and rosy cheeks vanish on the spot.

### [pixelfx](https://github.com/patch-gg/pixelfx)

- **What:** 244 pixel-art effects drawn purely in code—no image files: fire, ice, lightning, holy, shadow, nature, status ailments, pickups and more. Each carries a timing table (wind-up → hit freeze → recovery) and exports as a transparent PNG strip plus frame JSON.
- **Where it fits:** When every named spell deserves its own silhouette—"Grasping Hands" pulls hands out of the earth; "Entangling Roots" wraps vines around ankles. Colors swap via options.
- **License:** MIT (commercial use and edits fine, keep the copyright notice). The bundled font is the one exception.
- **Specs:** Node 18+, zero extra dependencies.
- **Status:** In use (2026-11-03, 11 spell effects)
- **Verdict:** Designed to glow against dark dungeons, so on a bright notebook page the glow vanishes. Keeping native scale (sized to a 24×38-pixel dummy) and swapping in our palette worked cleanly; scaling up made the dots blocky. Turning glow off and redrawing its job as solid opaque bands made every spell pop on white paper.

### [Sprite stacking](https://www.spritecook.ai/blog/sprite-stacking-pixel-art)

- **What:** Slice an object into 1-pixel horizontal layers and stack them bottom to top. Rotate every slice by the same angle and offset each one a pixel higher, and a pixel sprite rotates smoothly through 360° with zero 3D models. The SpriteCook blog (2026-11-14) walks through a race car from slicing to rendering across engines.
- **Where it fits:** Rigid objects that spin in top-down games—cars, boats, tanks, houses, trees. Skip it for characters with swinging limbs or side-view games.
- **License:** It's an old, public technique with no tool lock-in. The article uses SpriteCook's slicer (free tool, paid credits for AI art), or you can export layers for free from MagicaVoxel.
- **Specs:** Any browser with Canvas 2D. Cost scales as layers × objects per frame, so hundreds of rotating props will get heavy.
- **Status:** Tested (2026-11-20, a 14-layer code-built house comparing rotation and camera tilt)
- **Verdict:** Nail the three-step draw order (lift, squash vertically, rotate) and it fits in under twenty lines of code. A vertical squash around 0.75 felt right; down at 0.5 the layers pulled apart and split the roof. Outline the finished stack once at the end—outlining each slice turns the body into pinstripes.

### Faking pixel art with low-res 3D ([original post](https://gall.dcinside.com/mgallery/board/view/?id=game_dev&no=238263), Korean)

- **What:** Draw zero pixel art: build the scene from Three.js boxes and cylinders, render it at a tiny resolution, and blow it up so it reads as a pixel game. A designer built a snowy drift game this way, and because it's 3D, headlights and police sirens light up the snow in real time while tire marks and snowfall come for free. Three.js's `RenderPixelatedPass` example is the starting point.
- **Where it fits:** Top-down or angled driving, chase and exploration games where light and weather carry the mood—especially when hand-drawing a car in every direction is wearing you out. Not for Notebook RPG's side-view stickers.
- **License:** Three.js is MIT.
- **Specs:** Any WebGL browser. Rendering small actually makes it lighter on phones.
- **Status:** Looked at (2026-11-26)
- **Verdict:** The usual snag is pixels shimmering when the camera moves, so build in camera snapping to whole pixels from day one. A few rotating objects? Sprite stacking. Light, shadow and weather too? This. The same post's "hit a hydrant, it makes ice, and your own car slips too"—player and enemies sharing one rulebook—is worth stealing as well.
