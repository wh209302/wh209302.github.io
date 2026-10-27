---
layout: post
title: "AI가 만든 화면은 AI가 직접 찍어 보게 해요"
date: 2026-10-27 12:50:00 +0900
category: ai-work
series: ai-tips
tags: [AI협업, 화면, 폰, 확인]
image: /assets/img/posts/ai-screens/before-after.webp
summary: 코드만 고치고 "다 됐어요" 하는 말은 안 믿기로 했어요. 폰이랑 PC 크기로 직접 띄워서 찍고 고치기 전후를 나란히 보여 주게 하는 방법이에요.
---

AI가 "화면 고쳤어요" 해서 열어 보면 폰에서 글자가 잘려 있거나 버튼이 겹쳐 있을 때가 종종 있었어요. 코드를 고친 것과 화면이 제대로 보이는 건 다른 얘기더라고요. 그래서 화면 작업은 AI가 직접 띄워서 찍어 보고 사진이랑 같이 알려 주게 했어요.

## 폰이랑 PC, 두 크기로 찍기

AI는 화면 없는 브라우저로 게임을 띄워서 사진을 찍을 수 있어요. 이 게임은 폰(가로 390)과 PC(가로 1440) 두 크기로 꼭 찍게 해요. 한쪽에선 멀쩡한데 다른 쪽에서 깨지는 일이 정말 많았거든요.

<figure><img src="/assets/img/posts/ai-screens/pc.webp" alt="PC 크기로 찍은 게임 화면. 왼쪽 장면과 기록, 오른쪽 노선도와 할 일" loading="lazy"><figcaption>PC 크기로 찍은 화면이에요. 같은 화면을 폰 크기로도 같이 찍어요.</figcaption></figure>

## 고치기 전과 후를 나란히

고친 결과만 보면 뭐가 달라졌는지 잘 모르겠더라고요. 고치기 전 사진이랑 나란히 붙여 달라고 하니까 한눈에 판단이 됐어요.

<figure><img src="/assets/img/posts/ai-screens/before-after.webp" alt="폰 화면 고치기 전과 후를 나란히 놓은 비교 사진" loading="lazy"><figcaption>폰 화면 고치기 전(왼쪽)과 후(오른쪽)예요.</figcaption></figure>

## 움직이는 건 영상으로

공책 표지가 넘어가는 연출처럼 움직임이 있는 부분은 사진으로는 알 수가 없어요. 이런 건 짧은 영상으로 찍어 달라고 해요.

<figure class="narrow"><video src="/assets/img/posts/ai-screens/book-open-phone.mp4" poster="/assets/img/posts/ai-screens/book-open-phone.jpg" controls muted playsinline preload="none"></video><figcaption>폰에서 공책을 펼치는 연출을 찍은 영상이에요.</figcaption></figure>

## 하다 보니 알게 된 함정

- 화면 없는 브라우저는 영어로 뜰 때가 있어요. 한국어 화면을 보려면 언어를 지정해서 열게 해야 해요.
- 애니메이션 도중에 찍으면 반쯤 사라진 화면이 찍혀요. 움직임을 멈추고 찍게 하세요.
- 폰에는 마우스를 올리는 동작이 없어요. 그래서 마우스를 올리면 색이 바뀌는 효과가 폰에선 눌린 채로 남는 문제가 있었어요.

## 이렇게 해 보세요

```text
화면을 고치면 폰(390×844)과 PC(1440×900) 크기로 직접 띄워서 찍어 보고,
고치기 전 사진이랑 나란히 붙여서 보여 줘.
움직임이 있는 부분은 짧은 영상으로 찍어 줘.
```
