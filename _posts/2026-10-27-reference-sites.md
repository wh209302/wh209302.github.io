---
layout: post
title: "AI 개발하며 모아 둔 참고 사이트"
date: 2026-10-27 15:45:00 +0900
category: dev-tips
tags: [참고자료, AI협업, 픽셀아트, 토큰, 글쓰기]
image: /assets/img/posts/reference-sites/refs.webp
summary: 게임을 만들며 Claude에게 참고하라고 건넨 사이트 가운데 실제로 도움이 된 것만 모았습니다. 무엇인지, 우리 작업에서 어떻게 썼는지를 짧게 적고 새로 찾으면 계속 더합니다.
---

게임을 만들면서 커뮤니티 글이나 도구를 찾으면 Claude에게 "이거 참고해 봐" 하고 건넵니다. 그때는 도움이 됐는데 나중에 다시 찾으려면 주소가 기억나지 않았습니다. 그래서 실제로 써 보고 도움이 된 것만 여기 모아 둡니다.

<figure><img src="/assets/img/posts/reference-sites/refs.webp" alt="참고 사이트 카드. 글쓰기, Claude 설정, 픽셀 아트, 아이디어로 분류" loading="lazy"><figcaption>분류별로 정리한 모습입니다.</figcaption></figure>

## 글쓰기

**[Humanize KR](https://github.com/epoko77-ai/im-not-ai)** · AI가 쓴 한국어 글에서 번역투와 기계적인 나열을 찾아 고쳐 주는 Claude 스킬입니다. 사실과 숫자는 건드리지 않고 문장만 다듬습니다. 저는 Claude에게 이 스킬을 가볍게 줄인 판을 만들게 해서 이 블로그 글을 올리기 전에 늘 돌립니다.

## Claude 설정과 토큰

**디시인사이드 [AI 개발 갤러리 글](https://gall.dcinside.com/mgallery/board/view/?id=aidevelop&no=4369)과 [AI 활용 갤러리 글](https://gall.dcinside.com/mgallery/board/view/?id=ai_utilize&no=137000)** · Claude Code를 오래 쓴 분들이 토큰을 아끼는 설정을 나눈 글입니다. 자동 압축을 일찍 하기, 에이전트를 함부로 띄우지 않기 같은 내용입니다. Claude에게 이 글을 읽히고 공식 문서와 맞춰 보게 한 뒤 맞는 것만 적용했습니다. 과정은 [토큰 아끼기 글]({% post_url 2026-10-27-ai-tokens %})에 있습니다.

## 픽셀 아트

**[Pixel Refiner](https://pixel-refiner.app/)** · AI가 그린 "픽셀풍" 그림을 진짜 픽셀 칸에 맞춰 주는 무료 웹 도구입니다. 그림을 끌어다 놓기만 하면 됩니다. 저희 작업대의 다듬기 기능과 나란히 비교해 봤는데 결과는 거의 같았습니다. 작업대 같은 도구가 없다면 가장 먼저 써 볼 만합니다.

<figure><img src="/assets/img/posts/reference-sites/refiner.webp" alt="AI가 그린 캐릭터 세 명을 원본, Pixel Refiner, 작업대 다듬기로 나란히 비교" loading="lazy"><figcaption>왼쪽부터 AI 원본, Pixel Refiner, 저희 작업대입니다.</figcaption></figure>

**[claude-pxl](https://github.com/augusto-scarvalho/claude-pxl)** · 짧은 코드로 픽셀 그림과 움직이는 그림을 만드는 도구이고 AI가 쓰기 좋게 만들어져 있습니다. Claude에게 마법 효과를 이걸로 그리게 했더니 흰 공책 바탕에 파스텔 색이 묻혀 잘 보이지 않았습니다. 진한 테두리를 두르는 기능을 더하자 또렷해졌습니다.

<figure><img src="/assets/img/posts/reference-sites/pxl-fire.webp" alt="불 마법 다섯 장면. 위는 기본 색, 아래는 공책 색과 테두리" loading="lazy"><figcaption>위는 기본값, 아래는 테두리를 넣은 불 마법입니다.</figcaption></figure>

**[픽셀 셰이딩 용어집](https://tuiella.github.io/pixel-glossary/)** · 빛, 그림자, 색 용어를 작은 그림의 전후 비교로 보여 주는 한국어 용어집입니다. "그림자를 자연스럽게"라고 하면 AI가 매번 다르게 그리는데, 용어 이름으로 말하면 결과가 안정됩니다. Claude에게 이 용어집을 읽혀 그림을 검사할 때 쓰는 점검표로 만들어 두었습니다.

## 아이디어

**[Opus 5.5 영상 모음](https://github.com/yihui-dev/awesome-opus5-5-videos)** · AI에게 코드로 만들게 한 영상 703개와 그 프롬프트를 모은 곳입니다. 원하는 연출을 말로 설명하기 어려울 때 비슷한 영상을 찾아 표현을 빌립니다. 여기서 연필 선이 살짝 떨리는 효과를 찾아 [영상 만드는 글]({% post_url 2026-10-27-ai-clip %})에 썼습니다.

## 세 줄 요약

1. 참고할 사이트는 Claude에게 건네 직접 읽히고 공식 문서와 맞춰 본 뒤 쓸 것만 적용합니다.
2. 픽셀 그림은 Pixel Refiner로 칸을 맞추고 효과는 claude-pxl로, 검사는 용어집 점검표로 합니다.
3. 새로 쓸 만한 곳을 찾으면 이 글에 계속 더합니다.
