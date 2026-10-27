---
layout: post
title: "AI 작업 여러 개를 한 저장소에서 동시에 돌릴 때: 충돌 줄이기와 CI 시간 아끼기"
date: 2026-10-27 12:20:00 +0900
category: dev-tips
series: ai-tips
tags: [AI협업, git, 자동화, 비용]
image: /assets/img/posts/ai-parallel/shared-cells.webp
summary: AI 작업 여러 개가 같은 저장소에 동시에 올리면서 생긴 충돌과 GitHub Actions 무료 시간 소진을 어떻게 풀었는지, 그대로 가져다 쓸 수 있는 .gitattributes·합치기 도구·워크플로 설정과 함께 정리했습니다.
---

이 게임은 Claude 작업 여러 개를 동시에 돌려서 만듭니다. 한쪽은 전투를 다듬고 다른 쪽은 직업 사건을 쓰고 또 다른 쪽은 영어 번역을 합니다. 모두 브랜치 없이 main에 바로 올립니다. 속도는 빨라졌지만 두 가지 문제가 생겼습니다. 같은 파일에서 계속 부딪히는 것, 그리고 자동 검사 시간이 이틀 만에 바닥난 것입니다. 둘 다 사람이 손으로 풀지 않도록 바꾼 방법을 정리합니다.

## 문제 1. 서로 다른 일을 하는데 같은 곳에서 부딪힙니다

10월 22일 git 기록을 살펴보니, 콘텐츠를 고친 커밋끼리는 **매번** 같은 자리에서 충돌이 났습니다. 하는 일은 달라도 누가 무엇을 고치든 함께 바뀌는 칸이 있었기 때문입니다.

<figure><img src="/assets/img/posts/ai-parallel/shared-cells.webp" alt="작업 세 개가 공용 칸에서 부딪히는 그림과 올리기 명령으로 자동으로 맞추는 다섯 단계" loading="lazy"><figcaption>부딪히는 곳은 늘 모두가 함께 고치는 공용 칸이었습니다.</figcaption></figure>

| 부딪히던 곳 | 이유 |
|---|---|
| 콘텐츠 묶음의 버전 번호 | 두 작업이 같은 다음 번호로 올림 |
| 예시 파일 12개의 해시 | 콘텐츠가 바뀌면 해시도 바뀜 |
| 규칙 JSON 파일의 끝 | 둘 다 맨 끝에 새 키를 붙임 |
| 번역표(영어) | 위와 같고, 순번 키가 밀림 |
| 문서 끝, 목록 파일 끝 | 둘 다 같은 자리에 줄을 덧붙임 |

먼저 여러분의 저장소에서도 이런 칸이 있는지 찾아보는 것이 시작입니다. Claude에게 이렇게 물으면 됩니다.

```text
최근 2주 git 기록에서 서로 다른 작업이 같은 파일을 고쳐 충돌한 곳을 찾아
파일별로 몇 번, 왜 부딪혔는지 표로 정리해 줘.
```

## 해결 1. 번호는 작업 중에 정하지 않습니다

버전 번호 충돌은 "작업 중에는 번호를 쓰지 않는다"로 풀었습니다. 문서나 커밋 메시지에는 `core@next`라고만 적고 실제 번호는 **올리는 순간** 정합니다. 올리는 명령이 main의 최신 번호를 보고 다음 번호를 계산한 뒤, 이번 작업이 더한 줄에서만 `core@next`를 그 번호로 바꿉니다. 해시처럼 계산으로 나오는 값도 마찬가지로 아무 쪽이나 골라 두고 올릴 때 다시 계산합니다.

이 원칙은 다른 프로젝트에도 그대로 씁니다. **계산으로 다시 만들 수 있는 값은 충돌을 풀지 말고 다시 만든다.**

## 해결 2. 덧붙이기 충돌은 git이 알아서 합치게 합니다

둘 다 파일 끝에 줄을 덧붙인 충돌은 사실 고민할 것이 없습니다. 둘 다 살리면 됩니다. git은 파일 종류별로 합치는 방식을 정할 수 있고 이를 `.gitattributes`에 적습니다.

가장 간단한 방법은 git에 내장된 `union`입니다. 충돌이 나면 양쪽 줄을 모두 남깁니다.

```gitattributes
# 줄 순서가 중요하지 않은 목록 파일
CHANGELOG.md merge=union
docs/ideas.md merge=union
```

다만 `union`은 원래 줄을 서로 다르게 고친 경우에도 둘 다 남겨 버립니다. 그래서 이 게임에서는 직접 만든 합치기 도구를 씁니다. "둘 다 새 줄만 덧붙인 충돌"만 이어 붙이고 원래 줄을 고친 충돌은 그대로 남겨 사람이 보게 합니다. JSON은 키와 ID 단위로 합칩니다.

```gitattributes
*.json merge=fwg-json
package-lock.json merge=text
*.md  merge=fwg-text
*.ts  merge=fwg-text
```

`.gitattributes`에 이름만 적으면 아무 일도 일어나지 않습니다. 그 이름이 어떤 프로그램인지 각 컴퓨터의 git 설정에 등록해야 합니다.

```bash
git config merge.fwg-json.name "JSON 키·ID 단위 합치기"
git config merge.fwg-json.driver \
  'node "$(git rev-parse --show-toplevel)/tools/git/merge-driver.mjs" json %O %A %B %L %P'
```

`%O`는 공통 조상, `%A`는 우리 쪽, `%B`는 들어오는 쪽 파일입니다. 합치기 도구는 결과를 `%A` 파일에 쓰고 깨끗이 합쳤으면 0, 충돌이 남았으면 1로 끝나면 됩니다. 이 등록은 `npm install`이 자동으로 하도록 `package.json`의 `prepare`에 걸어 두었습니다. 등록되지 않은 컴퓨터에서는 git이 보통 방식으로 합치므로 해가 없습니다.

JSON 합치기 도구의 규칙은 이렇게 정했습니다. 이 규칙을 Claude에게 주면 비슷한 도구를 만들어 줍니다.

- 객체는 서로 다른 키를 둘 다 살린다.
- `id`가 있는 목록은 `id`로 짝지어 항목 안까지 합친다.
- `id`가 없는 목록에 둘 다 같은 자리에 더했으면 우리 쪽 다음에 들어오는 쪽을 붙인다.
- 같은 값을 서로 다르게 고친 것은 충돌로 남긴다.
- 무엇을 자동으로 합쳤는지 로그 파일에 남긴다.

## 해결 3. 올리기를 명령 하나로 묶습니다

위 단계를 사람이나 AI가 매번 기억하기는 어렵습니다. 그래서 `git push` 대신 `npm run ship` 하나로 묶었습니다. 순서는 다음과 같습니다.

1. `git fetch` 뒤 최신 main 위로 rebase (이때 합치기 도구가 먼저 충돌을 풉니다)
2. 버전 번호를 정하고 해시를 다시 계산
3. 번역표 자리 맞추기
4. `core@next`를 정한 번호로 바꾸기
5. 검사 (같은 내용으로 이미 통과했으면 건너뜀)
6. `git push origin HEAD:main`. 그사이 누가 먼저 올렸으면 1번부터 다시, 최대 5번

그리고 저장소의 CLAUDE.md 첫 줄에 이렇게 적었습니다. 모든 작업이 이 규칙을 읽고 시작합니다.

```markdown
- 여러 작업이 동시에 main에 바로 커밋·푸시합니다. 푸시는 `git push` 대신 **`npm run ship`**으로 합니다.
- 버전 번호는 손으로 올리지 않습니다. 문서·커밋 메시지에는 `core@next`라고 씁니다.
- ship이 같은 줄 충돌로 멈추면 그 파일만 골라 고치고 `git add` 뒤 `npm run ship`을 다시 부릅니다.
```

이제 사람이 직접 고르는 것은 **같은 줄을 서로 다르게 고친 경우**뿐입니다.

## 문제 2. 무료 검사 시간이 이틀 만에 끝났습니다

어느 날 새벽에 "결제 실패" 알림이 왔습니다. 코드가 망가진 줄 알았는데 원인은 GitHub Actions 시간이었습니다. 비공개 저장소는 GitHub Free 기준 **한 달 2,000분**이 무료이고 결제 수단이 없으면 다 쓴 뒤 검사가 아예 시작되지 않습니다([GitHub 문서](https://docs.github.com/en/billing/concepts/product-billing/github-actions)). 공개 저장소의 기본 러너는 무료입니다.

<figure><img src="/assets/img/posts/ai-parallel/ci-minutes.webp" alt="올리기 1번 곱하기 Node 2가지 버전 곱하기 25분은 50분, 올리기 40번이면 한 달 치가 끝난다는 계산" loading="lazy"><figcaption>푸시마다 25분짜리 검사를 두 벌씩 돌리면 40번 만에 한 달 치가 끝납니다.</figcaption></figure>

AI 작업 여러 개가 하루 수십 번 푸시하면서 푸시마다 25분 검사를 Node 두 판으로 돌렸으니 이틀이면 끝나는 계산이었습니다. 자동 검사를 켜기 전에 이 곱셈을 먼저 했어야 했습니다.

## 해결 4. 검사는 하루 한 번, 푸시 전 검사는 각자

워크플로를 이렇게 바꿨습니다. 실제로 쓰는 파일에서 이 글과 관계없는 설정은 정리했습니다.

{% raw %}
```yaml
name: check
on:
  schedule:
    - cron: '30 18 * * *'   # 매일 한국 시각 새벽 3시 30분 (UTC 18:30)
  workflow_dispatch:        # 필요하면 손으로 실행
  pull_request:

concurrency:                # 같은 브랜치에서 새 검사가 오면 이전 것은 취소
  group: check-${{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    runs-on: ubuntu-latest  # 리눅스가 가장 쌉니다
    timeout-minutes: 45     # 멈춘 시험이 기본 360분을 다 태우지 않게
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22.18.0'   # 두 판 대신 최소 지원 판 하나만
          cache: npm
      - run: npm ci
      - run: npm run check
```
{% endraw %}

바뀐 점은 네 가지입니다.

- **푸시마다 돌리지 않습니다.** 하루 한 번과 손으로 누를 때만 돌립니다.
- **Node 판을 하나로 줄였습니다.** 최신 판은 각자 컴퓨터에서 이미 돕니다.
- **`timeout-minutes`를 걸었습니다.** 기본값 360분은 멈춘 시험 하나가 하루치를 태울 수 있는 값입니다.
- **`concurrency`로 겹친 실행을 취소합니다.**

대신 각 작업이 올리기 전에 자기 환경에서 `npm run check`를 돌립니다. 이 검사를 통과한 내용은 기록해 두어 올릴 때 같은 검사를 되풀이하지 않습니다. 이 기록 방법은 [토큰 아끼기 글]({% post_url 2026-10-27-ai-tokens %})에 코드와 함께 적었습니다.

## 적용 순서

1. 최근 충돌 기록을 표로 뽑아 늘 부딪히는 칸을 찾습니다.
2. 계산으로 나오는 값(버전, 해시, 목록 번호)은 작업 중에 정하지 않고 올릴 때 다시 만듭니다.
3. 덧붙이기만 하는 파일은 `.gitattributes`에 `merge=union`부터 걸어 봅니다. 부족하면 합치기 도구를 만듭니다.
4. 이 모든 것을 올리기 명령 하나로 묶고 CLAUDE.md 첫 줄에 "푸시는 이 명령으로"라고 적습니다.
5. CI를 켜기 전에 "푸시 횟수 × 검사 판 수 × 검사 시간"을 계산해 한 달 무료 시간과 비교합니다.

참고: [git 문서의 gitattributes 합치기 설정](https://git-scm.com/docs/gitattributes#_defining_a_custom_merge_driver), [GitHub Actions 요금](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [워크플로 concurrency](https://docs.github.com/en/actions/using-jobs/using-concurrency).
