---
layout: post
title: "아이폰 테더링 제한을 살펴보며 정리한 iSH SOCKS5와 단축어 설정"
date: 2026-10-27 14:40:00 +0900
category: dev-tips
tags: [자동화, 보안, 아이폰, iSH, 프록시]
image: /assets/img/posts/iphone-ish-socks5/connection.webp
summary: 아이폰의 iSH 터미널로 SOCKS5 프록시 서버를 띄우고 Windows v2rayN에 연결하는 전 과정을 정리했습니다. 매번 명령어를 치지 않도록 백그라운드 유지와 자동 실행까지 한 번에 세팅하는 실전 가이드입니다.
---

아이폰 알뜰폰 요금제의 테더링 제한을 이리저리 알아보다가, 아이폰용 터미널 앱인 **a-Shell**과 **iSH**에서 직접 SOCKS5 프록시 서버를 띄우는 방법까지 파고들게 됐습니다. 기왕 만드는 김에 매번 귀찮게 명령어를 치지 않고 어디까지 자동화할 수 있는지도 끝까지 실험해 봤습니다.

인터넷에 돌아다니는 단편적인 명령어들을 그냥 따라 치다 보면 정작 중요한 실행 파일이 빠져 있거나 보안 인증이 뚫려 있어 헤매기 십상입니다. 그래서 이 글에서는 **① 서버 세팅 → ② PC 연결 → ③ 백그라운드 유지 및 자동화** 순서로 빠짐없이 따라 할 수 있게 정리했습니다.

배경 설명은 건너뛰고 아이폰에 당장 설치부터 하고 싶으신 분은 바로 **[1. iSH에 Python과 작업 폴더 준비](#ish-install)**로 내려가시면 됩니다. 코드 블록 아래의 **‘코드 복사’** 버튼을 누르면 파일 생성 명령어까지 한 번에 복사되도록 만들어 두었습니다.

<script src="/assets/js/iphone-ish-code-copy.js" defer></script>
<style>
.ish-copybar { display: flex; justify-content: flex-end; margin-top: 1rem; }
.ish-copybtn { min-height: 44px; padding: .5rem .9rem; border: 1px solid var(--line); border-radius: .4rem; color: var(--ink); background: var(--paper-2); font: inherit; font-size: .875rem; cursor: pointer; }
.ish-copybtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
</style>

## 시작하기 전에: 프록시 연결과 테더링 데이터 차감은 별개입니다

알뜰폰 요금제에서 흔히 말하는 '데이터 무제한'과 '테더링(핫스팟) 기본 제공량'은 통신사와 요금제 약관마다 기준이 제각각입니다. ([Apple 공식 안내](https://support.apple.com/ko-kr/111785)에서도 핫스팟 지원 여부는 통신사 정책을 따르도록 되어 있죠.)

SOCKS5 프록시를 쓰면 PC가 보내는 인터넷 요청을 아이폰 안에서 돌고 있는 앱이 대신 받아 전달해 주는 구조가 됩니다. 하지만 이렇게 우회로를 뚫었다고 해서 통신사가 이를 100% 폰 자체 데이터 사용량으로 쳐 준다는 보장은 없습니다. 따라서 **'프록시가 정상적으로 연결되는지'**와 **'실제로 내 요금제에서 테더링 한도가 차감되지 않는지'**는 연결 후에 소량의 데이터로 직접 확인해 보시는 것이 안전합니다.

또한 당연히 PC와 아이폰이 서로 통신할 수 있는 기본 길(핫스팟 연결 등)은 먼저 뚫려 있어야 합니다. 핫스팟 자체가 아예 막혀 있거나 PC에서 아이폰 포트로 접근이 안 된다면 프록시 설정만으로는 해결되지 않으니, 본인의 요금제 조건부터 가볍게 체크해 보세요.

<figure><img src="/assets/img/posts/iphone-ish-socks5/connection.webp" alt="PC 앱에서 v2rayN의 로컬 포트, 아이폰 SOCKS5 서버, 인터넷으로 이어지는 연결 순서와 별도로 확인할 iOS 유지 및 통신사 데이터 차감 조건" loading="lazy"><figcaption>전체 연결 흐름도입니다. 프록시로 길을 내는 것과, iOS 백그라운드 유지 및 통신사 데이터 차감 여부는 각각 따로 챙겨야 합니다.</figcaption></figure>

## 왜 a-Shell 대신 iSH로 정착했을까?

처음엔 Python이 기본 내장된 iOS 터미널 앱인 **a-Shell**로 먼저 시도해 봤습니다. [공식 문서](https://github.com/holzschu/a-shell#shortcuts)를 보면 iOS 단축어와 연동하기가 꽤 편하게 되어 있거든요.

당시에는 흔히 알려진 꼼수대로 '무음 오디오 파일 무한 재생 + `socks5.py` 실행 + 단축어 무한 반복' 조합을 짜 봤습니다. 아래가 그때 만들었던 단축어 화면인데, 결론부터 말하면 **이 방식은 추천하지 않습니다.**

<figure class="narrow"><img src="/assets/img/posts/iphone-ish-socks5/ashell-shortcut.webp" alt="기존 a-Shell 단축어에 개인용 핫스팟 전환, 작업 폴더 이동과 무음 파일·socks5.py 실행, 반복 동작이 들어 있는 화면" loading="lazy"><figcaption>초기에 실험했던 a-Shell 단축어입니다. 무음 파일 재생과 반복문을 넣어도 iOS가 가차 없이 백그라운드 서버를 재워 버리더군요.</figcaption></figure>

단축어에 대기나 반복 동작을 걸어 둔다고 해서 iOS가 터미널 앱에 무한정 실행 시간을 주지 않습니다. 무음 오디오 재생 꼼수 역시 요즘 iOS에서는 금방 들통나서 서버가 픽 죽어 버리기 일쑤입니다. 실제로 [a-Shell 깃허브 이슈](https://github.com/holzschu/a-shell/issues/721)를 봐도 똑같이 SOCKS 프록시와 무음 재생을 돌리다 강제 종료된 사례가 여럿 올라와 있습니다.

그래서 방향을 틀어 위치 서비스(`/dev/location`)를 통해 백그라운드 유지를 좀 더 안정적으로 할 수 있는 **iSH** 기반으로 전체 구성을 새로 짰습니다. (참고로 iSH용 명령어인 `/root` 경로나 `apk` 패키지 설치 명령은 a-Shell에서는 먹히지 않으니 iSH 앱에서 진행해 주세요.)

## 인터넷에서 흔히 보는 'iSH 두 줄 명령어'의 원리

관련 팁을 찾다 보면 보통 아래 두 줄짜리 명령어를 많이 보셨을 겁니다.

```sh
cat /dev/location > /dev/null &
cd /root/socks && python3 socks5.py
```

- **첫 번째 줄 (`cat /dev/location ...`)**: 아이폰의 GPS 위치 장치를 계속 읽어들여서 iOS가 "아, 이 앱이 지금 길 찾기 중이구나!" 하고 백그라운드에서 죽이지 못하게 붙잡아 두는 꼼수입니다. ([iSH 공식 위키](https://github.com/ish-app/ish/wiki/Running-in-background)에서도 안내하는 정석 팁입니다.) 쏟아지는 위치 좌표 글자들은 쓰레기통(`/dev/null`)으로 버리고, 끝에 `&`를 붙여 뒷방(백그라운드)에서 조용히 돌게 만듭니다.
- **두 번째 줄 (`cd /root/socks ...`)**: 작업 폴더로 들어가서 본격적으로 프록시 서버를 켜는 명령입니다. 서버가 켜지면 터미널 창이 서버 상태 표시창으로 바뀌면서 프롬프트가 멈추는데, 고장 난 게 아니라 정상 작동 중인 것입니다. 끌 때는 `Ctrl+C`를 누르면 됩니다.

다만 인터넷 팁들에는 정작 가장 중요한 **`socks5.py` 파일 안에 무슨 코드가 들어있는지**, 그리고 **뒷방에 켜 둔 위치 읽기 프로세스를 나중에 어떻게 깔끔하게 끄는지**가 빠져 있는 경우가 많습니다. 그래서 아래부터는 보안 인증이 적용된 깔끔한 서버 코드부터 자동 정리 스크립트까지 풀세트로 만들어 보겠습니다.

<h2 id="ish-install">1. iSH에 Python과 작업 폴더 준비하기</h2>

아이폰에서 이 페이지를 여셨다면 각 코드 블록의 **코드 복사** 버튼을 눌러 iSH 터미널에 그대로 붙여넣고 엔터를 치시면 됩니다. 처음 세팅할 때만 1~4단계를 순서대로 밟으시면 되고, 한 번 세팅해 둔 뒤로는 명령어 한 줄로 편하게 켜실 수 있습니다.

우리가 만들 `socks5.py`는 검증된 오픈소스인 [pproxy](https://github.com/qwj/python-proxy) 엔진을 기반으로 아이디/비밀번호 인증이 걸린 TCP SOCKS5 서버를 띄워 줍니다. (UDP는 지원하지 않습니다.)

iSH 앱을 열고 터미널 입력창이 뜨면 아래 블록을 통째로 복사해 붙여넣으세요. 패키지를 내려받아야 하니 인터넷이 연결된 상태여야 합니다.

```sh
(
  set -eu
  apk update
  apk add python3 py3-pip curl
  mkdir -p /root/socks
  cd /root/socks
  if ! python3 -m venv .venv; then
    apk add py3-virtualenv
    python3 -m virtualenv .venv
  fi
  .venv/bin/python -m pip install 'pproxy==2.7.9'
  .venv/bin/python -c 'import pproxy; print("Python / pproxy OK")'
)
```

설치가 주르륵 진행된 뒤 맨 마지막 줄에 **`Python / pproxy OK`**가 찍히면 1단계 성공입니다! 혹시 중간에 에러가 나면 괄호(`set -eu`) 덕분에 자동으로 멈추니 인터넷 연결 상태를 확인하고 다시 시도해 보세요.

## 2. socks5.py 서버 파일 만들기

이제 빈 폴더 안에 실제 서버 프로그램인 `socks5.py`를 만들어 넣을 차례입니다. 아래 블록을 복사해서 iSH에 붙여넣고, 혹시 마지막 줄에서 멈춰 있으면 엔터를 한 번 탁 쳐 주세요.

```sh
cat > /root/socks/socks5.py <<'PY'
#!/usr/bin/env python3
"""Authenticated TCP SOCKS5 example using pproxy 2.7.9. No UDP listener.

Local credentials stay beside this script in credentials.json. Do not publish it.
The SOCKS5 username/password exchange is NOT encrypted. Use a trusted network.
"""
import argparse
import asyncio
import getpass
import json
import os
from pathlib import Path
import re

CONFIG = Path(__file__).resolve().with_name("credentials.json")


def credentials():
    cfg = json.loads(CONFIG.read_text(encoding="utf-8"))
    user, password = cfg["username"], cfg["password"]
    if not isinstance(user, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", user) or "__" in user:
        raise ValueError("Use 1-64 ASCII letters, digits, _ or - for username; do not use consecutive underscores")
    if not isinstance(password, str) or not re.fullmatch(r"[A-Za-z0-9_-]{16,128}", password) or "__" in password:
        raise ValueError("Use 16-128 ASCII letters, digits, _ or - for password; do not use consecutive underscores")
    return user, password


async def serve(host, port):
    import pproxy
    user, password = credentials()
    proxy = pproxy.Server(f"socks5://{host}:{port}#{user}:{password}")
    # Disable IP-based authentication reuse; authenticate every connection.
    server = await proxy.start_server(dict(rserver=[], authtime=-1))
    print(f"SOCKS5 TCP listening on {host}:{port}; authentication required", flush=True)
    async with server:
        await server.serve_forever()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--configure", action="store_true")
    parser.add_argument("--host", default="127.0.0.1",
                        help="IPv4 bind address; use the phone LAN IP for PC access")
    parser.add_argument("--port", default=1080, type=int)
    args = parser.parse_args()
    if args.configure:
        if CONFIG.exists():
            raise SystemExit("credentials.json already exists; edit or remove it locally first")
        user = input("Username (ASCII letters/digits/_/-): ").strip()
        password = getpass.getpass("Password (16+ ASCII letters/digits/_/-): ")
        if password != getpass.getpass("Repeat password: "):
            raise SystemExit("Passwords do not match")
        # Validate before saving. The restrictive alphabet avoids URI delimiters.
        if not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", user) or "__" in user:
            raise SystemExit("Invalid username (consecutive underscores are not allowed)")
        if not re.fullmatch(r"[A-Za-z0-9_-]{16,128}", password) or "__" in password:
            raise SystemExit("Invalid password (consecutive underscores are not allowed)")
        fd = os.open(CONFIG, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            json.dump(dict(username=user, password=password), handle)
        print("Saved local credentials.json. Keep it private.")
        return
    try:
        asyncio.run(serve(args.host, args.port))
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
PY
```

파일이 잘 만들어졌는지 아래 한 줄로 가볍게 문법 검사를 돌려 봅니다. **`socks5.py OK`**가 뜨면 파일 준비 끝입니다.

```sh
cd /root/socks && .venv/bin/python -m py_compile socks5.py && echo 'socks5.py OK'
```

*(만약 복사·붙여넣기가 번거로우시면 [같은 socks5.py 파일 직접 내려받기](/assets/downloads/iphone-socks5/socks5.py)를 쓰셔도 됩니다.)*

## 3. 나만의 아이디와 비밀번호 걸어 두기

아무나 내 폰 프록시에 무임승차하면 안 되니 아이디와 비밀번호를 설정합니다. 아래 명령어를 실행하면 아이디와 비밀번호를 차례대로 물어봅니다.

```sh
cd /root/socks && .venv/bin/python socks5.py --configure
```

참고로 pproxy 내부 문법 때문에 밑줄 두 개(`__`)를 연속으로 쓰면 오류가 나도록 막아 두었습니다.

1. **`Username`**: 영문, 숫자, `_`, `-` 조합으로 편하게 입력합니다.
2. **`Password`**: 같은 문자 조합으로 **16자 이상** 길게 입력합니다. (보안상 원래 쓰는 포털 비밀번호 말고 완전히 새로운 비밀번호로 지어 주세요. 입력할 때 화면에 글자가 안 찍히는 게 정상입니다!)
3. **`Repeat password`**: 방금 친 비밀번호를 똑같이 한 번 더 입력합니다.

**`Saved local credentials.json. Keep it private.`** 메시지가 나오면 비밀번호 금고가 안전하게 생성된 겁니다. 나중에 PC(v2rayN)에서 접속할 때 이 아이디와 비밀번호를 그대로 쓰게 됩니다.

## 4. 서버 테스트 가동해 보기

자동화를 붙이기 전에, 일단 순수하게 서버가 잘 뜨는지부터 테스트해 봅니다.

```sh
cd /root/socks && .venv/bin/python -u socks5.py --host 0.0.0.0 --port 1080
```

화면에 **`SOCKS5 TCP listening on 0.0.0.0:1080; authentication required`**라고 뜨면 아이폰 안에서 프록시 서버가 성공적으로 문을 연 것입니다! (iOS에서 '로컬 네트워크 접근 권한'을 물어보면 **허용**을 눌러 주세요.)

참고로 `--host 0.0.0.0`은 핫스팟으로 연결된 내 PC가 아이폰 서버에 들어올 수 있도록 문을 열어 주는 옵션입니다. 테스트가 끝나고 서버를 끄고 싶을 땐 iSH 화면 위쪽 보조 키보드에서 `Ctrl` 버튼을 누른 뒤 알파벳 `C`를 누르시면 됩니다.

## Windows PC와 v2rayN에서 접속하기

아이폰에서 서버를 켜 둔 상태로, 이제 PC를 아이폰 개인용 핫스팟에 연결합니다.

Windows에서 PowerShell을 열고 `ipconfig`를 쳐서 핫스팟 연결의 **'기본 게이트웨이(Default Gateway)'** IP 주소를 확인합니다. 보통 `172.20.10.1` 같은 형태인데, 그 주소가 바로 아이폰의 집 주소입니다.

아래 명령어로 PC에서 아이폰의 1080번 포트로 노크가 되는지 먼저 찔러 봅니다.

```powershell
$phoneIp = Read-Host '아이폰 연결 주소'
Test-NetConnection -ComputerName $phoneIp -Port 1080
```

결과에 `TcpTestSucceeded : True`가 뜨면 길은 뚫린 겁니다! (만약 `False`가 뜨면 핫스팟 연결 상태나 iSH의 로컬 네트워크 권한을 다시 확인해 주세요.)

이어서 방금 설정한 아이디/비밀번호로 실제 인터넷 페이지가 불러와지는지 테스트합니다.

```powershell
$proxyUser = Read-Host '설정한 SOCKS 사용자 이름'
curl.exe --connect-timeout 10 --max-time 30 `
  --proxy "socks5h://${phoneIp}:1080" `
  --proxy-user "$proxyUser" https://example.com/
```

비밀번호 입력창이 뜨면 아이폰에서 설정했던 16자 이상 비밀번호를 입력합니다. 화면에 `Example Domain` HTML 코드가 주르륵 쏟아져 나오면 **축하합니다! PC 요청이 아이폰 iSH 프록시를 타고 인터넷에 다녀온 것입니다.**

이제 매번 명령어로 쓸 순 없으니 윈도우용 프록시 클라이언트인 **[v2rayN](https://github.com/2dust/v2rayN)**에 이 서버를 등록해 줍니다.

| 항목 | 입력할 값 |
| --- | --- |
| 유형 (Type) | `SOCKS` (또는 `SOCKS5`) |
| 주소 (Address) | 방금 확인한 아이폰 게이트웨이 IP 주소 |
| 포트 (Port) | `1080` |
| 사용자 이름·비밀번호 | 아이폰 3단계에서 설정한 아이디와 비밀번호 |
| 활성 서버 지정 | 방금 추가한 항목을 우클릭해 활성 서버로 선택 |

처음 연결할 때는 복잡한 TUN 모드 대신 기본 **'시스템 프록시 설정(Set system proxy)'**부터 켜서 웹 브라우저가 잘 열리는지 확인하시는 게 깔끔합니다. 

> **💡 잊지 마세요!** 다 쓰고 나서 v2rayN을 끌 때는 하단에서 **'시스템 프록시 해제(Clear system proxy)'**를 꼭 먼저 눌러 주세요. 프록시 설정을 켜 둔 채로 프로그램만 끄면 윈도우가 없어진 프록시만 찾느라 인터넷이 먹통이 된 것처럼 보입니다.

## 위치 읽기와 서버 실행을 '원클릭 스크립트'로 묶기

PC 연결까지 확인했으니 이제 귀찮은 과정을 하나로 합칠 차례입니다. iSH로 돌아와서 켜 두었던 테스트 서버를 `Ctrl+C`로 끕니다.

아래 블록을 복사해서 붙여넣으면, **① 백그라운드 유지용 위치 읽기 실행 + ② 중복 실행 방지 잠금장치 + ③ 프록시 서버 실행 + ④ 종료 시 뒷정리**까지 알아서 해 주는 만능 실행 스크립트(`start-socks.sh`)가 만들어집니다.

```sh
cat > /root/socks/start-socks.sh <<'SH'
#!/bin/sh
set -eu
cd /root/socks

# A directory lock avoids starting multiple copies from different login shells.
if ! mkdir .run-lock 2>/dev/null; then
    echo 'Already running, or stale .run-lock. Check ps before removing the lock.'
    exit 1
fi
location_pid=''
cleanup() {
    if [ -n "$location_pid" ]; then
        kill "$location_pid" 2>/dev/null || :
        wait "$location_pid" 2>/dev/null || :
    fi
    rmdir .run-lock 2>/dev/null || :
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM HUP

if [ ! -c /dev/location ]; then
    echo '/dev/location is unavailable; background keep-alive is not enabled.'
    exit 1
fi
cat /dev/location > /dev/null &
location_pid=$!

# Foreground server: Ctrl+C returns to the shell and stops this location reader.
# All IPv4 interfaces are reachable: only use a trusted private hotspot/network.
.venv/bin/python -u socks5.py --host 0.0.0.0 --port 1080
SH
chmod 700 /root/socks/start-socks.sh
```

*(파일로 받으시려면 [같은 start-socks.sh 내려받기](/assets/downloads/iphone-socks5/start-socks.sh)를 이용하세요.)*

이제부터는 복잡한 명령어 대신 딱 **이 한 줄**만 치면 위치 유지와 서버가 동시에 켜집니다! (처음 실행할 때 iOS가 위치 권한을 물어보면 **'항상 허용' 또는 '앱을 사용하는 동안 허용'**을 눌러 주세요.)

```sh
sh /root/socks/start-socks.sh
```

이 스크립트의 장점은 나중에 `Ctrl+C`를 눌러 서버를 끄면, 백그라운드에서 배터리를 먹고 있던 위치 읽기 프로세스(`cat /dev/location`)도 알아서 같이 깔끔하게 꺼 준다는 점입니다.

혹시 iSH 앱이 비정상적으로 강제 종료되어서 다음번에 켤 때 `Already running, or stale .run-lock`이라는 안내가 뜨면, 당황하지 마시고 `ps` 명령어로 실행 중인 서버가 없는 걸 확인한 뒤 아래 명령어로 잠금 폴더만 지우고 다시 켜시면 됩니다.

```sh
rmdir /root/socks/.run-lock
sh /root/socks/start-socks.sh
```

물론 `/dev/location` 꼼수를 써도 아이폰 메모리가 극도로 부족하거나 iOS가 마음먹고 앱을 정리할 때는 끊길 수 있으니, 화면을 잠근 상태에서 얼마나 오래 버티는지는 본인의 사용 패턴에 맞춰 가볍게 테스트해 보세요.

## 한 걸음 더: iSH 앱을 켜자마자 자동으로 서버 띄우기 (.profile)

"나는 저 한 줄 치는 것도 귀찮다! 앱을 열자마자 서버가 바로 켜졌으면 좋겠다!" 하시는 분들은 아래 블록을 복사해 실행해 두세요. (먼저 켜져 있는 서버는 `Ctrl+C`로 끈 상태에서 입력합니다.)

```sh
if ! grep -Fq '# BEGIN iSH SOCKS5 autostart' /root/.profile 2>/dev/null; then
  cat >> /root/.profile <<'PROFILE'

# BEGIN iSH SOCKS5 autostart
case $- in
  *i*)
    if [ ! -e /root/socks/disable-autostart ] &&
       [ -x /root/socks/start-socks.sh ]; then
      sh /root/socks/start-socks.sh
    fi
    ;;
esac
# END iSH SOCKS5 autostart
PROFILE
fi
```

이렇게 해 두면 iSH 앱을 새로 실행해서 로그인 세션이 열릴 때마다 묻지도 따지지도 않고 자동으로 프록시 서버가 가동됩니다.

만약 다른 터미널 작업을 해야 해서 자동 실행을 잠시 끄고 싶을 때는, `Ctrl+C`로 서버를 멈춘 뒤 아래 명령어로 '방해 금지 팻말' 파일을 하나 만들어 두면 됩니다.

```sh
touch /root/socks/disable-autostart
```

다시 자동 실행을 켜고 싶을 땐 팻말 파일만 지워 주면 끝입니다.

```sh
rm /root/socks/disable-autostart
```

## iOS 단축어와 찰떡궁합으로 묶는 팁

마지막 화룡점정으로 아이폰 기본 **'단축어'** 앱을 활용하면 훨씬 편해집니다.

아쉽게도 iSH는 `ish://실행할명령어` 같은 외부 명령어 전달 기능을 지원하지 않습니다([공식 깃허브 이슈](https://github.com/ish-app/ish/issues/2063)에서도 지원 계획 없음으로 닫혔더군요). 즉 단축어에서 '앱 열기'로 iSH를 호출할 때, 앱이 완전히 꺼져 있었다면 방금 만든 `.profile` 덕분에 자동으로 서버가 켜지지만, 이미 켜져 있던 창으로 돌아갈 때는 자동 실행이 안 돌 수 있습니다.

그래서 단축어를 만드실 때 이렇게 **2단 콤보**로 구성하는 걸 추천합니다.

1. **텍스트를 클립보드에 복사**: `sh /root/socks/start-socks.sh`
2. **앱 열기**: `iSH` 선택

이렇게 만들어서 홈 화면 아이콘이나 아이폰 동작 버튼(Action Button)에 등록해 두면, 버튼을 눌렀을 때 서버가 자동으로 켜지면 좋고, 혹시 꺼져 있더라도 터미널 창을 톡 눌러 **'붙여넣기'**만 하면 1초 만에 서버를 다시 살릴 수 있습니다.

## 마무리 및 보안 팁

- **공용 와이파이에선 금물**: SOCKS5 프로토콜 자체는 비밀번호를 암호화하지 않고 평문으로 주고받습니다([RFC 1929](https://www.rfc-editor.org/rfc/rfc1929)). 따라서 카페 공용 와이파이 같은 곳에서는 절대 켜 두지 마시고, 내 아이폰 핫스팟에 내 PC만 일대일로 붙는 안전한 환경에서만 사용하세요.
- **차근차근 한 단계씩**: 처음 세팅할 때부터 자동 실행(`.profile`)까지 한꺼번에 다 넣으면 어디서 막혔는지 찾기 힘듭니다. **'수동 서버 실행 → PC 연결 테스트 → 원클릭 스크립트 → 자동 실행'** 순서대로 하나씩 도장 깨기하듯 붙이시는 걸 추천합니다.

## 세 줄 요약

1. a-Shell의 무음 재생 꼼수보다 iSH에서 `/dev/location`으로 백그라운드를 유지하고 `pproxy`로 인증 걸린 SOCKS5 서버를 띄우는 편이 훨씬 안정적입니다.
2. 위치 프로세스 실행과 종료 뒷정리를 하나의 셸 스크립트(`start-socks.sh`)로 묶고 `.profile`에 등록하면 iSH를 켜자마자 서버가 자동으로 뜹니다.
3. PC(v2rayN) 연결이 잘 되는지 먼저 테스트한 뒤, 본인의 알뜰폰 요금제에서 실제 테더링 데이터가 어떻게 차감되는지 소량으로 꼭 확인해 보세요.
