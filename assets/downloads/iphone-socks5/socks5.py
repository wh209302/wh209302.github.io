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
