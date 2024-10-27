---
title: Recursively merge folder on macOS (native tool)
date: 2024-10-27
slug: conditional-github-action
tags:
  - post
  - cli
  - macos
---
So my sister ended up in a situation where she had been maintaining two different folders on her Mac, each one containing a huge amount of files. She needed to merge `folder A` to `folder B` and all of their respective subfolders (recursively). I discovered this little tool that does exactly that - and the best part is that it's native to macOS: `ditto`

Just open a terminal and use it likewise:

```bash
ditto ./folder\ a ./folder\ b
```

Basically `ditto <source> <destination>`.

And that's it. You can find more on the [Man Page](https://ss64.com/mac/ditto.html).