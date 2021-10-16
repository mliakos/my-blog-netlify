---
title: Conditional GitHub action based on commit message
date: 2021-10-13T16:10:10.371Z
slug: conditional-github-action
tags:
  - git
  - note
---
It's really annoying having a certain build/deployment GitHub action run on every push.

You can use this to run it **based on the commit message's content**:

```yaml
name: Publish

on:
  push:
    branches:
      - master

jobs:
  publish:
    if: "contains(github.event.head_commit.message, '[build]')"
```

Feel free to change the `'[build]'` part with whatever string you want.

You can also put a `!` at the beginning to invert the logic (Run the action on commit messages that **DON'T contain a certain string**)