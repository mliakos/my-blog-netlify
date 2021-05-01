---
title: Real-time app using React, Redux, Tailwind CSS & Firebase - Part 2
cover: /media/react-redux-firebase.png
date: 2021-05-01T07:49:53.548Z
description: In this part we are going to setup Redux, connect it to Firebase
  and create our first component.
slug: real-time-scrum-voting-app-part-2
tags:
  - javascript
  - react
  - redux
draft: false
hide: false
---
# Table of contents

* [Setting up Redux](#setting-up-redux)

  * [Why vanilla redux](#why-vanilla-redux)
  * [Configuring the store](#configuring-the-store)

    * [Root reducer](#root-reducer)
    * [Application root file](#application-root-file)
  * [App component](#app-component)
  * [Installing Redux devtools](#installing-redux-devtools)
* [Creating FeatureTitle component](#creating-featuretitle-component)

  * [Designing a generic Input component](#designing-a-generic-input-component)
  * [Designing FeatureTitle component](#designing-featuretitle-component)
  * [Crafting the state](#crafting-the-state)

    * [Constants](#constants)
    * [Actions](#actions)
    * [Reducer](#reducer)
* [Adding Firebase persistence](#adding-firebase-persistence)

  * [Connect Firebase with application](#connect-firebase-with-application)
  * **[Some tips:](#--some-tips---)**

    * [Middleware vs Store Enhancers](#middleware-vs-store-enhancers)
    * [Compose method](#compose-method)
    * [ApplyMiddleware method](#applymiddleware-method)
    * [Redux Thunk](#redux-thunk)
  * [Connect Firebase with component](#connect-firebase-with-component)

    * [Debounce function](#debounce-function)
    * [Push updates to Firebase](#push-updates-to-firebase)
    * [Receive updates from Firebase](#receive-updates-from-firebase)

- - -

In the [previous part](https://blog.manos-liakos.dev/real-time-scrum-voting-app-part-1) we laid out the requirements, planned the architecture and initialized firebase. Now, we are going to setup Redux, connect it to Firebase and create our first component.

# Setting up Redux

## Why vanilla redux

As stated in the previous part, we are going to use **Redux Core** and not **Redux Toolkit**, which includes **Redux Core**, plus a few other packages and abstractions to make development easier. From the [official page](https://redux-toolkit.js.org/introduction/getting-started):

> The **Redux Toolkit** package is intended to be the standard way to write [Redux](https://redux.js.org/) logic. It was originally created to help address three common concerns about Redux:
>
> * "Configuring a Redux store is too complicated"
> * "I have to add a lot of packages to get Redux to do anything useful"
> * "Redux requires too much boilerplate code"

The reason we are not going to use **Redux Toolkit**, or any other similar package is simply because **getting to know the intricacies** of the tools you use to build important parts of your application - and state management is one of them - is of paramount importance. I'm not talking about learning the internals of *webpack* here, but knowing how to setup and develop a vanilla Redux project before using various abstractions and templates, IMHO, is a must. Furthermore, you won't be able to **understand the core Redux concepts** (or [Flux](https://medium.com/@sidathasiri/flux-and-redux-f6c9560997d7) architecture, in general) without getting your hands dirty at a "lower level".

## Configuring the store

In this series I won't be explaining how Redux works, only providing brief insights and links to any resource I deem useful. If you want to take a deep dive into Redux you will find everything you need in the [official page](https://redux.js.org/introduction/getting-started).

### Root reducer

The first thing we are going to do is create the **root reducer**. The root reducer is going to **combine** all of our reducers inside **`src/store/reducers`**. This gives us the ability to **namespace** our state, by creating different slices of it and separate business logic. As stated in the [official FAQ section](https://redux.js.org/faq/reducers#how-do-i-share-state-between-two-reducers-do-i-have-to-use-combinereducers):

> The suggested structure for a Redux store is to split the state object into multiple “slices” or “domains” by key, and provide a separate reducer function to manage each individual data slice. This is similar to how the standard Flux pattern has multiple independent stores, and Redux provides the [`combineReducers`](https://redux.js.org/api/combinereducers) utility function to make this pattern easier.

You can read more about splitting up reducers logic and `combineReducers` [here](https://redux.js.org/recipes/structuring-reducers/splitting-reducer-logic) and [here](https://redux.js.org/api/combinereducers).

Create a file named `index.js` inside `src/store/reducers` and type the following code:

```javascript
import { combineReducers } from "redux";
import feature from "./feature";

export default combineReducers({
	feature
});
```

Also, create a file named **`feature.js`** in the same folder to avoid getting an import error. This is going to be our **`FeatureTitle` component reducer**, but just leave it empty for now and ignore the console complaining about not having a valid reducer.

### Application root file

The root file of our app, `index.js`, is going to contain all of the "binding" logic (**`Provider`** components) both for Redux and Firebase. It should now look like this:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./containers/App";

import rootReducer from "./store/reducers/index";
import { createStore } from "redux";
import { Provider } from "react-redux";

const store = createStore(rootReducer);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
```

In the above snippet, we basically pass the **root reducer** to the `createStore` method in order to create our **store**. After that, we pass it as a **prop** to the `Provider` component, which is going to wrap the `App` component and make our React app aware of the store. 

## App component

Now we should be able to use redux inside our app. Inside `src/containers/App.js` import some Redux hooks to make sure that everything is running smoothly. It should look like this:

```javascript
import logo from "../logo.svg";
import "./App.css";

// Import these two hooks from Redux
import { useDispatch, useSelector } from "react-redux";

function App() {
  
    // Create a dispatcher
	const dispatch = useDispatch();

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
```

At this point, running `npm start` to start the development server - if you haven't already -should not produce any error. Next, we are going to install `redux-devtools` in order to be able to access and debug our state client-side.

## Installing Redux devtools

You can basically follow the official [instructions](https://github.com/zalmoxisus/redux-devtools-extension#usage), but we'll cover it here, since it's fairly quick. Run:

```shell
npm install --save-dev redux-devtools
```

Then add this argument to the `createStore` method inside `src/index.js`:

`window.REDUX_DEVTOOLS_EXTENSION && window.REDUX_DEVTOOLS_EXTENSION()`

It should now look like this:

```javascript
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(...middlewares)) // Add this
);
```

Finally install the [chrome extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) from the chrome web store. If you are not using chrome or encounter any other issue, please visit the official [extension page](http://extension.remotedev.io/).

Close and re-open chrome devtools and refresh the page. You should be able to see a tab named **Redux**. This is where redux devtools live.

***NOTE:*** Later on, we are going to change the way we initialize devtools, because we are going to use store **enhancers** and **middleware.**

# Creating FeatureTitle component

Now that we've set up Redux we are ready to create our first component! We will begin by **designing a generic Input component**, then move on to **crafting its state** and finally add **Firebase persistence**. By taking a look at our [component diagram](https://blog.manos-liakos.dev/media/voting-app-components.png) from the previous part, we can clearly see that `FeatureTitle`and `UserName`are simple `input` components with their functionality doubling as **data input** and **data display**. A generic `Input`component is going to be used to facilitate the creation of `FeatureTitle`and **`UserName`** components.

## Designing a generic Input component

Inside `src/component` create a folder named `Input` and add a file named `index.js`. Then paste the following code:

```javascript
import React from "react";
import PropTypes from "prop-types";

const Input = props => {
	const label = props.label ? (
		<label
			htmlFor={props.name}
			className="block text-sm font-medium text-gray-700"
		>
			{props.label}
		</label>
	) : null;

	return (
		<React.Fragment>
			{label}
			<input
				type="text"
				name={props.name}
				className={props.className}
				placeholder={props.placeholder}
				onChange={props.handleChange}
				value={props.value}
				disabled={props.disabled}
			/>
		</React.Fragment>
	);
};

// Not required, but highly recommended
Input.propTypes = {
	label: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	value: PropTypes.string.isRequired,
	disabled: PropTypes.bool.isRequired
};

export default Input;
```

We created a generic, fairly flexible `Input`component with dynamic styling, placeholder, etc., to use throughout our app as we see fit.

***NOTE:*** Using `propTypes` is not necessary, but is highly recommended, especially when not using any other form of type-checking, such as Typescript. Type-checking can help **catch bugs**, as well as **document our code**. In this project, we are going to use them, so if you are not going to omit them run `npm i prop-types` to install the relevant package.

## Designing FeatureTitle component

Go ahead and create a folder named `FeatureTitle`in `src/components`. Add a file named `index.js` and paste the component code:

```javascript
import Input from "../Input";

import { useDispatch, useSelector } from "react-redux";
import setTitle from "../../store/actions/feature/setTitle";

const FeatureTitle = () => {
	const title = useSelector(state => state.feature.title);
	const dispatch = useDispatch();

	const handleTitleChange = event => {
		dispatch(setTitle(event.target.value));
	};

	return (
		<div className="mt-10">
			<Input
				className="items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				handleChange={handleTitleChange}

                // Display loading message while title has a value of null
				value={title === null ? "Loading title..." : title}
				placeholder="Feature title"
				disabled={title === null ? true : false}
				label="Feature Title"
				name="title"
			/>
		</div>
	);
};

export default FeatureTitle;
```

I hope that the code is mostly self-explaining. We basically grab the current title from the central store using `useSelector` hook (like `useState`, but for Redux) and assign **`value`** and `disabled`props based on its value. We also create a dispatcher to handle the "onChange" event, by dispatching the **`SET_TITLE`** action along with its payload (the new value).

## Crafting the state

### Constants

Constants help reduce typos and keep our code more organized. You can read more about constants [here](https://redux.js.org/faq/actions#why-should-type-be-a-string-or-at-least-serializable-why-should-my-action-types-be-constants). Inside `src/store/constants` create a file named `feature.js` and type the following code:

```javascript
export const SET_TITLE = "SET_TITLE";
```

Here we are simply exporting a constant named `SET_TITLE` which is going to be used as an action name to change our component's title.

### Actions

Inside `src/store/actions` create a folder named `feature`. Any action associated with the `FeatureTitle`component will be placed in there. Add a file named `setTitle.js` and paste the following code:

```javascript
import { SET_TITLE } from "../../constants/feature";

const setTitle = payload => dispatch => {
	dispatch({
		type: SET_TITLE,
		payload
	});
};

export default setTitle;
```

This action is solely responsible for setting the `FeatureTitle` value in our Redux store.

### Reducer

Inside the `feature.js` file we created earlier in `src/store/reducers`, paste the following code:

```javascript
import * as actionTypes from "../constants/feature";

// The initial state object
const initState = {
	title: null
};

const featureReducer = (state = initState, action) => {
	switch (action.type) {
		case actionTypes.SET_TITLE: {
          
            // Return new state object
			return {
				title: action.payload
			};
		}

		default:
			return state;
	}
};

export default featureReducer;
```

As you can see, the reducer is just a function which receives the current **`state`** and the **`action`** to be performed as arguments and calculates the new state derived from that action.

# Adding Firebase persistence

The final step for a working component is adding persistence to our database. To accomplish this, we first need to wrap our app with the Firebase Provider component. 

### Connect Firebase with application

Head over to `src/index.js` and add the following imports:

```javascript
import thunk from "redux-thunk";

// Get internal Firebase instance with methods which are wrapped with action dispatches.
import { getFirebase } from "react-redux-firebase";

// React Context provider for Firebase instance
import { ReactReduxFirebaseProvider } from "react-redux-firebase";

// Firebase configuration
import config from "./config/firebase";

// Firebase SDK library
import firebase from "firebase/app";
```

Also, modify the redux imports to include `applyMiddleware` and `compose` methods:

```javascript
import { applyMiddleware, createStore, compose } from "redux";
```

We also need to change the way we initialize devtools:

```javascript
// Use devtools compose method if defined, else use the imported one from Redux
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// This will make getFirebase method available to our thunks
const middlewares = [thunk.withExtraArgument(getFirebase)];
```

and refactor the store to include the new middleware:

```javascript
const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(...middlewares))
);
```

Then, wrap the `App` component with **`ReactReduxFirebaseProvider`** like this:

```javascript
ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ReactReduxFirebaseProvider
				firebase={firebase} // Firebase library
				config={config} // react-redux-firebase config
				dispatch={store.dispatch} // Redux's dispatch function
			>
				<App />
			</ReactReduxFirebaseProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
```

The end result should be this:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./containers/App";

// Redux imports
import rootReducer from "./store/reducers/index";
import { applyMiddleware, createStore, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

// Firebase imports
import { getFirebase } from "react-redux-firebase";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import config from "./config/firebase";
import firebase from "firebase/app";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middlewares = [thunk.withExtraArgument(getFirebase)];

const store = createStore(
	rootReducer,
	composeEnhancers(applyMiddleware(...middlewares))
);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ReactReduxFirebaseProvider
				firebase={firebase}
				config={config}
				dispatch={store.dispatch}
			>
				<App />
			</ReactReduxFirebaseProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
```

In case you face any issues, the official documentation for **react-redux-firebase** is [here](https://react-redux-firebase.com/).

### **Some tips:**

#### Middleware vs Store Enhancers

In short:

> Middleware adds extra functionality to the Redux `dispatch` function; enhancers add extra functionality to the Redux store.

You can read more about extending Redux functionality [here](https://redux.js.org/recipes/configuring-your-store#extending-redux-functionality).

#### Compose method

The `compose` method is a utility function often seen in functional programming. As stated [here](https://redux.js.org/api/compose):

> You might want to use it to apply several [store enhancers](https://redux.js.org/understanding/thinking-in-redux/glossary#store-enhancer) in a row.

#### ApplyMiddleware method

The [official description](https://redux.js.org/api/applymiddleware) of the `applyMiddleware` method:

> Middleware is the suggested way to extend Redux with custom functionality. Middleware lets you wrap the store's [`dispatch`](https://redux.js.org/api/store#dispatchaction) method for fun and profit. The key feature of middleware is that it is composable. Multiple middleware can be combined together, where each middleware requires no knowledge of what comes before or after it in the chain.

It applies the given **middleware** and returns a **store enhancer**.

#### Redux Thunk

Redux Thunk is a middleware which allows us to **create actions that return a function instead of an action object.** This function, when called, returns the action object instead which in turn gets passed as an argument to the dispatcher.

### Connect Firebase with component

Now that we integrated Firebase with Redux and connected everything to our App component, we can manipulate data saved in Firebase from anywhere, through our Redux store! 

#### Debounce function

First create a file named `debounce.js` inside `src/utils` and paste the following code:

```javascript
export default function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		}, wait);
		if (immediate && !timeout) func.apply(context, args);
	};
}
```

This is going to be used on inputs and buttons, to prevent aspiring spammers from flooding our database with requests 😏.

#### Push updates to Firebase

Inside `src/firebase` create a folder named `feature`. This folder is going to contain all **Feature** related firebase functionality/services. Add a file named `updateTitle.js` and paste the following code:

```javascript
import debounce from "../../utils/debounce";
import { SET_TITLE } from "../../store/constants/feature";

const updateTitle = ({ ref, payload, oldState, firebase, dispatch }) => {
	firebase
		.ref(ref) // Find reference to update
		.set(payload) // Set new value
		.then(error => {
			// Revert to old state in case of error
			if (error) {
				dispatch({
					type: SET_TITLE,
					payload: oldState
				});

				alert("There was an error performing the request.");
			}
		});
};

export default debounce(updateTitle, 500);
```

This function is going to be used to update the **`FeatureTitle`** value in the firebase database. You can check the official Firebase Javascript SDK docs [here](https://firebase.google.com/docs/reference/js/firebase.database).

#### Receive updates from Firebase

Add another action named `setupFirebaseListeners.js` in `src/store/actions/feature` and paste the following code:

```javascript
import { SET_TITLE } from "../../constants/feature";

const setupFeatureListeners = () => (dispatch, getState, getFirebase) => {
	const firebase = getFirebase();
  
    // Get feature firebase reference
	const featureRef = firebase.database().ref("feature");

	/* Title loading and updates handling */
	featureRef.on("value", snapshot => {
		dispatch({
			type: SET_TITLE,
			payload: snapshot.val().title // New value
		});
	});
};

export default setupFeatureListeners;
```

This action, once dispatched, will register an event handler for every change in `FeatureTitle` value update. This event handler will essentially dispatch the `SET_TITLE` action, in order to update the application state. It will be executed on initial application load, as well as every time the title value changes (by another client, because changes made from us are immediately reflected in the UI for performance reasons, as stated below). 

**This sums up the two-way binding between our Redux state and Firebase, providing the app with real-time updates.**

Head over to `src/store/actions/feature/setTitle.js` action file and modify it to push updates to Firebase:

```javascript
import { SET_TITLE } from "../../constants/feature";

// This will handle logic relevant ONLY to firebase update, not Redux state
import firebaseUpdateTitle from "../../../firebase/feature/updateTitle";

const setTitle = payload => (dispatch, getState, getFirebase) => {
	const firebase = getFirebase();
	const state = getState();

    // Getting old title
	const {
		feature: { title: oldState }
	} = state;

	const config = {
		ref: "feature/title", // Path in firebase to update
		payload, // Payload value
		oldState, // Old state object
		firebase, // Firebase instance
		dispatch // Redux dispatch function
	};

    // Update state and firebase independently
  
	firebaseUpdateTitle(config);

	// Dispatch asynchronously to maintain a responsive UI
	dispatch({
		type: SET_TITLE,
		payload
	});
};

export default setTitle;
```

***NOTE:*** The key thing to notice here is that we are calling the Firebase middleware function **independently of Redux state update (dispatch).** This effectively **decouples the UI state from the Firebase state.** This is important, because if we updated the state after the Firebase promise resolution (either success or failure) then **the UI would be unresponsive and laggy.** **This way, we immediately update the application state, assuming changes were successful and revert to the old one, in case something goes wrong. That's why we pass `oldState` to `firebaseUpdateTitle`.**

Finally, inside **`App`** component import `FeatureTitle`, initialize main layout and register **Feature** event handlers. Replace the code inside `src/containers/App.js` with the following:

```javascript
import "./App.css";

import FeatureTitle from "../components/FeatureTitle";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import setupFeatureListeners from "../store/actions/feature/setupFirebaseListeners";

function App() {
	const dispatch = useDispatch();

	// Setting up feature listeners
	useEffect(() => {
		dispatch(setupFeatureListeners());
	}, []);

	return (
		<main className="max-w-7xl mx-auto my-5 px-4 sm:px-6 lg:px-8">
			<div className="flex flex-col flex-wrap max-w-3xl mx-auto mt-10">
				<div className="flex justify-center">
					<FeatureTitle />
				</div>
			</div>
		</main>
	);
}

export default App;
```

Go to `localhost:3000` and you should be able see our component in the center of the page. Open a second tab/browser and try changing the input value. Changes should be synchronized between tabs/windows after the specified `debounce` timeout (500 ms in this case).

![FeatureTitle component centered in page](/media/featuretitle.png "FeatureTitle component")

- - -

That's it for this part, hope it wasn't tedious. Let me know if you found it interesting.

Any other feedback is also appreciated! Stay tuned for part 3 😎