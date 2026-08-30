#!/usr/bin/env python3
"""Scrape the CM01/02 offsets thread from champman0102.net"""

import requests
from bs4 import BeautifulSoup
import json
import re
import time

base_url = "https://champman0102.net/viewtopic.php?t=1540"
all_posts = []

# Fetch first page
print("Fetching page 1...")
response = requests.get(base_url)
soup = BeautifulSoup(response.text, "html.parser")

# Find pagination
pagination = soup.find("div", class_="pagination")
total_pages = 1
if pagination:
    page_info = pagination.get_text()
    match = re.search(r"of\s+(\d+)", page_info)
    if match:
        total_pages = int(match.group(1))

print(f"Total pages: {total_pages}")

for page in range(1, total_pages + 1):
    start = (page - 1) * 25
    url = f"{base_url}&start={start}"
    print(f"Fetching page {page}/{total_pages}...")

    try:
        response = requests.get(url, timeout=30)
        soup = BeautifulSoup(response.text, "html.parser")

        # Find all post containers
        posts = soup.find_all("div", attrs={"class": "post"})
        if not posts:
            # Try alternative selector
            posts = soup.find_all("div", class_=lambda x: x and "post" in x)

        for post in posts:
            post_id = post.get("id", "")

            # Get author
            author_tag = post.find("a", class_="username")
            if not author_tag:
                author_tag = post.find("strong", class_="username")
            author = author_tag.get_text(strip=True) if author_tag else "Unknown"

            # Get post content
            content_tag = post.find("div", class_="content")
            if content_tag:
                # Replace code blocks
                for code in content_tag.find_all(["code", "pre"]):
                    code_text = code.get_text()
                    code.replace_with(f"\n```\n{code_text}\n```\n")
                content = content_tag.get_text(separator="\n", strip=True)
            else:
                content = ""

            # Get post date/time
            time_tag = post.find("time")
            if time_tag:
                post_time = time_tag.get("datetime", "")
            else:
                # Try alternative
                time_tag = post.find("p", class_="author")
                post_time = time_tag.get_text(strip=True) if time_tag else ""

            all_posts.append({
                "post_id": post_id,
                "author": author,
                "time": post_time,
                "content": content[:5000]  # Limit size
            })

        print(f"  Found {len(posts)} posts")

    except Exception as e:
        print(f"  Error: {e}")

    time.sleep(1.5)  # Be polite

# Save to file
output_path = "/Users/admin/Champman0102-Remake/dat-offset-docs.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(all_posts, f, indent=2, ensure_ascii=False)

print(f"\nTotal posts scraped: {len(all_posts)}")
print(f"Saved to {output_path}")
