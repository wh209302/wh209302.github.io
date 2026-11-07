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

- **What:** Feed it one anime-style illustration and it splits hair, face, eyes, clothes and more into up to 23 transparent layers, fills in the hidden parts, and hands back a Photoshop file (PSD). It's a SIGGRAPH 2026 paper. It doesn't rig anything, so free tools like Anime2.5DRig below take over from there.
- **Where it could fit:** Big standing portraits on a dialogue screen with blinking and lip movement. The tedious hand-splitting of layers just disappears.
- **License:** Code is Apache-2.0, the layer model is OpenRAIL++ (commercial use allowed, with misuse restrictions), the body-part model is Apache-2.0. The depth model's page wouldn't load, so that one isn't confirmed yet.
- **Hardware:** A 12GB graphics card runs it at about 10GB with the memory-saving setting (about 1.5x slower). There's a lighter 8GB version, and ComfyUI nodes exist.
- **Status:** Looked at (2026-10-28)
- **Verdict:** Notebook RPG draws face parts, head and body separately from the start, and they're small pixel stickers, so there's nothing to split. For a next game with big illustrated characters, it's the top candidate.

### [Anime2.5DRig](https://github.com/852wa/Anime2.5DRig)

- **What:** Drop a PSD split into parts into the browser and it rigs it on its own, adding breathing, blinking, mouth movement and swaying hair. It's built to take see-through's PSD as is, so the two snap together. You can try it on the [demo page](https://852wa.github.io/Anime2.5DRig/) with no install.
- **Where it could fit:** Turning a dialogue portrait into a short breathing, blinking loop for a game. It records transparent WebM, so you just play the clip. The real-time renderer (WebGL) is open too, so with some work it could run inside the game itself.
- **License:** MIT (commercial use OK, keep the notice). The bundled PSD reader is MIT and face tracking is Apache-2.0. The sample art belongs to its artists, so don't use it.
- **Hardware:** Just a browser. Everything runs on your own machine and the art never leaves it.
- **Status:** Tried (2026-10-28, breathing and blinking checked with the sample)
- **Verdict:** It's made for front-facing upper-body anime illustrations, so it doesn't fit small pixel stickers. Paired with see-through, "one picture → moving portrait" is nearly automatic, so it comes off the shelf together with see-through for a next game with big portraits.

### Fixing AI-drawn fingers (community tips)

- **What:** What people do when an image AI like GPT keeps getting the fingers wrong in one pose no matter how often you ask. Roughly in order of popularity: (1) change the hand so the problem goes away (a fist gripping the staff, hand in a sleeve, behind the back); (2) stop repeating in the same chat, open a new one with the original picture and one line about the hand only; (3) paint just the hand with the select (brush) tool and fix that; (4) paste a good hand from another frame or touch up a few pixels by hand; (5) crop the hand large, redraw it in another tool, shrink it back.
- **Where it could fit:** Small-hand art like 2-head-tall stickers. When a hand is a few pixels, (1) and (4) are fastest. ComfyUI hand-fix nodes (HandRefiner, MeshGraphormer) were trained on realistic hands and don't suit chibi art well.
- **License:** Not applicable, these are techniques.
- **Hardware:** (5) needs an edit model such as Qwen-Image-Edit in ComfyUI plus a crop-and-stitch node ([Inpaint CropAndStitch](https://github.com/lquesada/ComfyUI-Inpaint-CropAndStitch)).
- **Status:** Looked into (2026-10-29)
- **Verdict:** Making a "check every finger" instruction longer shook the other instructions. Naming a concrete hand shape, or fixing the hand on its own, works better than adding more rules.

## Image generation (ComfyUI)

Things I ran myself in ComfyUI on my PC (12GB of video memory). The test stories are in the [AI lab](/en/categories/ai-lab/) category.

### [Anima](https://huggingface.co/circlestone-labs/Anima) + pixel/sprite LoRAs

- **What:** A 2B image model that is strong at anime styles. Its structure differs from SDXL, so SDXL pixel checkpoints and LoRAs can't be mixed in; you use Anima-specific LoRAs from Civitai. For the test I grabbed an RPG side-view battle sheet LoRA (svactors), a pixel sprite style (Elin) and an RPG walk sheet (rpgchara).
- **Where it fits:** Getting many motions of one character as a single sheet. Because it's all drawn in one image, face, clothes, colors and pixel size barely drift between frames.
- **License:** The model is under the CircleStone Labs Non-Commercial License, but generated images may be used commercially (section 2(e)). Running the model inside a revenue-generating service or using it to train models commercially is not allowed. The LoRAs block or restrict selling images, so test use only.
- **Specs:** About 55 seconds for one 2048×1360 sheet on 12GB (roughly 1 second per frame).
- **Status:** Tested (2026-10-28)
- **Verdict:** Best consistency, small motions. The walk is closer to breathing in place and the attack is just an arm thrust, so big motions came out best with the reference adapter below.

### [Anima Ref Adapter](https://github.com/ElectronGirl/ComfyUI-Anima-Ref-Adapter)

- **What:** ComfyUI nodes plus a small LoRA (92MB) that keep a character's hair, eyes and outfit from one reference image while the prompt changes pose and background. No character name or appearance tags needed, so it works for original characters.
- **Where it fits:** After settling a character with a one-image sheet, feed one cell in as the reference to get big motions like walking or swinging with the same face.
- **License:** Node code Apache-2.0; adapter weights under the CircleStone Non-Commercial License. As with Anima, generated images may be used commercially.
- **Specs:** Anima base v1.0 and bf16 only (fp16 overflows), 30 steps, cfg 4.5, ref_guidance 4.5–5. V2 (183MB) arrived on 2026-10-29: a single node to drop in, and one image went from 55 to 33 seconds on 12GB. Two reference images side by side give two characters. The author says development has stopped for lack of funding.
- **Status:** Tested (2026-10-28, V2 2026-10-29)
- **Verdict:** The only route so far that gave both consistency and big motion. It mostly faces left (flip to fix), draws a ground line under the feet, and small patterns and held props shift a little per frame. The test story is in [Same Face, Walking and Swinging](/en/2026/10/28/anima-motion/). With V2, a pose written in plain text was enough for attack, cast and knocked-down poses, so it became our default for one character in many poses ([Pose by Words, Face by Picture](/en/2026/10/29/same-character-poses/)).

### [Anima ControlNet VACE Depth](https://huggingface.co/TaihoC/Anima-ControlNet-VACE-Depth)

- **What:** Weights that steer an Anima drawing's pose and silhouette from a depth map (a grey image where near is bright and far is dark). Needs a patched Advanced-ControlNet node.
- **Where it fits:** Making a drawing follow a pose built in Blender or with a mannequin. It ran together with the reference adapter without the two getting in each other's way.
- **License:** Weights under the CircleStone Non-Commercial License; node under GPL-3.
- **Specs:** 596MB; about 37 seconds per image on 12GB together with the reference adapter.
- **Status:** Tested (2026-10-29)
- **Verdict:** The silhouette follows, but blunt depth maps from a mannequin couldn't place arms or weapons, so it wasn't much better than writing the pose in text. Depth alone without the adapter sometimes drew two people. Worth another look once we have crisp Blender depth maps showing arms and weapons.

### [Krea 2 Turbo](https://huggingface.co/krea/Krea-2-Turbo) + [pixel LoRA](https://huggingface.co/e-n-v-y/Krea-2-Pixel-Art)

- **What:** The 8-step version of a 2026 image model, plus a pixel-art LoRA on top. The LoRA draws on a 128-cell grid, so the dots come out very even.
- **Where it helps:** Cleaning up the dots of an image drawn by another model. A 0.45 redraw gives the cleanest dots. It erases artist flavour added earlier, but going lighter (0.20–0.30) or skipping it left the dots jittery and unusable in practice.
- **Licence:** Model under the Krea 2 Community License (commercial use allowed for companies under $1M yearly revenue); pixel LoRA under MIT.
- **Specs:** fp8 build 13.1GB, about 13 seconds per 1024² image, peak VRAM about 11.2GB. "full body" alone crops the feet, so always add "head to toe, with margin".
- **Status:** Tested (2026-10-28)
- **One-line verdict:** The cleanest dots among pixel routes with open commercial terms. On its own, different seeds give similar pictures, so leave the drawing to another model and use this for finishing. The story is in [Hunting an anime pixel style](/en/2026/10/29/pixel-style-hunt/).

### [Anima Style Explorer](https://github.com/ThetaCursed/Anima-Style-Explorer)

- **What:** A list of the 59,000-plus artist names Anima learned, and a page to browse one sample per artist drawn with the same prompt.
- **Where it helps:** Steering style with artist tags. A name that isn't on the list does nothing, so check it first.
- **Licence:** As stated in the repository. We only used the name list.
- **Status:** Used (2026-10-28)
- **One-line verdict:** We matched 400 pixel/chibi artists from an image board against this list and got 243. Artist tags work well at the Anima stage, but a later redraw step can erase them, so look at the image after every step.

### [Qwen-Image-Edit-2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511)

- **What:** An edit model that changes an image by instruction ("change only the pose", "add a kerchief") instead of drawing from scratch. With the 4-step Lightning LoRA and a 4-bit GGUF build it runs on 12GB.
- **Where it fits:** Making swing, pray, hurt and fall poses from one standing character. Face, clothes, colors and style stay almost intact.
- **License:** Apache-2.0 (model, Lightning LoRA and GGUF builds).
- **Specs:** About 23GB of downloads, 20–25 seconds per image, peak video memory about 11.4GB.
- **Status:** Tested (2026-10-21, retested on Anima art 10-28)
- **Verdict:** The most reliable way I've seen to get many poses of one character. Direction and size can change between frames, so plan on a post-processing pass to align them.

### [Z-Image Turbo](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo)

- **What:** A fast 8-step image model that follows sentence prompts better than tags.
- **Where it fits:** Drafting pixel characters when commercial release is on the table. It follows asks like two heads tall, big eyes and blushing cheeks.
- **License:** Apache-2.0.
- **Specs:** On 12GB use the int8 build (bf16 doesn't fit).
- **Status:** Tested (2026-10-20)
- **Verdict:** First pick for a commercially safe pixel route. Negative prompts don't work, and writing "no white" actually paints white.

### Baking a style LoRA with [kohya sd-scripts](https://github.com/kohya-ss/sd-scripts)

- **What:** A LoRA training tool that teaches a model your style from a handful of examples.
- **Where it fits:** Once the style is fixed and you need a steady stream of new characters in the same look.
- **License:** The tool is Apache-2.0; the resulting LoRA follows the base model's license.
- **Specs:** SDXL base, 13 examples, 2,100 steps in 26 minutes, 8.4GB of video memory.
- **Status:** Tested (2026-10-21)
- **Verdict:** Colors and details come quickly, but teaching a stubborn proportion like two heads tall needs dozens of examples. About 1,400 steps was best.

### [Scenario Agent Skills](https://github.com/scenario-labs/skills)

- **What:** A skill pack for AI coding agents from the game-art service Scenario. It has 175 skills as of 2026-11 and works with Claude Code. Most of them teach an agent to make images, sprite animation, textures, 3D, video and audio through Scenario's server (MCP). A separate set of "expert tools" drives Blender, Unity, Godot, Unreal, Maya, ZBrush and Roblox Studio directly on your machine. The Blender set, for example, has 15 skills distilled from about 200 videos, and its notes say it was tested on Blender 5.2.
- **Where it helps:** The skill texts are worth reading even if you don't use Scenario. They cover things like sprite-sheet frame math and keeping one character consistent across many actions. The expert tools only need the app itself, not Scenario.
- **License:** MIT (commercial use OK, keep the notice). Actually running the Scenario skills needs a Scenario account and paid credits.
- **Requirements:** Install with `npx skills add`. The expert tools need the app installed.
- **Status:** Looked into (2026-11-07)
- **Verdict:** We make our art with ComfyUI on a home PC, so the Scenario skills have no job here yet. The home PC has Blender 5.2, though, so the Blender set is the first thing to try next time we pose mannequins.

## Backgrounds and depth

### 3D blockout + AI paintover for 2D backgrounds with depth ([HD-2D](https://en.wikipedia.org/wiki/HD-2D), [Midjourney→Blender 2.5D test](https://hitmarker.net/news/utilizing-midjourney-generated-ai-artworks-to-create-a-2-5d-location-for-an-adventure-game-522580))

- **What:** I ran into a post with this recipe: "make character sprites with an AI sprite generator → build a gray 3D model in Blender and put the character in it → paint over that render with GPT image → rebuild the 3D background in Blender from that painting." Pull it apart and it isn't a new trick so much as two old ones stitched together with AI. One is concept art's **paint over a gray blockout**, the other is film compositing's **project a painting onto 3D surfaces** (camera projection). 3D nails the perspective and scale, AI adds texture and mood, and going back to 3D buys the parallax, lighting and occlusion a single picture can't give you.
- **Where it could fit:** Quarter-view or top-down RPGs and adventure games where the camera barely moves. HD-2D (Octopath Traveler: 3D sets with pixel characters) and Disco Elysium (hand paintover on 3D renders) work on the same idea. The closest AI case is a 2023 2.5D adventure test that recovered the camera of Midjourney images with fSpy and rebuilt them in 3D in Blender. I haven't found a shipped game that used all four steps as written.
- **Tools:** AI sprite generators like [SpriteGen](https://spritegen.ai/) or [Ludo.ai](https://ludo.ai/features/sprite-generator) for sprites, Blender (free) for blockout and projection, fSpy (free) to recover the camera from one picture, and [StableGen](https://github.com/sakalond/StableGen) (a Blender add-on wired to ComfyUI) to paint over and project in one go inside Blender.
- **License:** Blender is GPL, StableGen is GPL-3.0. Check the image model used for the paintover on its own. SpriteGen allows commercial use of sprites made with paid credits.
- **Hardware:** Blender and fSpy run on an ordinary PC. Local paintover with StableGen wants 8GB+ of graphics memory (for SDXL).
- **Status:** Looked at (2026-10-28)
- **Verdict:** Notebook RPG is a side view of small pixel stickers, so there's no room for a 3D set. But "fix the perspective with a gray model first, then let the AI paint" is worth pulling out on its own to keep perspective consistent across many backgrounds, and for a quarter-view next game the whole recipe is a candidate.

## Game screens (UI)

### [UI Glossary](https://tuiella.github.io/ui-glossary/) (Korean)

- **What:** A Korean dictionary of about 140 game screen parts, like health bar trails, hit vignettes and bestiary silhouettes, each with an example picture.
- **Where it could fit:** Go through it line by line while designing a new game's screens and the missing parts jump out. You can also order things from AI by their proper name instead of "you know, that thing."
- **License:** None stated. Linking is fine, but I don't copy its contents here.
- **Hardware:** Any web browser.
- **Status:** In use (2026-10-28)
- **Verdict:** Checking Notebook RPG's screens against it turned up six improvement ideas. It'll stay useful whatever the game.

### [Game UI Database](https://www.gameuidatabase.com/)

- **What:** A free collection of game screens run by UI designer Edd Coates. You can browse screenshots from 300-odd games by screen type (shops, inventories, HUDs, popups) and by mood (wood, paper, grunge). It includes 2D pixel games, roguelites and card or turn-based games such as Celeste, Shovel Knight and Rogue Legacy.
- **Where it helps:** Before designing a new screen, when you want to see how ten other games solved the same one. Giving an AI the screen type plus a few reference game names gets much closer than describing it in words.
- **License:** The site states no reuse terms. The screenshots belong to their game companies, so we look and learn but don't republish them.
- **Requirements:** A web browser. Free with no sign-up, just a donation button.
- **Status:** Looked into (2026-11-06)
- **Verdict:** If the UI glossary gives you the names, this shows you the real thing. Used together they make screen meetings faster.

### [skullet](https://github.com/lochie/skullet)

- **What:** A library that draws a gray skeleton the exact size of the content that's on its way. It works with React, Vue, Svelte and plain JS, measures a bar for every line of text and a box for every image, so nothing jumps when the content lands. Shimmer or pulse motion and colors are themeable.
- **Where it could fit:** Screens full of server-fed slots like lists, cards and profiles, where the app is already running and only a few slots inside it are waiting.
- **License:** MIT (commercial use OK, keep the copyright notice).
- **Hardware:** A web browser. Version 0.0.3 as of 2026-11, so it's very early.
- **Status:** Looked at (2026-11-04)
- **Verdict:** Our game's long wait happens while the game code itself downloads, and at that point skullet hasn't arrived either. Borrowing just the idea, "sketch the outline of the coming screen in the same spot", and putting a pencil-sketch loading screen straight into the first HTML fit better than the library.

### [Impeccable](https://github.com/pbakaus/impeccable)

- **What:** A skill that gives coding agents like Claude Code a design vocabulary. It has 24 commands such as `bolder`, `quieter`, `polish`, `critique` (a scored usability review) and `audit` (accessibility, performance and responsiveness checks). It also ships 62 rules that catch the usual "an AI made this" tells: purple gradients, cards inside cards, Inter everywhere. Those rules run without any AI, so they work in a terminal or CI too.
- **Where it helps:** When "make it look nicer" is hard to put into words. Pick one command for the direction and point it at one target (`critique the pricing cards`), and the results wobble far less.
- **License:** Apache-2.0 (commercial use OK, keep the notices).
- **Requirements:** `npx impeccable install`. It needs Node and downloads an engine binary on first use. One caution: in live mode, which edits right in the browser, Apply runs codex or claude with permission checks off when no chat agent is polling. Setting `IMPECCABLE_LIVE_COPY_AGENT=chat` is the safer choice.
- **Status:** Tested (2026-11-07)
- **What we found:** We ran just the checker on our game. It flagged 18 spots in the code and 8 on the cover screen, and none needed fixing. Most were thick left borders read as an "AI tell," which on our screens are notebook margin lines and red-pen marks. The grid background is graph paper, the stripes are ruled lines, and the cyan shine is a sticker's hologram. On the other hand, the contrast and tiny-text checks found nothing on the main game screen, PC or phone. One catch: scanning by URL only sees the first screen. For screens deeper in the game we had to save the HTML and feed it in separately.
- **Verdict:** Same family as unslop, which we used earlier, but with more commands and a mechanical checker attached. It's tuned for company web pages, so rules that fight our deliberately wobbly, cute notebook screens need filtering out first. For new screens, `critique` and `audit` alone look like a good fit.

## Game feel

### [Game Feel demo (Deepnight)](https://deepnight.net/games/game-feel/)

- **What:** A small 2D action prototype Deepnight Games made to teach game feel (v2, May 2024). Each press of Enter switches one feel feature on or off, so you can watch the same rules turn flat the moment the feedback is gone. Windows and WebGL builds are downloadable and the [source](https://github.com/deepnight/gamefeel) is public.
- **Where it helps:** The first prototype of a new game. Play with it before asking an AI to "add juice" and your requests get a lot more precise.
- **License:** Not stated on the page. We won't reuse the code until we've checked the source repository's license.
- **Specs:** Windows, or download the WebGL build and open it in a browser.
- **Status:** Looked into (2026-11-03)
- **Verdict:** Shows in thirty seconds that the same rules with different feedback make a different game.

### [Juice It or Lose It](https://www.youtube.com/watch?v=Fy0aCDmgnxg)

- **What:** A talk by Martin Jonasson and Petri Purho (video, 2012). They take a plain brick-breaker and add particles, sound, squash and stretch and screen reactions one at a time to show what "juice" means.
- **Where it helps:** Deciding the order to add effects in, and where to stop.
- **License:** It's a video, so we only link to it.
- **Specs:** A web browser.
- **Status:** Looked into (2026-11-03)
- **Verdict:** The classic every game-feel discussion cites. For a quiet game like a notebook RPG, half of it is already plenty.

### [Names of Game Feel](https://tuiella.github.io/b3/sonmat/) (Korean)

- **What:** A new column series (B3) from the author of the two glossaries above. It covers thirteen game-feel parts, from damage number pop, count-up, easing, hitstop and screen shake to coyote time, each laid out as "when it feels flat → A/B demo → how to ask for it." The demos can be played in slow motion.
- **Where it helps:** When you need a sentence to hand an AI instead of "make the hits feel better." Every entry comes with a request that already has numbers in it, like "pause both for 0.06 seconds," plus the English term, so you can copy it as is.
- **License:** None stated. Linking is fine, but we don't republish the content.
- **Requirements:** A web browser.
- **Status:** Looked into (2026-11-06)
- **Verdict:** If game-feel talks tell you why, this tells you what to say. "Feedback tiers," saving the big effects so a big number feels like a big deal, fits a quiet game like ours especially well.

### Measuring the moment of a press (screen recording + response time)

- **What:** A check we built ourselves. Headless Chrome's screencast (CDP) hands us a timestamped frame every 1/60 s after a press, and the browser's Event Timing measures "press → next frame" in milliseconds. Throttling the CPU 4× stands in for a slow phone.
- **Where it helps:** Turning "something feels sluggish" into numbers, and catching beats that land out of order, where the result shows before its cause.
- **License:** Built-in Chrome and Playwright features.
- **Specs:** Any laptop.
- **Status:** Tested (2026-11-03)
- **Verdict:** This is how we caught our scene showing the result 1.1 s before the die stopped. We never noticed it by eye.

## Pixel art

### [Pixel Shading Glossary](https://tuiella.github.io/pixel-glossary/) (Korean)

- **What:** A Korean guide to pixel art terms for light, shadow, color, animation and production, explained with before-and-after pictures.
- **Where it could fit:** A checklist for reviewing pixel art that AI drew. One proper term works far better than "make the shadows look natural."
- **License:** None stated. Linking is fine, but I don't copy its contents here.
- **Hardware:** Any web browser.
- **Status:** In use (2026-10-28)
- **Verdict:** Worth keeping nearby for any game that uses pixel art.

### [Names of Pixel Problems](https://tuiella.github.io/b3/dot/) (Korean)

- **What:** Another B3 column by the same author. Fifteen pixel-art problems, the "it looks jittery" and "it's bubbling" kind, sorted into symptom → cause → fix: boiling, pivot jitter, alpha fringe, mixels, integer scaling, rotation artifacts, fixed palettes and more. Buttons like "show changed pixels" and "overlay grid" let you poke at each problem yourself.
- **Where it helps:** Reviewing AI-drawn pixel art or animation. Where the pixel shading glossary is about how to paint, this one is a checklist for what went wrong.
- **License:** None stated. Linking is fine, but we don't republish the content.
- **Requirements:** A web browser.
- **Status:** Looked into (2026-11-06)
- **Verdict:** If you generate frames one at a time with AI, start with the first entry, "boiling." Frames drawn separately change pixels that should stay still, and the result shimmers.

### Recovering the pixel grid ([unfake](https://pypi.org/project/unfake/), [proper-pixel-art](https://github.com/KennethJAllen/proper-pixel-art))

- **What:** Finds the original grid in an AI's "big picture that looks like pixel art" and reads one representative color per cell to get true 1× pixel art back. We used our own post-processing built in the same order.
- **Where it fits:** The last pass before AI pixel art goes into a game. Arbitrary downscaling mixes cells and smears the face; recovering the grid keeps even one-pixel eyes.
- **License:** Check each tool's repository before use (our version lives in the game repo).
- **Specs:** Plain Python, no GPU needed.
- **Status:** Tested (2026-10-20)
- **Verdict:** Always reduce colors after reading the cells. Flip the order and the eyes and pink cheeks vanish.

### [pixelfx](https://github.com/patch-gg/pixelfx)

- **What:** 244 pixel art effects drawn in code, no image files: fire, ice, lightning, holy, shadow, nature, status effects, pickups and more. Each effect carries a timing table for the body (wind-up → freeze on contact → recovery), and exports to a transparent PNG strip plus frame JSON.
- **Where it fits:** When every named skill needs its own shape. "Call the grasping hands" gets hands rising from the ground; "Call the roots" gets roots wrapping the ankles. Colors change through an option.
- **License:** MIT (commercial use and edits fine, keep the copyright notice). The bundled font is the one exception.
- **Specs:** Node 18+, no other packages.
- **Status:** In use (2026-11-03, 11 spell effects)
- **Verdict:** Built to glow on dark backgrounds, so on a bright notebook page the light simply disappears. Kept at native size (a 24×38-pixel dummy) with our colors swapped in, it fit well; scaled up, the pixels got too chunky. Turning the light off and redrawing its job as solid bands made it crisp on the bright page too.
