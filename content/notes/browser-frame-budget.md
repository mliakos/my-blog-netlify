---
title: Browser frame budget
date: 2021-07-25T14:05:04.581Z
description: browser-frame-budget
tags:
  - performance
---
A refresh rate of **60 FPS** is typical for any device these days. This means that in the timeframe of 1 second, the browser has to draw 1 frame on the screen, which in turn means that each frame has a **time budget of 16.6ms** (1 second / 60 frames = 16.66ms). Drawing this frame in 16.6ms includes:

* Executing JS
* Calculating styles
* Calculating layout
* Painting pixels on layers
* Compositing those layers

Since all of these tasks run in a single thread, when they take more than *~10ms (not 16ms, because there is also other work being done by the browser)*, frames start to drop. Drop enough frames and visually perceptible lagginess starts to occur.

Sources: [Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering) by Paul Lewis