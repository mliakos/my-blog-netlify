---
title: "CRLF: A song of pain and frustration"
date: 2021-06-15T15:30:19.374Z
description: ""
draft: true
---
- Line endings in stopwords file weird bug (windows CRLF vs unix LF)

Original file had only '\n' newline character. Re-committed file had '\r\n' characters indicating newline. Txt files were committed in Unix OS, so they only had LF (\n). On the contrary, I recommitted on Windows OS, which transformed newlines to CRLF (\r\n). Thus, the .split('\n') was not working correctly resulting in bug.

https://www.notion.so/Ideas-a4431fd51174430592177715e299a243#87b9f742f3d545bab174f267d3c9a81c