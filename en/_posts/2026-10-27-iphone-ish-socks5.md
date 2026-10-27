---
layout: post
title: "Poking at iPhone Tethering Limits: My iSH SOCKS5 and Shortcuts Setup"
date: 2026-10-27 14:40:00 +0900
category: dev-tips
tags: [automation, security, iPhone, iSH, proxy]
image: /assets/img/posts/iphone-ish-socks5/connection.webp
summary: The whole process of running a SOCKS5 proxy server in iSH on an iPhone and connecting it to Windows v2rayN. A hands-on guide that also covers keeping it alive in the background and auto-starting it, so you never retype the commands.
---

I started out just looking into the tethering limits on an iPhone MVNO plan (a budget carrier plan). Somehow that turned into running a SOCKS5 proxy server straight from the iPhone terminal apps **a-Shell** and **iSH**. Since I was building it anyway, I also pushed the experiment as far as it would go: how much of the "type these annoying commands every time" part can be automated?

If you just copy-paste the scattered commands floating around the internet, you'll often end up lost: the one file that actually matters is missing, or the server is wide open with no authentication. So this post walks through it in order, with nothing skipped: **① set up the server → ② connect the PC → ③ keep it alive in the background and automate it**.

If you'd rather skip the backstory and install things on your iPhone right now, jump straight to **[1. Prepare Python and a working folder in iSH](#ish-install)**. Under each code block there's a **"Copy code"** button that copies everything, including the file-creation commands, in one go.

<script src="/assets/js/iphone-ish-code-copy.js" defer></script>
<style>
.ish-copybar { display: flex; justify-content: flex-end; margin-top: 1rem; }
.ish-copybtn { min-height: 44px; padding: .5rem .9rem; border: 1px solid var(--line); border-radius: .4rem; color: var(--ink); background: var(--paper-2); font: inherit; font-size: .875rem; cursor: pointer; }
.ish-copybtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
</style>

## Before you start: a working proxy and tethering data charges are two different things

What carriers call "unlimited data" and the "included tethering (hotspot) allowance" follow different rules depending on the carrier and the plan's terms. (Even [Apple's official guidance](https://support.apple.com/ko-kr/111785) says hotspot support depends on the carrier's policy.)

With a SOCKS5 proxy, the internet requests from your PC are received by an app running inside the iPhone, which forwards them for you. But just because you dug this side tunnel doesn't mean the carrier will count all of it as the phone's own data usage. So **"does the proxy connect properly?"** and **"does my plan's tethering cap actually stay untouched?"** are two separate questions, and the safe move is to check them yourself with a small amount of data after connecting.

And of course, the basic road between the PC and the iPhone (a hotspot connection, for example) has to be open first. If the hotspot itself is blocked, or the PC can't reach the iPhone's port, no amount of proxy setup will fix it, so start by lightly checking your own plan's terms.

<figure><img src="/assets/img/posts/iphone-ish-socks5/connection.webp" alt="Connection order from the PC app to v2rayN's local port, the iPhone SOCKS5 server and the internet, plus the separate things to check: iOS keep-alive and the carrier's data charges" loading="lazy"><figcaption>The whole connection flow. Building the road with a proxy is one thing; iOS background keep-alive and whether the carrier charges the data are two more things you have to check separately.</figcaption></figure>

## Why I ended up on iSH instead of a-Shell

I tried **a-Shell** first, an iOS terminal app with Python built in. According to its [official docs](https://github.com/holzschu/a-shell#shortcuts), it plays quite nicely with iOS Shortcuts.

Back then I went with the well-known hack: "play a silent audio file forever + run `socks5.py` + loop the shortcut forever." Below is the shortcut screen I built at the time. Spoiler: **I don't recommend this approach.**

<figure class="narrow"><img src="/assets/img/posts/iphone-ish-socks5/ashell-shortcut.webp" alt="The old a-Shell shortcut screen: switch on Personal Hotspot, go to the working folder, play the silent file and run socks5.py, then repeat" loading="lazy"><figcaption>The a-Shell shortcut from my early experiments. Even with silent playback and a loop, iOS ruthlessly put the background server to sleep.</figcaption></figure>

Putting a wait or a loop inside a shortcut doesn't make iOS give a terminal app unlimited run time. The silent-audio trick also gets spotted quickly on recent iOS, and the server tends to just keel over. If you look at the [a-Shell GitHub issue](https://github.com/holzschu/a-shell/issues/721), there are several reports of the same thing: running a SOCKS proxy with silent playback, then getting force-killed.

So I changed direction and rebuilt the whole setup on **iSH**, which can hold on in the background more reliably through the location service (`/dev/location`). (One note: the `/root` path and the `apk` package commands are iSH-specific and won't work in a-Shell, so do all of this in the iSH app.)

## How the "two-line iSH command" you see everywhere actually works

If you've searched for tips on this, you've probably seen these two lines a lot.

```sh
cat /dev/location > /dev/null &
cd /root/socks && python3 socks5.py
```

- **Line 1 (`cat /dev/location ...`)**: It keeps reading the iPhone's GPS device, so iOS thinks "oh, this app is navigating right now!" and doesn't kill it in the background. (It's also the standard tip described on the [iSH official wiki](https://github.com/ish-app/ish/wiki/Running-in-background).) The stream of location coordinates is thrown into the trash can (`/dev/null`), and the `&` at the end sends it quietly to the back room (the background).
- **Line 2 (`cd /root/socks ...`)**: It steps into the working folder and starts the proxy server for real. Once the server is up, the terminal turns into a status display and the prompt stops. It's not broken, it's working as intended. To stop it, press `Ctrl+C`.

But those tips usually leave out the most important parts: **what's actually inside the `socks5.py` file**, and **how to cleanly shut down the location reader you left running in the back room**. So from here on I'll build the full set: a clean server with authentication, plus an automatic cleanup script.

<h2 id="ish-install">1. Prepare Python and a working folder in iSH</h2>

If you opened this page on your iPhone, just tap the **Copy code** button on each block, paste it into the iSH terminal, and hit Enter. You only need to go through steps 1 to 4 in order the first time. Once it's set up, you can start everything with a single line.

The `socks5.py` we'll make is built on the proven open-source engine [pproxy](https://github.com/qwj/python-proxy), and it runs a TCP SOCKS5 server protected by a username and password. (UDP is not supported.)

Open the iSH app, and when the terminal input appears, copy and paste the whole block below. It has to download packages, so you need an internet connection.

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

After the installation scrolls by, if the last line prints **`Python / pproxy OK`**, step 1 is a success! If something errors out midway, the parentheses (`set -eu`) make it stop automatically, so check your internet connection and try again.

## 2. Create the socks5.py server file

Now it's time to put the actual server program, `socks5.py`, into that empty folder. Copy the block below and paste it into iSH. If it seems stuck on the last line, just press Enter once.

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

Run a quick syntax check with the one-liner below to make sure the file was created properly. If you see **`socks5.py OK`**, the file is ready.

```sh
cd /root/socks && .venv/bin/python -m py_compile socks5.py && echo 'socks5.py OK'
```

*(If copy-pasting is a hassle, you can also use [this same socks5.py as a direct download](/assets/downloads/iphone-socks5/socks5.py).)*

## 3. Set your own username and password

You don't want just anyone hitching a free ride on your phone's proxy, so let's set a username and password. When you run the command below, it asks for them one after another.

```sh
cd /root/socks && .venv/bin/python socks5.py --configure
```

One note: because of how pproxy parses its internal syntax, two underscores in a row (`__`) are blocked on purpose and will cause an error.

1. **`Username`**: Type whatever you like, using letters, digits, `_` and `-`.
2. **`Password`**: Use the same kind of characters, but make it **at least 16 characters** long. (For safety, make up a brand-new password rather than one you use for your portal accounts. And it's normal that nothing shows on screen as you type!)
3. **`Repeat password`**: Type the same password once more.

When you see **`Saved local credentials.json. Keep it private.`**, the password vault has been created safely. Later, you'll use this same username and password when connecting from the PC (v2rayN).

## 4. Give the server a test run

Before adding any automation, let's first test, in the plainest way possible, whether the server comes up at all.

```sh
cd /root/socks && .venv/bin/python -u socks5.py --host 0.0.0.0 --port 1080
```

If the screen says **`SOCKS5 TCP listening on 0.0.0.0:1080; authentication required`**, the proxy server has successfully opened its doors inside the iPhone! (If iOS asks for "Local Network" permission, tap **Allow**.)

By the way, `--host 0.0.0.0` is the option that lets your PC, connected over the hotspot, come in to the iPhone server. When you're done testing and want to stop the server, tap the `Ctrl` button on the helper keyboard at the top of the iSH screen, then press the letter `C`.

## Connecting from a Windows PC with v2rayN

With the server running on the iPhone, now connect your PC to the iPhone's Personal Hotspot.

On Windows, open PowerShell, run `ipconfig`, and find the **"Default Gateway"** IP address of the hotspot connection. It usually looks like `172.20.10.1`, and that address is the iPhone's home address.

Use the command below to first knock on the iPhone's port 1080 from the PC and see if anyone answers.

```powershell
$phoneIp = Read-Host 'iPhone address'
Test-NetConnection -ComputerName $phoneIp -Port 1080
```

If the result shows `TcpTestSucceeded : True`, the road is open! (If it says `False`, recheck the hotspot connection and iSH's local network permission.)

Next, test whether a real web page loads with the username and password you just set.

```powershell
$proxyUser = Read-Host 'SOCKS username you set'
curl.exe --connect-timeout 10 --max-time 30 `
  --proxy "socks5h://${phoneIp}:1080" `
  --proxy-user "$proxyUser" https://example.com/
```

When the password prompt appears, enter the 16+ character password you set on the iPhone. If `Example Domain` HTML comes pouring out on screen, **congratulations! Your PC's request rode through the iPhone's iSH proxy, visited the internet and came back.**

Typing commands every time isn't realistic, so let's register this server in **[v2rayN](https://github.com/2dust/v2rayN)**, a proxy client for Windows.

| Item | Value to enter |
| --- | --- |
| Type | `SOCKS` (or `SOCKS5`) |
| Address | The iPhone gateway IP address you just found |
| Port | `1080` |
| Username / password | The username and password you set in step 3 on the iPhone |
| Set as active server | Right-click the entry you just added and choose it as the active server |

For your first connection, skip the complicated TUN mode and start with the default **"Set system proxy"** to check that your web browser opens pages properly.

> **💡 Don't forget!** When you're done and want to quit v2rayN, be sure to click **"Clear system proxy"** at the bottom first. If you close the program while the proxy setting is still on, Windows keeps looking for a proxy that no longer exists, and it looks like your internet has died.

## Bundling the location reader and the server into a "one-click script"

Now that the PC connection works, it's time to merge all those annoying steps into one. Back in iSH, stop the test server you left running with `Ctrl+C`.

Copy and paste the block below, and it creates an all-in-one launch script (`start-socks.sh`) that handles **① starting the location reader for background keep-alive + ② a lock to prevent duplicate runs + ③ starting the proxy server + ④ cleaning up when it exits**.

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

*(If you'd rather get it as a file, use [this same start-socks.sh download](/assets/downloads/iphone-socks5/start-socks.sh).)*

From now on, instead of complicated commands, just type **this one line** and both the location keep-alive and the server start together! (When iOS asks for location permission the first time, tap **"Allow While Using App" or "Always Allow"**.)

```sh
sh /root/socks/start-socks.sh
```

The nice part of this script is that when you later press `Ctrl+C` to stop the server, it also neatly shuts down the location reader (`cat /dev/location`) that had been quietly draining your battery in the background.

If the iSH app gets force-closed abnormally and the next launch shows `Already running, or stale .run-lock`, don't panic. Use `ps` to confirm no server is actually running, then delete just the lock folder with the commands below and start again.

```sh
rmdir /root/socks/.run-lock
sh /root/socks/start-socks.sh
```

Of course, even with the `/dev/location` trick, the connection can drop when the iPhone is badly short on memory or when iOS decides to clean up apps. So test, in a relaxed way, how long it holds up with the screen locked, based on how you actually use it.

## One step further: start the server automatically the moment iSH opens (.profile)

If you're thinking "even typing that one line is too much! I want the server to just start when I open the app!", copy and run the block below. (Type it while any running server is stopped with `Ctrl+C`.)

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

With this in place, every time you launch iSH and a login session opens, the proxy server starts automatically, no questions asked.

If you need to do other terminal work and want to pause the auto-start for a while, stop the server with `Ctrl+C`, then create a "do not disturb sign" file with the command below.

```sh
touch /root/socks/disable-autostart
```

When you want auto-start back, just delete the sign file and you're done.

```sh
rm /root/socks/disable-autostart
```

## A tip for pairing it with iOS Shortcuts

For the finishing touch, the iPhone's built-in **Shortcuts** app makes things even easier.

Unfortunately, iSH doesn't support passing in an outside command like `ish://command-to-run` (the [official GitHub issue](https://github.com/ish-app/ish/issues/2063) was closed with no plans to support it). That means when a shortcut calls iSH with "Open App": if the app was completely closed, the `.profile` we just made starts the server automatically, but when you return to a window that was already open, the auto-start may not run.

So when you build the shortcut, I recommend a **two-step combo** like this.

1. **Copy text to clipboard**: `sh /root/socks/start-socks.sh`
2. **Open app**: choose `iSH`

Register it on your Home Screen icon or the iPhone Action Button. When you press it, great if the server starts on its own. And even if it's off, just tap the terminal window and hit **"Paste"** to bring the server back to life in a second.

## Wrap-up and security tips

- **Never on public Wi-Fi**: The SOCKS5 protocol itself doesn't encrypt the password; it goes over the wire in plain text ([RFC 1929](https://www.rfc-editor.org/rfc/rfc1929)). So never leave it on at a cafe's public Wi-Fi or the like. Use it only in a safe setup where your own PC connects one-on-one to your own iPhone hotspot.
- **One step at a time**: If you pile everything on from the first setup, all the way to auto-start (`.profile`), it's hard to find where you got stuck. I recommend adding things one by one, like clearing stages in a game: **"manual server start → PC connection test → one-click script → auto-start."**

## Three-line summary

1. Rather than a-Shell's silent-playback hack, keeping iSH alive in the background with `/dev/location` and running an authenticated SOCKS5 server with `pproxy` is far more stable.
2. Bundle the location process and the exit cleanup into one shell script (`start-socks.sh`) and register it in `.profile`, and the server starts by itself as soon as you open iSH.
3. First test that the PC (v2rayN) connection works, then be sure to check with a small amount of data how tethering data is actually charged on your own MVNO plan.
