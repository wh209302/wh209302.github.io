---
layout: post
title: "\"고쳤습니다\" 대신 사진과 영상으로 받기"
date: 2026-10-27 12:50:00 +0900
category: ai-work
series: ai-tips
tags: [AI협업, 화면, 폰, Playwright]
image: /assets/img/posts/ai-screens/before-after.webp
summary: Claude가 화면을 고쳤다고 해서 열어 보면 폰에서 깨져 있는 일이 잦았습니다. 그 뒤로 AI가 직접 화면을 찍어 사진과 영상으로 보고하게 했고, 저는 그것만 보고 판단합니다.
---

Claude가 "화면을 고쳤습니다"라고 해서 폰으로 열어 보면 글자가 잘려 있거나 버튼이 겹쳐 있는 일이 종종 있었습니다. 코드를 고친 것과 화면이 제대로 보이는 것은 다른 문제였습니다. 그래서 화면 작업은 Claude가 직접 브라우저를 띄워 찍어 보고 사진과 함께 보고하게 했습니다.

<figure><img src="/assets/img/posts/ai-screens/talk.webp" alt="고쳤다는 말 대신 사진과 영상으로 받게 된 장면 네 가지를 제가 한 말, Claude의 답, 바뀐 것으로 정리한 표" loading="lazy"><figcaption>화면을 사진과 영상으로 주고받게 된 과정입니다.</figcaption></figure>

## 증거가 없으면 완료가 아닙니다

처음 정한 규칙은 하나였습니다. 화면을 고쳤으면 폰 크기와 PC 크기로 직접 찍어 보고 확인한 사진이 없으면 완료라고 하지 않는 것입니다. 한쪽에서 멀쩡한 화면이 다른 쪽에서 깨지는 일이 많아서 두 크기를 꼭 같이 찍게 했습니다.

이 규칙 하나로 제가 열어 보고 다시 요청하는 일이 크게 줄었습니다. Claude가 찍다가 스스로 문제를 찾아 고친 뒤에 보고하기 때문입니다.

<figure><img src="/assets/img/posts/ai-screens/pc.webp" alt="PC 크기로 찍은 게임 화면. 왼쪽 장면과 기록, 오른쪽 노선도와 할 일" loading="lazy"><figcaption>PC 크기로 찍은 게임 화면입니다. 같은 화면을 폰 크기로도 함께 찍습니다.</figcaption></figure>

## 고치기 전과 후를 나란히

화면 개편 결과를 보고 "구리다, 세련되게"라고 말한 적이 있습니다. 그 뒤로 Claude는 고친 결과만 보여 주지 않고 고치기 전과 나란히 붙여 보여 줍니다. 결과만 보면 뭐가 달라졌는지 헷갈리는데, 나란히 놓으면 판단이 몇 초면 끝납니다.

<figure><img src="/assets/img/posts/ai-screens/before-after.webp" alt="폰 화면 고치기 전과 후를 나란히 놓은 비교 사진" loading="lazy"><figcaption>폰 화면 고치기 전(왼쪽)과 후(오른쪽)입니다.</figcaption></figure>

## 움직임은 영상으로

공책을 펼치는 연출을 처음 봤을 때 표지와 종이가 따로 노는 느낌이었습니다. "따로 논다, 최대한 리얼하게"라고 했고 Claude는 폰 화면을 영상으로 찍어 보여 주며 다시 맞춰 갔습니다. 움직임은 사진 한 장으로는 판단할 수 없어서 영상이 꼭 필요했습니다.

<figure class="narrow"><video src="/assets/img/posts/ai-screens/book-open-phone.mp4" poster="/assets/img/posts/ai-screens/book-open-phone.jpg" controls muted playsinline preload="none"></video><figcaption>폰에서 공책을 펼치는 연출입니다.</figcaption></figure>

비와 눈 효과를 보고는 "눈 아프다"고 말했고 Claude가 양을 절반으로 줄였습니다. 이렇게 느낀 그대로 짧게 말해도 충분히 전달됩니다. 녹화 영상이 띄엄띄엄 끊기는 문제는 [한 장씩 찍어 영상을 만드는 글]({% post_url 2026-10-27-ai-clip %})에 따로 적었습니다.

## 세 줄 요약

1. 화면 작업은 AI가 폰과 PC 크기로 직접 찍어 보게 하고 사진이 없으면 완료로 보지 않습니다.
2. 바뀐 화면은 고치기 전과 나란히 붙여 받으면 몇 초 만에 판단할 수 있습니다.
3. 움직이는 연출은 영상으로 받아 보고 느낀 그대로 짧게 말하면 됩니다.
