---
layout: post
title: "AI에게 로그인 기능을 맡길 때 비밀 키 다루는 법: 실수 두 번에서 배운 절차"
date: 2026-10-27 12:40:00 +0900
category: dev-tips
series: ai-tips
tags: [보안, 비밀키, 로그인, Cloudflare]
image: /assets/img/posts/ai-secrets/where-keys-go.webp
summary: 카카오·구글 로그인 키를 채팅에 붙여 넣고 다시 받은 키를 엉뚱한 설정 칸에 넣었던 경험을 바탕으로 키를 넣는 위치, 유출됐을 때 바꾸는 순서, 값을 드러내지 않고 점검하는 코드를 정리했습니다.
---

게임에 카카오·구글 로그인을 붙여 플레이 기록을 서버에 보관하게 했습니다. 코드는 Claude가 모두 짰지만 비밀 키만큼은 제가 직접 다뤄야 했고 여기서 두 번 실수했습니다. 같은 실수를 피할 수 있도록 실제로 쓰는 절차를 정리합니다. 서버는 Cloudflare Workers 기준이지만 원칙은 다른 서비스에도 같습니다.

<figure><img src="/assets/img/posts/ai-secrets/where-keys-go.webp" alt="비밀 키를 넣으면 안 되는 곳 둘(채팅창, 빌드 설정 변수 칸)과 넣어야 하는 곳 하나(서버 실행 설정의 비밀값 칸)" loading="lazy"><figcaption>키를 넣는 곳 정리입니다. 실제 설정 화면에는 키가 보여서 그림으로 대신했습니다.</figcaption></figure>

## 실수 1. 키를 채팅창에 붙여 넣었습니다

카카오와 구글에서 받은 키 다섯 개를 그대로 Claude 채팅창에 붙여 넣었습니다. 대신 넣어 달라는 뜻이었지만 채팅은 기록에 남는 곳입니다. 다른 사람이 볼 수 있는 곳에 한 번이라도 나온 키는 이미 새어 나갔다고 보고 바꿔야 합니다. 결국 키를 전부 새로 받았습니다.

그 뒤로는 원칙을 하나 정했습니다. **AI에게는 키의 값이 아니라 키를 넣을 자리만 묻습니다.**

```text
카카오·구글 로그인에 필요한 비밀값의 이름 목록과,
각각을 어느 서비스의 어느 화면 어느 칸에 넣어야 하는지만 알려 줘.
값은 내가 직접 넣을 거라 채팅에 붙이지 않을게.
```

## 실수 2. 비슷하게 생긴 다른 칸에 넣었습니다

새 키를 넣었는데도 로그인 버튼이 나오지 않았습니다. Cloudflare 설정 화면에는 "Variables and secrets"라는 칸이 두 군데 있었습니다.

| 칸 | 위치 | 쓰이는 때 |
|---|---|---|
| 빌드 변수 | Settings → Build 안의 Variables and secrets | 사이트를 **만드는 동안**만 |
| 실행 변수 | Settings → Variables and Secrets | 서버가 **돌아가는 동안** |

저는 앞의 빌드 칸에 넣었고 실행 중인 서버는 값을 보지 못했습니다. 로그인 키처럼 서버가 요청을 처리할 때 읽는 값은 뒤의 실행 칸에 넣어야 합니다. [Cloudflare 문서](https://developers.cloudflare.com/workers/configuration/secrets/)의 순서대로 하면 됩니다.

1. Workers & Pages → Overview에서 해당 Worker를 고릅니다.
2. Settings → **Variables and Secrets** → Add를 누릅니다.
3. 종류를 **Secret**으로 고르고 이름과 값을 넣은 뒤 **Deploy**를 누릅니다.

명령줄을 쓴다면 아래 한 줄이 같은 일을 합니다. 값은 명령에 쓰지 않고 물어볼 때 입력하므로 셸 기록에도 남지 않습니다.

```bash
npx wrangler secret put KAKAO_CLIENT_SECRET
```

`wrangler.toml`의 `[vars]`에는 비밀값을 넣지 않습니다. 그 파일은 저장소에 올라가기 때문입니다.

## 내 컴퓨터에서 시험할 때

로컬 개발용 값은 설정 파일과 같은 폴더의 `.dev.vars`에 둡니다.

```bash
# .dev.vars  (절대 커밋하지 않음)
KAKAO_CLIENT_ID="..."
KAKAO_CLIENT_SECRET="..."
AUTH_SECRET="..."
```

그리고 `.gitignore`에 반드시 넣습니다.

```gitignore
.dev.vars*
.env*
```

Claude가 새 프로젝트를 만들 때 이 두 줄이 빠지는 일이 있으니, 첫 커밋 전에 `git status`에 `.dev.vars`가 보이지 않는지 확인합니다.

## 값은 숨기고 빠진 이름만 알려 주는 점검 코드

두 번째 실수를 금방 찾은 것은 Claude가 만든 작은 점검 기능 덕분이었습니다. 서버가 로그인 상태를 알려 줄 때 **빠진 설정의 이름만** 함께 돌려줍니다. 값은 절대 내보내지 않습니다.

```ts
// 빠진 설정 이름만 돌려준다. 값은 절대 내보내지 않는다.
const REQUIRED = [
  'AUTH_SECRET',
  'KAKAO_CLIENT_ID', 'KAKAO_CLIENT_SECRET',
  'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
] as const;

function missingSettings(env: Record<string, unknown>): { missing?: string[] } {
  const names = REQUIRED.filter((k) => !env[k]);
  return names.length ? { missing: names } : {};
}
```

응답에 `"missing": ["KAKAO_CLIENT_SECRET"]`가 보이면 그 칸이 비어 있는 것이고 아무것도 없으면 다 들어간 것입니다. 실행 칸이 아닌 빌드 칸에 넣었을 때도 이름이 그대로 보여서 원인을 바로 찾았습니다. Claude에게는 이렇게 부탁하면 됩니다.

```text
서버에 필요한 비밀 설정이 빠졌는지 확인할 수 있게,
빠진 설정의 이름만 응답에 넣어 줘. 값이나 값의 일부는 절대 내보내지 마.
```

## 키가 새어 나갔을 때 바꾸는 순서

순서가 중요합니다. 옛 키를 먼저 지우면 바꾸는 동안 로그인이 끊깁니다.

**구글**([공식 안내](https://support.google.com/cloud/answer/6158849)): Google Auth Platform의 Clients 화면에서 해당 OAuth 클라이언트를 엽니다.

1. 오른쪽의 **Add Secret**으로 새 비밀값을 만듭니다. 새 값은 **만들 때 한 번만** 전체가 보이므로 그때 바로 서버 실행 칸에 넣습니다.
2. 서버가 새 값으로 로그인되는지 확인합니다.
3. 옛 비밀값을 **Disable**합니다.
4. 문제가 없으면 옛 비밀값을 삭제합니다. 삭제는 되돌릴 수 없습니다.

**카카오**([보안 가이드](https://developers.kakao.com/docs/latest/ko/getting-started/security-guideline)): 카카오디벨로퍼스 앱의 소유자 계정으로 키를 **추가 발급해 교체한 뒤 기존 키를 삭제**하도록 안내합니다. 마찬가지로 삭제한 키는 복구할 수 없습니다. 메뉴 위치는 개편이 잦아 이 글에서는 적지 않았습니다. 앱 설정의 앱 키·보안 항목에서 찾으면 됩니다.

**서버 자체의 비밀값**(세션 서명 키 등): 이 값을 바꾸면 이미 로그인한 사람의 세션이 모두 풀리거나, 이 값으로 만든 고유번호가 달라질 수 있습니다. 저는 아직 가입자가 없을 때 바꿔서 문제가 없었습니다. 운영 중이라면 바꾸기 전에 그 값이 어디에 쓰이는지 Claude에게 먼저 확인시키십시오.

## 정리: 체크리스트

- 비밀 키·토큰·비밀번호는 채팅에 붙이지 않는다. 붙였다면 바로 새로 발급한다.
- AI에게는 이름과 넣을 위치만 묻는다.
- 서버가 실행 중에 읽는 값은 실행 변수(Secret) 칸에 넣는다. 빌드 칸이 아니다.
- 로컬 값은 `.dev.vars`에, `.gitignore`에 `.dev.vars*`와 `.env*`를 넣는다.
- 빠진 설정의 이름만 알려 주는 점검 응답을 만들어 둔다.
- 바꿀 때는 새 키 추가 → 적용 확인 → 옛 키 끄기 → 삭제 순서로 한다.
