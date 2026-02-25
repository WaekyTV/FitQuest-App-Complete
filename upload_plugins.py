#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
"""
Upload plugin files to GitHub WaekyTV/FitQuest-App-Complete
Run: python upload_plugins.py YOUR_GITHUB_TOKEN
"""

import base64
import os
import sys
import json
import urllib.request
import urllib.error

REPO = "WaekyTV/FitQuest-App-Complete"
BASE_PATH = r"c:\Users\Qweeven\Downloads\App\Fitquest-app-main\frontend\plugins"

FILES = [
    ("health-check\\health-endpoints.js", "frontend/plugins/health-check/health-endpoints.js"),
    ("health-check\\webpack-health-plugin.js", "frontend/plugins/health-check/webpack-health-plugin.js"),
    ("visual-edits\\babel-metadata-plugin.js", "frontend/plugins/visual-edits/babel-metadata-plugin.js"),
    ("visual-edits\\dev-server-setup.js", "frontend/plugins/visual-edits/dev-server-setup.js"),
]


def get_file_sha(token, path):
    """Get existing file SHA (needed for updates)"""
    url = f"https://api.github.com/repos/{REPO}/contents/{path}"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"token {token}")
    req.add_header("Accept", "application/vnd.github.v3+json")
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
            return data.get("sha")
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise


def upload_file(token, local_path, gh_path):
    """Upload a file to GitHub"""
    with open(local_path, "rb") as f:
        content = base64.b64encode(f.read()).decode()

    sha = get_file_sha(token, gh_path)

    url = f"https://api.github.com/repos/{REPO}/contents/{gh_path}"
    payload = {
        "message": f"Add {os.path.basename(gh_path)}",
        "content": content,
    }
    if sha:
        payload["sha"] = sha

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="PUT")
    req.add_header("Authorization", f"token {token}")
    req.add_header("Accept", "application/vnd.github.v3+json")
    req.add_header("Content-Type", "application/json")

    try:
        with urllib.request.urlopen(req) as resp:
            code = resp.getcode()
            print(f"  [OK] {gh_path} (HTTP {code})")
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  [FAIL] {gh_path} failed (HTTP {e.code}): {body[:200]}")
        return False


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python upload_plugins.py YOUR_GITHUB_TOKEN")
        sys.exit(1)

    token = sys.argv[1]
    print(f"Uploading {len(FILES)} plugin files to {REPO}...\n")

    successes = 0
    for local_rel, gh_path in FILES:
        local_path = os.path.join(BASE_PATH, local_rel)
        if not os.path.exists(local_path):
            print(f"  ✗ {local_path} not found")
            continue
        print(f"Uploading {gh_path}...")
        if upload_file(token, local_path, gh_path):
            successes += 1

    print(f"\nDone: {successes}/{len(FILES)} files uploaded successfully.")
    if successes == len(FILES):
        print("[SUCCESS] All plugin files uploaded!")
    else:
        print("[PARTIAL] Some files failed. Check the output above.")
