---
title: "Real-time scrum voting app using React/Redux/Tailwind & Firebase
  Realtime Database (Part 1: Application structure)"
cover: /media/react-redux-firebase.png
date: 2021-04-25T12:22:23.537Z
description: In this multi-part series we're going to build a real-time scrum
  voting app using React, Redux, Tailwind CSS and Firebase Realtime Database.
tags:
  - javascript
  - react
  - redux
draft: false
hide: true
---
Hi all, this is part 1 of a multi-part series, in which we are going to build a real-time scrum voting app using some of the hottest frontend technologies! 😎

# **Stack**

* **React & Redux** for state management
* **Tailwind CSS** for quick and effortless styling
* **Firebase Realtime Database** for storage

# Requirements

The goal is to implement a web application that will be used by a remote scrum team, during their sprint planning session, to privately vote on the complexity score of a single story (task/feature to be implemented).

* Full-fledged real-time implementation: All changes will happen in real-time and will be immediately visible to everyone.
* Each client gets assigned a default random username when first visiting the app which he can also refresh.
* Any participant can edit his/her username, as well as the feature-to-be-implemented title.
* Any participant can vote and reveal all votes, effectively ending the session.
* While votes are hidden, any participant that has voted gets a "Voted!" message next to his/her username.
* When votes are revealed, users get reordered based on their votes. After that, anyone is able to reset the session, clearing all votes and resetting the feature title.

## End result

![real-time-scrum-voting-app-demo](https://github.com/mliakos/scrum-voting-app/blob/master/demo/scrum-voting-app.gif?raw=true "Application demo")

You can check it live [here](https://manos-liakos.dev/scrum-voting-app/).

Phew, that seemed quite overwhelming 🤯. This project was part of a code challenge, so don't put the blame on me 😂 Anyway, let's get down to it.

# Planning the application