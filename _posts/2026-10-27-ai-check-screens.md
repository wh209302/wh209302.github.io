---
layout: post
title: "AI가 고친 화면을 AI가 직접 찍어 확인하게 하는 법: Playwright 스크립트 그대로 공개"
date: 2026-10-27 12:50:00 +0900
category: ai-work
series: ai-tips
tags: [AI협업, 화면, 폰, Playwright]
image: /assets/img/posts/ai-screens/before-after.webp
summary: 고쳤다는 말 대신 폰·PC 크기 스크린샷과 전후 비교, 짧은 영상을 받는 방법입니다. 바로 돌려 볼 수 있는 Playwright 스크립트와 변환 명령, 겪은 함정을 함께 실었습니다.
---

Claude가 "화면을 고쳤습니다"라고 해서 열어 보면 폰에서 글자가 잘려 있거나 버튼이 겹쳐 있는 일이 종종 있었습니다. 코드를 고친 것과 화면이 제대로 보이는 것은 별개입니다. 그래서 화면 작업은 Claude가 직접 브라우저를 띄워 찍어 보고 사진과 함께 보고하게 했습니다. 이 글의 스크립트는 이 블로그를 대상으로 실제로 돌려 확인한 것입니다.

## 준비

Claude Code가 돌아가는 곳(내 컴퓨터든 클라우드든)에 Node.js가 있으면 됩니다. 프로젝트 폴더에서 한 번만 설치합니다.

```bash
npm i -D playwright
npx playwright install chromium
```

Claude Code 클라우드 환경에는 Chromium과 Playwright가 미리 깔려 있는 경우가 있으니, 먼저 `node -e "require('playwright')"`로 확인해 보고 없을 때만 설치합니다. 이미 깔린 것과 판이 다른 Playwright를 또 설치하면 브라우저를 못 찾는 일이 생깁니다.

## 1. 폰과 PC 두 크기로 찍는 스크립트

`shoot.mjs`로 저장합니다.

```js
// 사용법: node shoot.mjs http://localhost:5173 before   (고치기 전)
//        node shoot.mjs http://localhost:5173 after    (고친 뒤)
import { chromium } from 'playwright';

const [url, tag = 'now'] = process.argv.slice(2);
const sizes = [
  { name: 'phone', width: 390, height: 844, mobile: true },
  { name: 'pc', width: 1440, height: 900, mobile: false },
];

const browser = await chromium.launch();
for (const s of sizes) {
  const page = await browser.newPage({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: 2,
    isMobile: s.mobile,
    hasTouch: s.mobile,
    locale: 'ko-KR',           // 한국어 화면으로
    reducedMotion: 'reduce',   // 움직임을 줄인 상태로
  });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);   // 글꼴이 다 뜬 뒤에
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  await page.screenshot({ path: `${tag}-${s.name}.png`, fullPage: true });
  console.log(`${tag}-${s.name}.png`, overflow ? '가로 넘침 있음' : '가로 넘침 없음',
    errors.length ? `오류 ${errors.length}개` : '');
  await page.close();
}
await browser.close();
```

사진만 찍는 것이 아니라 두 가지를 같이 확인합니다.

- **가로 넘침**: 폰에서 화면이 옆으로 밀리는 문제는 사진만 봐서는 놓치기 쉽습니다. 문서 폭이 화면 폭보다 넓으면 바로 알려 줍니다.
- **페이지 오류**: 화면은 멀쩡해 보여도 뒤에서 오류가 나는 경우를 잡습니다.

폰 크기 390×844는 요즘 아이폰 기본 크기, PC 1440×900은 흔한 노트북 크기입니다. 한쪽에서는 멀쩡한데 다른 쪽에서 깨지는 일이 정말 많아서 두 크기를 꼭 같이 찍습니다.

<figure><img src="/assets/img/posts/ai-screens/pc.webp" alt="PC 크기로 찍은 게임 화면. 왼쪽 장면과 기록, 오른쪽 노선도와 할 일" loading="lazy"><figcaption>PC 크기로 찍은 게임 화면입니다. 같은 화면을 폰 크기로도 함께 찍습니다.</figcaption></figure>

## 2. 고치기 전과 후를 나란히 붙이기

고친 결과만 보면 무엇이 달라졌는지 판단하기 어렵습니다. 고치기 전에 `before`, 고친 뒤 `after`로 찍고 나란히 붙입니다. 파이썬과 Pillow(`pip install pillow`)가 있으면 됩니다.

```python
# 사용법: python3 side.py before-phone.png after-phone.png compare-phone.png
import sys
from PIL import Image, ImageDraw
a, b = (Image.open(p).convert('RGB') for p in sys.argv[1:3])
h = max(a.height, b.height); gap = 40; top = 60
out = Image.new('RGB', (a.width + b.width + gap, h + top), 'white')
out.paste(a, (0, top)); out.paste(b, (a.width + gap, top))
d = ImageDraw.Draw(out)
d.text((10, 15), 'BEFORE', fill='black'); d.text((a.width + gap + 10, 15), 'AFTER', fill='black')
out.save(sys.argv[3])
```

<figure><img src="/assets/img/posts/ai-screens/before-after.webp" alt="폰 화면 고치기 전과 후를 나란히 놓은 비교 사진" loading="lazy"><figcaption>폰 화면 고치기 전(왼쪽)과 후(오른쪽)입니다. 나란히 놓으면 판단이 몇 초면 끝납니다.</figcaption></figure>

## 3. 움직이는 부분은 영상으로

공책 표지가 넘어가는 연출처럼 움직임이 있는 부분은 사진으로 판단할 수 없습니다. Playwright는 페이지를 영상으로 녹화할 수 있습니다. `record.mjs`로 저장합니다.

```js
// 사용법: node record.mjs http://localhost:5173   → video/ 폴더에 .webm
import { chromium } from 'playwright';

const url = process.argv[2];
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  isMobile: true, hasTouch: true, locale: 'ko-KR',
  recordVideo: { dir: 'video', size: { width: 390, height: 844 } },
});
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
// 여기서 확인할 동작을 한다. 예: 첫 버튼 누르기
await page.locator('a, button').first().click().catch(() => {});
await page.waitForTimeout(2000);
await context.close();   // 닫아야 영상 파일이 저장된다
await browser.close();
```

녹화 파일은 `.webm`이라 어디서나 재생되도록 mp4로 바꿉니다. 소리를 빼고(`-an`), 웹에서 내려받는 즉시 재생되도록(`+faststart`) 합니다. 첫 장면은 미리보기 그림으로 따로 뽑습니다.

```bash
ffmpeg -i video/*.webm -c:v libx264 -pix_fmt yuv420p -an \
  -movflags +faststart -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" demo.mp4
ffmpeg -i demo.mp4 -frames:v 1 demo.jpg
```

`scale=trunc(...)` 부분은 가로세로를 짝수로 맞춥니다. H.264는 홀수 크기를 받지 않아서 이 줄이 없으면 가끔 변환이 실패합니다.

<figure class="narrow"><video src="/assets/img/posts/ai-screens/book-open-phone.mp4" poster="/assets/img/posts/ai-screens/book-open-phone.jpg" controls muted playsinline preload="none"></video><figcaption>폰에서 공책을 펼치는 연출을 이렇게 찍었습니다.</figcaption></figure>

## 겪은 함정

- **영어 화면이 찍힙니다.** 화면 없는 브라우저는 기본 언어가 영어일 때가 있습니다. 언어에 따라 글이 바뀌는 사이트라면 `locale: 'ko-KR'`을 꼭 넣습니다.
- **반쯤 사라진 화면이 찍힙니다.** 애니메이션 도중에 찍으면 그렇습니다. 사진은 `reducedMotion: 'reduce'`로 찍고 사이트 CSS도 `@media (prefers-reduced-motion: reduce)`에서 움직임을 끄게 해 두면 결과가 안정됩니다. 움직임 자체를 볼 때만 영상으로 찍습니다.
- **글꼴이 바뀌기 전에 찍힙니다.** 웹 글꼴이 늦게 뜨면 기본 글꼴로 찍힙니다. `document.fonts.ready`를 기다립니다.
- **폰에서 버튼이 눌린 채로 남습니다.** 폰에는 마우스를 올리는 동작이 없는데 터치하면 `:hover` 효과가 켜진 채로 남습니다. 마우스가 있는 기기에서만 효과를 주도록 감쌉니다.

```css
@media (hover: hover) and (pointer: fine) {
  .button:hover { background: var(--accent-soft); }
}
```

## Claude에게 주는 지시문

저장소의 CLAUDE.md나 작업 요청에 붙여 넣습니다.

```text
화면을 고치면 고치기 전과 후를 폰(390×844)과 PC(1440×900) 두 크기로 직접 띄워 찍어라.
한국어(ko-KR), 움직임 줄임, 글꼴 로드 완료 상태로 찍고
가로 넘침과 페이지 오류가 있는지 같이 알려라.
전후 사진은 나란히 붙여 보여 주고, 움직임이 있는 부분은 mp4 영상으로 찍어라.
사진을 보기 전에는 "고쳤다"고 보고하지 마라.
```

마지막 줄이 가장 효과가 컸습니다. 확인한 증거가 없으면 완료로 보고하지 않게 하니, 제가 열어 보고 다시 요청하는 일이 크게 줄었습니다.

참고: [Playwright 스크린샷](https://playwright.dev/docs/screenshots), [영상 녹화](https://playwright.dev/docs/videos), [브라우저 환경 옵션](https://playwright.dev/docs/emulation).
