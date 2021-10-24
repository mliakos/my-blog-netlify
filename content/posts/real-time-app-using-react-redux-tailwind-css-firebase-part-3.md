---
title: Real-time app using React, Redux, Tailwind CSS & Firebase - Part 3
cover: /media/react-redux-firebase.png
date: 2021-10-24T11:23:08.159Z
description: "In this part we are going to "
slug: real-time-scrum-voting-app-part-3
tags:
  - javascript
  - react
  - redux
draft: true
hide: true
---
Previously in [part 2](https://blog.manos-liakos.dev/real-time-scrum-voting-app-part-2), we did all the hard work of setting up **Redux** & **Firebase**, plus creating and connecting our **first component.** In this part, ...

- - -

# Adding user functionality

User functionality lies in two parts, as per the requirements laid out in the [first part](https://blog.manos-liakos.dev/real-time-scrum-voting-app-part-1):

* *Each client gets assigned a **default random username** when first visiting the app which he can also refresh.*
* Any participant can **edit his/her username**, as well as the **feature-to-be-implemented title**

## **Heading component**

### Setting up

The `Heading` component is going to contain the application title, as well as the `UserName` component. Inside the `components` folder create a `Heading` folder and add two more things:

* A `UserName` folder, which is going to hold the relevant component.
* A `Heading.js` file.

### Creating UserName component

Under `components/Heading/UserName` create an `index.js` file and add the following code:

```javascript
// Generic Input component we also used for FeatureTitle
import Input from "../../Input/Input"; 
import { useDispatch, useSelector } from "react-redux";
// Redux action/thunk to update user
import updateUser from "../../../store/actions/users/updateUser";

// Simple utility to retrieve and parse values from local storage
import getLocalStorage from "../../../utils/getLocalStorage";

const UserName = () => {
	const dispatch = useDispatch();
	const state = useSelector(state => state.users);

	const currentUserId = getLocalStorage("userId");

    // Retrieve current user using saved id from local storage
	const user = state.users.find(user => Object.keys(user)[0] === currentUserId);

	const handleUserUpdate = event => {
        // Action payload (updated user object)
		const updatedUser = {
			id: currentUserId,
			data: {
				...user[currentUserId],
				username: event.target.value
			}
		};

		dispatch(updateUser(updatedUser));
	};

	return (
		<Input
			label="Username"
			placeholder="Type a username..."
			handleChange={event => handleUserUpdate(event)}
            // While loading display a loading message, else display current user
			value={user ? user[currentUserId].username : "Loading username..."}
			name="username"
			className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			// Disable editing while loading
            disabled={user ? false : true}
		/>
	);
};

export default UserName;
```

I have placed some comments to make things easier to grasp. We basically add an `Input` component, which will a have a dual role: Displaying our current username and changing it.