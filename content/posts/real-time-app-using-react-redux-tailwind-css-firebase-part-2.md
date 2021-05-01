---
title: Real-time app using React, Redux, Tailwind CSS & Firebase - Part 2
date: 2021-05-01T07:49:53.548Z
description: In this part we will
slug: real-time-scrum-voting-app-part-2
tags:
  - javascript
  - react
  - redux
draft: true
---
In the last part we laid out the requirements, planned the architecture and initialized firebase. Now, we are going to setup Redux and craft some of the application components.

- - -

# Setting up Redux

## Why vanilla redux

As stated in the previous part, we are going to use **Redux Core** and not **Redux Toolkit**, which includes **Redux Core**, plus a few other packages and abstractions to make development easier. From the [official page](https://redux-toolkit.js.org/introduction/getting-started):

> ## Purpose[](https://redux-toolkit.js.org/introduction/getting-started#purpose "Direct link to heading")
>
> The **Redux Toolkit** package is intended to be the standard way to write [Redux](https://redux.js.org/) logic. It was originally created to help address three common concerns about Redux:
>
> * "Configuring a Redux store is too complicated"
> * "I have to add a lot of packages to get Redux to do anything useful"
> * "Redux requires too much boilerplate code"

The reason we are not going to use **Redux Toolkit**, or any other similar package is simply because **getting to know the intricacies** of the tools you use to build important parts of your application - and state management is one of them - is of paramount importance. I'm not talking about learning the internals of webpack here, but knowing how to setup and develop a vanilla Redux project before using various abstractions and templates, IMHO, is a must. Furthermore, you won't be able to **understand the core Redux concepts** (or [Flux ](https://medium.com/@sidathasiri/flux-and-redux-f6c9560997d7)architecture, in general) without getting your hands dirty at a "lower level".

## Configuring the store

In this series I won't be explaining how Redux works, only providing brief insights and links to any resource I deem useful. If you want to take a deep dive into Redux you will find everything you need in the [official page](https://redux.js.org/introduction/getting-started).

The first thing we are going to do is create the **root reducer**. The root reducer is going to **combine** all of our reducers inside **`src/store/reducers`**. This gives us the ability to namespace our state, by creating different slices of it and separate business logic. As it is stated in the [official FAQ section](https://redux.js.org/faq/reducers#how-do-i-share-state-between-two-reducers-do-i-have-to-use-combinereducers):

> The suggested structure for a Redux store is to split the state object into multiple “slices” or “domains” by key, and provide a separate reducer function to manage each individual data slice. This is similar to how the standard Flux pattern has multiple independent stores, and Redux provides the [`combineReducers`](https://redux.js.org/api/combinereducers) utility function to make this pattern easier.

You can read more about splitting reducers logic and `combineReducers`here and [here](https://redux.js.org/api/combinereducers). Create a file called `index.js`inside `src/store/reducers`and type the following code:

```javascript
import { combineReducers } from "redux";
import feature from "./feature";

export default combineReducers({
	feature
});

```

We are importing the **feature** reducer which we are going to implement in a while. We will also import the **users** reducer later on. 

The root file of our app, `index.js`, is going to contain all of the "binding" logic (redux store, firebase providers, etc.). 



## Installing Redux devtools

```shell
npm install --save-dev redux-devtools
```

# Creating components