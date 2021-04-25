---
title: Real-time app using React, Redux, Tailwind CSS & Firebase - Part 1
cover: /media/react-redux-firebase.png
date: 2021-04-25T19:13:53.651Z
description: "In this first part we are going to take a look at the
  requirements, plan the application structure, initialize a React app and set
  up Firebase. "
slug: real-time-scrum-voting-app-part-1
tags:
  - javascript
  - react
  - redux
draft: false
hide: false
---
Hi y' all, this is part 1 of a multi-part series, in which we are going to build a **[real-time scrum voting app](https://manos-liakos.dev/scrum-voting-app/)** using some of the hottest frontend technologies! 😎

# **Stack**

* **React & Redux** for state management.
* **Tailwind CSS** for quick and effortless styling.
* **Firebase Realtime Database** for storage.

# Requirements

The goal is to implement a web application that will be used by a remote scrum team, during their sprint planning session, to privately vote on the complexity score of a single story (task/feature to be implemented).

* Full-fledged real-time implementation: All changes will happen in **real-time** and will be immediately visible to everyone.
* Each client gets assigned a **default random username** when first visiting the app which he can also refresh.
* Any participant can **edit his/her username**, as well as the **feature-to-be-implemented title.**
* Any participant can **vote and reveal all votes**, effectively ending the session.
* While votes are hidden, any participant that has voted gets a **"Voted!" message** next to his/her username.
* When votes are revealed, users get **reordered based on their votes.** After that, anyone is able to **reset the session**, clearing all votes and resetting the feature title.

# End result

![real-time-scrum-voting-app-demo](https://github.com/mliakos/scrum-voting-app/blob/master/demo/scrum-voting-app.gif?raw=true "Application demo")

You can check it live [here](https://manos-liakos.dev/scrum-voting-app/).

Phew, that seemed quite overwhelming 🤯. This project was part of a code challenge, so don't put the blame on me 😂 Anyway, let's get down to it.

# Planning the application

One of the first things that I do when I start working on a front-end application is meticulously plan its architecture.

I visually divide the app into logical, **self-isolated components with discrete functionality.** 

Then I search for **reusable components** which will either be placed in a `common`module folder (in bigger projects) or will just be created with reusability in mind (dynamic, prop-based styling, etc.). 

**Wrappers** are also reusable components which wrap other (child) components to provide them with extra functionality (visual or logical). They are officially called[ HOCs or Higher Order Components](https://reactjs.org/docs/higher-order-components.html). I search for those kind of components, too. Imagine a `Layout` component which wraps our pages and provides them with static elements like `Header`, `Footer`, `Menu`, etc. or a `Card` component which wraps its children in a card-like element.

Next, I try to **delegate possible state** to each one of them (identifying **stateful** and **stateless** components), in case we are not using a centralized store for state management. In this case we will be using **[Redux](https://redux.js.org/)**, so only purely local state will be in-component.

Finally, I plan the app's folder structure as well as possible. Should the need to make changes down the road arise, especially if the app grows, a solid foundation is going to make for a resilient app.

## Components

![](/media/voting-app-components.png)

By taking a look at the image above, one could easily distinguish between the following components:

### Wrappers (HOCs)

* Card (Used to wrap VotingArea & Users/Participants components)

### Common/reusable

* Button
* Input 

### Normal

* FeatureTitle (Based on Input component)
* Heading (Page title & Username based on Input component)
* Users

  * User
* VotingArea

## Stateful

All of our state is going to live in the Redux store, so no planning is going to take place in here 😊

## Folder structure

Our app's code will live in `src` folder and is going to have the following structure:

```
├──src
   ├──__tests__
       ...test files...
   ├──common
      ...common functions used by many components...
   ├──components
      ...all of our components...
   ├──config
      ...configuration files...
   ├──containers
     ...I just left the App here as a container 😅...
   ├──firebase
     ...firebase service...
   ├──store
      ...our redux store...
      ├──actions
      ├──constants
      ├──reducers
   ├──utils
      ...helper functions...

 
```

I hope it's mostly self-explaining. We are going to add some more folders in a later part, but for now, a bird's-eye view should do it.

# Initialize application

To initialize our app, run:

```shell
npx create-react-app scrum-voting-app
```

## Install dependencies

### Tailwind CSS

You can pretty much follow the official instructions [here](https://tailwindcss.com/docs/guides/create-react-app), there's no point in repeating them in this post.

### Redux

We're going to use **plain redux** without any helpers (i.e. redux-toolkit). We are also going to **use redux-thunk** middleware to handle our async actions.

Run:

```shell
npm i redux react-redux redux-thunk
```

### Firebase

Here we need two libraries, **firebase** and **react-redux-firebase**. The first one is the Firebase SDK needed to connect to our database instance. The second one provides us with Redux bindings for Firebase in order to make our lives easier.

Run:

```shell
npm i firebase react-redux-firebase
```

## Modify files and structure

Create a folder called `containers` and move `App.js` and `App.css` in there and change the relative import in `index.js` accordingly:

```javascript
import App from "./containers/App";
```

Also change the logo import in `App.js` to avoid any errors:

```javascript
import logo from "../logo.svg";
```

Create the rest of the folders inside `src`, as seen in the **Folder Structure** section above. You can also delete `App.test.js` file or move it inside `__tests__` folder.

# Setting up Firebase

The next step, after we've finished drafting our application's blueprint, is to set up Firebase.

**Firebase** is a cloud JSON database which lets us store data in key-value pairs. Its **Realtime Database** flavor gives us the ability to synchronize every client using emitted events. All we have to do is utilize the API and create our handlers. Pretty cool, right? 🥳

## Create an account

Go to [](https://firebase.google.com/)<https://console.firebase.google.com/> and login with your google account. Create a new project by clicking on **"Add project".** Type a name and optionally enable Analytics.

## Create a database

Click on **"Realtime Database"** in the menu bar and then **"Create Database"**. Choose a location and then **"Start in test mode"** to have our app publicly accessible to everyone. You can change this later if you want to add authentication and whatnot. Boom, you're up and running!

## Adding a configuration file

Go to your project settings in Firebase console (Project Overview > Project Settings) and scroll down to **"Your apps"** section. Select our app and under **"Firebase SDK snippet"** choose **"Config"**. This is our config object, copy it.

Create a file called `firebase.js` inside `config` folder and paste the config object and some additional code, likewise:

```javascript
import firebase from "firebase/app";
import "firebase/database";
import "firebase/analytics";

// Configuration object copied from firebase console
const firebaseConfig = {
	apiKey,
	authDomain,
	databaseURL,
	projectId,
	storageBucket,
	messagingSenderId,
	appId,
	measurementId
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase.database();
```

Now we're ready to use our database.

- - -

That's it for this part, I hope you found it interesting. 

Let me know if you catch any errors and stay tuned for part 2!