---
title: Quick tips on writing better React code
cover: ../../static/media/react-tips_cover.webp
date: 2021-02-27T22:00:00.000Z
description: In this short post I am sharing some best practices that I've
  learned, during my journey writing React applications.
tags:
  - post
  - javascript
  - react
---

In this short post I am sharing some best practices that I've learned, during my journey writing React applications.

---

## Common module

Buttons, inputs, cards are some examples of components that are used all over our application. Unless we want everyone to create his own `Button`, we should create a `common` module to accommodate those components. This way we abide to the DRY principle, as well as ensure consistency across our application.

<br/>

## Abstract functionality

We should keep our components clean and succinct, by extracting complex functionality into new functions. For example, if we are fetching data from a Firebase instance, we should create a separate `firebase` folder and put all of our logic in there, instead of polluting our components with fetching hooks and whatnot. Also, whenever we find ourselves using a certain method more than 2-3 times, we should probably outsource it in a function itself. I usually like to create a `helper` or `utilities` folder for this kind of thing.

<br/>

## Folders for components

When multiple files are associated with our components, we should probably group them in folders for better project navigation. Also, in order to avoid having repetitive `import` statements, we could use an `index.js` file to export our component. This way, we can ommit the filename, assuming webpack is configured to import from `index.js` by default.

For example, if we choose to use CSS modules for component styling and maybe like to have our tests close to the tested component, we should structure our components like this:

```
├──Dashboard
   ├──TopMenu
      ├──index.js
      ├──TopMenu.module.css
      ├──TopMenu.jsx
      ├──TopMenu.test.js
   ├──Viewport
      ├──index.js
      ├── Viewport.jsx
      ├──Viewport.module.css
      ├── Viewport.test.js
   ├──BottomMenu
      ├──index.js
      ├──BottomMenu.jsx
      ├──BottomMenu.module.css
      ├──BottomMenu.test.js
```

<br/>

## Solid project structure

I like to think of my project structure in terms of business logic/functionality, not technical details. Each part of our application should reflect its "business responsibilities". A module-based approach is a resilient architecture that's going to allow us to confidently add functionality as our application grows.

```
├──modules
   ├──Dashboard
      ...
   ├──Users
      ...
   ├──Analytics
      ...
   ├──Inventory
      ...
```

<br/>

## Props destructuring

There is no need to constantly refer to `props` inside our functional components. We can use ES6 destructuring feature to avoid this, as follows:

```js
const User = ({ name, lastname }) => {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Lastname: {lastname}</p>
    </div>
  );
};

export default User;
```

<br/>

## Named components

Naming our components is something that's going to be helpful when debugging using the error stack trace. It's the same as with anonymous arrow functions: While they are great for readability, they appear less helpful when debugging.

---

That's it, I hope you found it useful!
