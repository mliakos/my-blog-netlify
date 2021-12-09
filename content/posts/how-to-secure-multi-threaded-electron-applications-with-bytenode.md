---
title: "How to secure multi-threaded Electron applications with bytenode "
date: 2021-12-09T07:25:17.754Z
description: This post is all about securing your JavaScript code in Electron
  apps, even the ones that use multiple threads or processes.
slug: how-to-secure-electron-apps
tags:
  - javascript
  - electron
draft: true
hide: true
---
> One can face a lot of frustration while searching how to secure his new & awesome Electron app. There can be a lot of uncertainty regarding which library to use, as well as how to setup webpack with worker threads or multiple processes. Fear not. In this article we are going to create a simple Electron app with multiple processes and worker threads, compile it using Bytenode, plus learn how to setup webpack to work with all of these. So let's get down to it.

## The procedure at a glance

* Initialize a react-electron-boilerplate app.
* Write our code.
* Download and install Bytenode.
* Configure webpack entries for multiple processes/threads (production only).
* Create additional `.js` entry files that will require process/worker thread compiled `.jsc` code (production only). 
* Create a gulpfile which will use Bytenode to compile our webpack-compiled (`.js`) files into V8 bytecode (`.jsc`) files and delete them afterwards, leaving us only with the `.jsc` ones.

## About Bytenode

[Bytenode](https://github.com/bytenode/bytenode) is an awesome little library by Osama Abbas, that will compile your `JS` code into `V8` bytecode. It's the best available way to seriously raise the bar for someone trying to pry on your source code.

## Creating our app

We are going to use a package called [react-electron-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate) which will provide us with an unopinionated basic framework to build our Electron app using React. Run the following commands in succession:

```shell
git clone --depth 1 --branch main https://github.com/electron-react-boilerplate/electron-react-boilerplate.git our-awesome-project
cd our-awesome-project
npm install
```

**TIP: If you face any error during the installation, try upgrading to the latest LTS version of Node.**

## Creating a separate process with worker threads

### Why
Electron apps consist of two processes, `main` and `renderer`. As per the official docs:

> Each Electron app has a single main process, which acts as the application's entry point. The main process runs in a Node.js environment, meaning it has the ability to `require` modules and use all of Node.js APIs.
>
> Each Electron app spawns a separate renderer process for each open BrowserWindow (and each web embed). As its name implies, a renderer is responsible for rendering web content. For all intents and purposes, code ran in renderer processes should behave according to web standards (insofar as Chromium does, at least).

One should never block any of those processes with synchronous code. There are many great articles touching on this issue, such as [this](https://medium.com/actualbudget/the-horror-of-blocking-electrons-main-process-351bf11a763c). The point is that for any long-running CPU-bound operation or just a frequently accessed database, we should create a separate process. Worker threads come in handy too, when we want to offload specific long running tasks from the parent process. Among many other differences, they are not isolated, which means that they share memory with the parent process and each other, plus they are more lightweight.

### Creating the process

Go ahead and create a `controller` folder under `src`. This is going to be the `controller` process entry file. You could also separate the frontend from the backend completely, but that's content for another post. Create `index.js` under the newly created controller folder and paste the following code: 

```javascript

```

We are going to spawn a process from the renderer.

### Adding workers