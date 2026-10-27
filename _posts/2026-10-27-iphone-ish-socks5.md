---
layout: post
title: "아이폰 테더링 제한을 살펴보며 정리한 iSH SOCKS5와 단축어 설정"
date: 2026-10-27 14:40:00 +0900
category: dev-tips
tags: [자동화, 보안, 아이폰, iSH, 프록시]
image: /assets/img/posts/iphone-ish-socks5/connection.webp
summary: 아이폰의 SOCKS5 서버를 Windows v2rayN에 연결하는 흐름과 iSH 실행 자동화를 정리했습니다. 테더링 과금, 백그라운드 유지, 단축어의 한계도 함께 짚습니다.
---

아이폰 알뜰폰 요금제의 테더링 제한을 알아보다가 a-Shell과 iSH에서 SOCKS5 서버를 실행하는 방법까지 살펴봤습니다. 설정을 매번 입력하지 않으려면 어디까지 자동화할 수 있는지도 궁금했습니다.

저는 이 과정을 서버 실행, PC 연결, 백그라운드 유지로 나눠 정리했습니다. 특히 인터넷에서 본 명령을 그대로 옮기면 빠지기 쉬운 파일 준비와 인증 설정을 보완했습니다.

이 글은 공식 문서와 공개 소스를 확인하고 예제의 인증·TCP 중계를 PC에서 시험한 설정 가이드입니다. 아이폰 실기기에서 화면 잠금 후 유지 시간이나 통신사의 데이터 차감 방식을 측정한 사용기는 아닙니다.

아이폰에서 바로 설치하려면 [1. iSH에 Python과 작업 폴더 준비](#ish-install)부터 진행합니다. 코드 블록의 ‘코드 복사’를 누르면 파일 저장 명령까지 함께 복사됩니다.

<script src="/assets/js/iphone-ish-code-copy.js" defer></script>
<style>
.ish-copybar { display: flex; justify-content: flex-end; margin-top: 1rem; }
.ish-copybtn { min-height: 44px; padding: .5rem .9rem; border: 1px solid var(--line); border-radius: .4rem; color: var(--ink); background: var(--paper-2); font: inherit; font-size: .875rem; cursor: pointer; }
.ish-copybtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
</style>

## 테더링 제한과 프록시 연결은 따로 확인합니다

알뜰폰에서 말하는 데이터 무제한과 테더링 제공량은 요금제 상세 조건에서 각각 확인해야 합니다. 이 글에서는 특정 사업자나 요금제가 정해져 있지 않아 제공량과 소진 후 동작을 단정하지 않습니다. [Apple도 개인용 핫스팟의 지원 여부를 이동통신사와 요금제에서 확인하도록 안내합니다.](https://support.apple.com/ko-kr/111785)

SOCKS5를 사용하면 PC의 요청을 아이폰에서 실행 중인 프로그램이 받아 목적지에 연결합니다. 이 구조만으로 통신사가 해당 데이터를 휴대폰 일반 사용량으로 분류한다고 보장할 수는 없습니다. 프록시에 연결되었다는 사실과 테더링 한도가 줄지 않는다는 사실은 각각 검증해야 합니다.

또한 PC에서 아이폰까지 도달하는 연결이 먼저 필요합니다. 개인용 핫스팟 자체가 차단되었거나 PC가 아이폰의 서버 포트에 접근하지 못한다면 SOCKS5 설정만으로 해결되지 않습니다. 실제 사용 전에는 가입한 요금제의 테더링 조건과 허용 범위도 확인하는 편이 좋습니다.

<figure><img src="/assets/img/posts/iphone-ish-socks5/connection.webp" alt="PC 앱에서 v2rayN의 로컬 포트, 아이폰 SOCKS5 서버, 인터넷으로 이어지는 연결 순서와 별도로 확인할 iOS 유지 및 통신사 데이터 차감 조건" loading="lazy"><figcaption>프록시가 바꾸는 연결 경로입니다. iOS에서 계속 실행되는지와 요금제에서 어떻게 차감되는지는 따로 확인합니다.</figcaption></figure>

## a-Shell에서 확인한 것

a-Shell은 Python을 포함한 iOS 터미널입니다. [공식 README](https://github.com/holzschu/a-shell#shortcuts)에 따르면 단축어의 Execute Command 동작으로 명령을 실행할 수 있으며, 무거운 작업은 In App 실행을 선택하는 방식입니다. 확장 안에서 명령을 실행하는 In Extension과는 실행 환경이 다릅니다.

앞서 구성한 단축어에는 무음 파일 재생, `socks5.py`, 반복 동작이 들어 있었습니다. 아래는 당시 설정 화면입니다. 이 화면이 서버의 정상 기동이나 백그라운드 유지를 입증하지는 않습니다.

<figure class="narrow"><img src="/assets/img/posts/iphone-ish-socks5/ashell-shortcut.webp" alt="기존 a-Shell 단축어에 개인용 핫스팟 전환, 작업 폴더 이동과 무음 파일·socks5.py 실행, 반복 동작이 들어 있는 화면" loading="lazy"><figcaption>기존 설정 화면입니다. 무음 재생과 반복을 장시간 유지 방법으로 권장하는 예시는 아닙니다.</figcaption></figure>

단축어가 기다리거나 반복한다고 해서 iOS가 서버에 실행 시간을 계속 주지는 않습니다. 무음 재생도 안정성을 보장하는 방법으로 소개하기 어렵습니다. [a-Shell의 관련 이슈](https://github.com/holzschu/a-shell/issues/721)에서도 Python SOCKS 프록시와 무음 재생을 함께 사용하다 종료된 사례와 개발자의 설명을 확인할 수 있습니다.

a-Shell에서 기존 서버를 실행하려면 파일이 있는 폴더에서 `python3 socks5.py`를 실행해야 합니다. 파일이 없으면 이 명령만 입력해도 서버가 생기지는 않습니다. iSH의 `/root` 경로나 `apk` 설치 명령을 a-Shell에 그대로 사용해서도 안 됩니다.

## iSH에서 쓰던 두 줄의 의미

기존에 사용하려던 명령은 다음과 같습니다.

```sh
cat /dev/location > /dev/null &
cd /root/socks && python3 socks5.py
```

첫 줄은 위치 장치를 읽는 프로세스를 셸의 백그라운드로 실행합니다. `>`는 좌표 출력을 버리고 `&`는 다음 명령을 입력할 수 있게 합니다. [iSH 공식 위키](https://github.com/ish-app/ish/wiki/Running-in-background)가 안내하는 방법입니다. 위치 권한을 허용해야 하며, 위치 서비스 사용 자체를 끄는 명령은 아닙니다.

두 번째 줄은 폴더 이동에 성공했을 때만 Python 서버를 실행합니다. 서버는 터미널의 전경에서 계속 실행되므로 입력 창이 돌아오지 않는 것이 정상입니다. 중지할 때는 `Ctrl+C`를 누릅니다. 다만 첫 줄에서 띄운 위치 읽기는 별도 프로세스이므로 함께 정리해야 합니다.

원래 `socks5.py`의 소스는 확인 가능한 대화 기록에 남아 있지 않습니다. 인증 지원, 수신 주소, UDP 지원 여부는 현재로서는 알 수 없습니다. 아래에는 공개 패키지를 사용하는 별도 예제를 준비했습니다.

<h2 id="ish-install">1. iSH에 Python과 작업 폴더 준비</h2>

아이폰에서 이 글을 열고 각 코드 블록의 **코드 복사**를 누른 뒤 iSH에 붙여넣고 실행합니다. 블록 위아래의 설명은 복사하지 않아도 됩니다. 처음 설치할 때는 1~4단계를 순서대로 진행합니다. 설치가 끝난 뒤부터는 ‘위치 읽기와 서버를 한 번에 실행하기’의 명령 한 줄만 사용하면 됩니다.

이 예제의 `socks5.py`는 [pproxy](https://github.com/qwj/python-proxy)의 Server API를 사용하는 실행 파일입니다. 아래에 전체 코드를 넣었습니다. Python 표준 라이브러리만으로 동작하는 파일은 아니므로 pproxy 설치도 필요합니다. 이 구성은 인증을 사용하는 TCP SOCKS5이며 UDP는 지원하지 않습니다.

iSH를 처음 설치했다면 앱을 열고 터미널이 나타날 때까지 기다립니다. 아래 블록 전체를 붙여넣습니다. 설치가 끝날 때까지 정상적인 인터넷 연결이 필요합니다. 괄호까지 함께 복사하면 중간 명령이 실패했을 때 해당 블록 안의 나머지 설치를 멈춥니다.

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

마지막에 `Python / pproxy OK`가 나오면 다음 단계로 넘어갑니다. 오류가 나면 그 단계에서 멈춰 오류 내용을 확인합니다. `py3-virtualenv`도 찾지 못한다면 사용 중인 Alpine 버전의 저장소 설정과 [패키지 제공 여부](https://pkgs.alpinelinux.org/package/v3.20/community/x86/py3-virtualenv)를 확인해야 합니다. 시스템 Python에 패키지를 강제로 덮어쓰지는 않습니다.

## 2. socks5.py 전체 코드를 파일로 저장

아래 블록 전체를 복사해서 iSH에 붙여넣습니다. 첫 줄의 `cat`부터 마지막 `PY`까지 포함해야 합니다. `PY`가 단독으로 적힌 마지막 줄은 파일 입력을 끝내는 표시입니다. 붙여넣은 뒤 입력이 끝나지 않으면 Enter를 한 번 누릅니다.

명령은 `/root/socks/socks5.py`를 만듭니다. 같은 이름의 파일이 이미 있다면 내용을 덮어쓰므로, 기존 서버 코드를 계속 사용할 경우에는 이 단계를 건너뜁니다. 아래 3단계 이후의 인증 설정과 실행 옵션은 이 글의 코드 기준입니다.

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

저장 후 문법과 파일 위치를 확인합니다. `socks5.py OK`가 나오면 파일 준비가 끝난 것입니다. 이 확인은 실제 네트워크 연결 시험과는 별개입니다.

```sh
cd /root/socks && .venv/bin/python -m py_compile socks5.py && echo 'socks5.py OK'
```

파일로 받는 편이 편하다면 [같은 socks5.py 내려받기](/assets/downloads/iphone-socks5/socks5.py)도 사용할 수 있습니다. 위 코드 블록과 다운로드 파일의 내용은 같습니다.

## 3. 사용자 이름과 비밀번호 설정

아래 명령을 별도로 붙여넣고 실행합니다. 사용자 이름과 비밀번호를 묻는 단계는 화면을 보면서 직접 입력합니다.

```sh
cd /root/socks && .venv/bin/python socks5.py --configure
```

사용자 이름과 비밀번호에 연속된 밑줄(`__`)은 넣지 않습니다. pproxy가 연결 경로 구분자로 해석하는 문자열이어서 이 예제에서 거부하도록 했습니다. 입력 순서는 다음과 같습니다.

1. `Username`: 영문·숫자·`_`·`-`로 1~64자를 입력합니다.
2. `Password`: 같은 문자 범위로 16~128자를 입력합니다. 다른 서비스와 겹치지 않는 비밀번호를 사용합니다.
3. `Repeat password`: 같은 비밀번호를 다시 입력합니다.

비밀번호는 입력해도 화면에 표시되지 않습니다. `Saved local credentials.json. Keep it private.`가 나오면 저장이 끝났습니다. 사용자 이름과 비밀번호는 나중에 v2rayN에도 똑같이 입력합니다. 인증 정보가 담긴 `/root/socks/credentials.json`은 블로그나 Git 저장소에 올리면 안 됩니다.

`credentials.json already exists`가 나오면 이전 인증 설정이 남아 있다는 뜻입니다. 이미 설정한 계정으로 사용할 경우 다시 만들 필요가 없습니다.

## 4. 서버부터 실행해 연결 확인

처음에는 백그라운드 유지 없이 서버 연결만 시험합니다.

```sh
cd /root/socks && .venv/bin/python -u socks5.py --host 0.0.0.0 --port 1080
```

`SOCKS5 TCP listening on 0.0.0.0:1080; authentication required`가 나오면 서버가 시작된 것입니다. 실행 중에는 터미널 입력 창이 돌아오지 않습니다. 중지할 때는 iSH에서 `Ctrl+C`를 누릅니다. iSH의 보조 키보드에서 Ctrl을 선택하고 C를 입력하는 방식으로 보낼 수 있습니다.

기본 수신 주소인 `127.0.0.1`은 아이폰 내부에서만 접근할 수 있습니다. 위 명령의 `0.0.0.0`은 모든 IPv4 인터페이스에서 연결을 받으므로 본인 기기만 접속하는 신뢰할 수 있는 핫스팟에서 사용합니다. 가능하면 `--host`에 아이폰의 해당 연결 주소만 지정해 범위를 줄입니다. PC에는 `0.0.0.0` 대신 실제로 도달 가능한 아이폰 주소를 입력합니다.

iOS가 로컬 네트워크 접근 권한을 요청하면 허용합니다. 서버가 시작됐다는 메시지만으로 PC 접근까지 확인된 것은 아닙니다. 다음 단계의 포트 검사와 요청 시험을 통과해야 합니다.

## Windows와 v2rayN 연결

PC를 아이폰의 개인용 핫스팟에 연결한 뒤 PowerShell의 `ipconfig`에서 해당 어댑터의 기본 게이트웨이를 확인합니다. 보통 그 주소가 아이폰 쪽 연결 주소의 후보가 됩니다. 특정 숫자로 고정해서 적지 말고 실제 출력과 접근 가능 여부를 확인합니다.

```powershell
$phoneIp = Read-Host '아이폰 연결 주소'
Test-NetConnection -ComputerName $phoneIp -Port 1080
```

`TcpTestSucceeded`가 `False`라면 v2rayN 설정 전에 서버 기동, 주소, 포트, iOS 권한과 연결 상태를 다시 봅니다. `True`는 TCP 연결만 확인한 결과입니다. 다음으로 SOCKS 인증과 인터넷 요청을 시험합니다.

```powershell
$proxyUser = Read-Host '설정한 SOCKS 사용자 이름'
curl.exe --connect-timeout 10 --max-time 30 `
  --proxy "socks5h://${phoneIp}:1080" `
  --proxy-user "$proxyUser" https://example.com/
```

curl이 프록시 비밀번호를 요청하면 아이폰에서 정한 비밀번호를 입력합니다. 명령에 비밀번호를 직접 적지 않아 셸 기록에 남는 것을 피합니다. `socks5h`는 목적지 도메인 이름도 프록시 쪽에서 해석하도록 요청합니다. 이것이 다른 앱의 DNS 처리까지 바꾸지는 않습니다.

이 시험이 통과하면 [v2rayN](https://github.com/2dust/v2rayN)에 SOCKS 서버를 추가합니다. 버전과 언어 설정에 따라 메뉴 이름은 달라질 수 있지만 입력할 값은 같습니다.

| 항목 | 입력할 값 |
| --- | --- |
| 유형 | SOCKS / SOCKS5 |
| 주소 | PC에서 접근을 확인한 아이폰 주소 |
| 포트 | `1080` |
| 사용자 이름·비밀번호 | 아이폰에서 설정한 값 |
| 활성 서버 | 방금 추가한 SOCKS 항목 |

처음에는 TUN을 켜지 않고 일반 프록시 연결부터 확인하는 편이 문제를 찾기 쉽습니다. v2rayN이 표시하는 로컬 수신 포트를 확인하고 Windows 시스템 프록시를 설정합니다. 아이폰의 원격 포트 `1080`과 PC의 v2rayN 로컬 포트는 서로 다른 값입니다.

시스템 프록시 설정을 따르지 않는 앱은 이 경로를 사용하지 않을 수 있습니다. 또 v2rayN의 라우팅 규칙이 목적지를 직접 연결로 보내면 해당 요청은 아이폰 SOCKS 서버를 거치지 않습니다. 전체 요청을 시험할 때는 적용 중인 규칙도 확인합니다. TUN을 켜더라도 이 예제에 UDP 기능이 추가되지는 않습니다.

시험을 마치고 v2rayN을 종료할 때는 시스템 프록시도 해제합니다. 실행 중인 로컬 프록시가 없는데 설정만 남으면 인터넷 연결이 끊긴 것처럼 보일 수 있습니다.

## 위치 읽기와 서버를 한 번에 실행하기

PC 연결 시험까지 끝났다면 iSH로 돌아와 앞서 실행한 서버를 `Ctrl+C`로 중지합니다. 아래 블록 전체를 복사해 붙여넣으면 위치 읽기와 서버 실행을 묶은 파일이 만들어집니다. 마지막 `SH`까지 포함하고, 붙여넣은 뒤 필요하면 Enter를 한 번 누릅니다. 기존 `start-socks.sh`가 있으면 이 내용으로 바뀝니다.

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

이제부터는 다음 한 줄로 실행합니다. 처음 실행할 때 위치 권한 요청이 나오면 확인합니다. 위치 권한이 거부되어 있으면 iOS 설정에서 iSH의 위치 서비스 권한을 확인해야 합니다.

```sh
sh /root/socks/start-socks.sh
```

[같은 start-socks.sh 내려받기](/assets/downloads/iphone-socks5/start-socks.sh)도 제공합니다.

이 스크립트는 `/dev/location`을 읽고 Python 서버를 전경에서 실행합니다. `Ctrl+C`로 종료하면 자신이 시작한 위치 읽기 프로세스도 정리합니다. 다른 작업에 쓰는 `cat`까지 종료하는 `killall cat`은 사용하지 않습니다.

중복 실행은 `/root/socks/.run-lock` 디렉터리로 막습니다. 앱이 강제로 종료되면 이 디렉터리만 남을 수 있으므로, 다시 실행할 때 잠금 안내가 나오면 먼저 실행 중인 프로세스를 확인합니다.

```sh
ps
```

기존 Python 서버와 이 작업의 위치 읽기가 남아 있지 않은 것을 확인한 뒤에만 다음 명령으로 빈 잠금 디렉터리를 지우고 다시 실행합니다.

```sh
rmdir /root/socks/.run-lock
sh /root/socks/start-socks.sh
```

`/dev/location`을 사용해도 앱 강제 종료, 재부팅, 권한 변경과 iOS의 자원 회수까지 막지는 못합니다. [Apple의 백그라운드 위치 문서](https://developer.apple.com/documentation/corelocation/handling-location-updates-in-the-background)도 운영체제가 자원을 확보하려고 앱을 종료할 수 있다고 설명합니다. 화면 잠금 후 연결은 본인 기기에서 따로 시험해야 합니다. 위치 서비스 사용에 따른 배터리·발열도 확인합니다.

## .profile로 로그인할 때 자동 실행하기

실행 명령을 매번 입력하기 싫다면 아래 블록을 한 번 복사해 실행합니다. 먼저 서버를 `Ctrl+C`로 중지한 상태에서 입력합니다. 기존 `/root/.profile` 내용은 유지하고 파일 끝에 자동 실행 블록을 추가합니다. 같은 블록을 다시 복사해도 중복 등록하지 않습니다.

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

iSH의 기본 시작 명령은 [공개 소스의 UserPreferences.m](https://github.com/ish-app/ish/blob/master/app/UserPreferences.m)에서 `/bin/login -f root`로 확인했습니다. 기본 로그인 셸을 사용하는 새 세션에서 `.profile`을 읽는 흐름입니다. 시작 명령을 바꾸었거나 로그인 셸이 아니라면 동작을 확인해야 합니다.

앱을 다시 화면에 표시하는 것과 새 로그인 세션을 만드는 것은 다릅니다. 이미 열린 iSH로 돌아오는 경우 `.profile`이 다시 실행되지 않을 수 있습니다. 현재 세션에서 서버가 꺼져 있다면 `sh /root/socks/start-socks.sh`로 다시 시작합니다.

자동 실행을 잠시 끄려면 서버를 `Ctrl+C`로 중지하고 다음 파일을 만듭니다.

```sh
touch /root/socks/disable-autostart
```

다시 켜려면 이 파일만 지웁니다.

```sh
rm /root/socks/disable-autostart
```

## iOS 단축어에 넣을 수 있는 범위

단축어 앱에서 새 단축어를 만들고 ‘앱 열기’ 동작의 대상을 iSH로 지정합니다. 홈 화면이나 동작 버튼에 연결하면 iSH로 들어가는 단계를 줄일 수 있습니다. 단축어를 만드는 기본 흐름은 [Apple 사용 설명서](https://support.apple.com/ko-kr/guide/shortcuts/apd84c576f8c/ios)에 나와 있습니다.

다만 ‘앱 열기’는 셸 명령 실행 동작이 아닙니다. 새 로그인 세션이 만들어지면 앞의 `.profile`이 실행될 수 있지만 기존 세션으로 복귀하면 서버를 다시 시작하지 않습니다. 필요하면 단축어에 다음 텍스트를 ‘클립보드에 복사’한 뒤 iSH를 열도록 구성합니다.

```sh
sh /root/socks/start-socks.sh
```

이 경우 서버가 꺼져 있을 때 한 번 붙여넣고 실행하면 됩니다. 앱 복귀 상황까지 포함해 무조건 한 번에 재기동하는 단축어로 소개하지는 않습니다.

`ish://명령어`처럼 URL에 명령을 붙여 실행하는 기능은 이번에 확인한 자료에서 지원을 확인하지 못했습니다. [관련 iSH 기능 요청](https://github.com/ish-app/ish/issues/2063)도 not planned로 닫혀 있습니다. 이를 지원하는 것으로 가정한 단축어는 싣지 않았습니다. SSH로 명령을 보내는 방법은 SSH 서버 기동과 인증 관리가 더 필요하므로 이 설정에는 추가하지 않았습니다.

## 사용 전에 남겨 둘 확인 사항

SOCKS5 자체에는 연결 전체를 암호화하는 기능이 없습니다. [RFC 1929](https://www.rfc-editor.org/rfc/rfc1929)는 사용자 이름과 비밀번호도 평문으로 전달된다고 명시합니다. HTTPS를 사용해도 SOCKS 인증 교환까지 암호화되지는 않으므로 공용 Wi-Fi에서 이 예제를 열어 두지 않습니다. 예제는 연결마다 인증을 요구하도록 IP 기반 인증 재사용도 껐습니다.

제가 PC에서 확인한 범위는 인증 성공, 잘못된 인증 및 무인증 연결 거부, 인증 뒤 무인증 재접속 거부, IPv4·도메인 주소의 TCP 요청 중계입니다. iSH의 패키지 설치와 iOS 권한, 핫스팟에서의 실제 접근, 화면 잠금 후 지속 시간은 실기기 확인이 남아 있습니다. 통신사 데이터 차감도 이 시험으로 확인되지 않습니다.

직접 설정할 때는 서버 기동과 PC 요청을 먼저 확인하고 백그라운드 유지, `.profile`, 단축어를 차례로 붙이는 순서가 낫습니다. 어디서 끊겼는지 확인할 수 있고 자동 실행 때문에 생긴 문제도 되돌리기 쉽습니다.
