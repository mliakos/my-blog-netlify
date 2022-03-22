---
title: How to handle boolean values in SQLite using JavaScript Proxies
date: 2022-03-22T18:43:17.125Z
description: If you've ever worked with SQLite, you should be aware of the
  supported data types and Boolean isn't one of them.
slug: sqlite3-booleans
tags:
  - sqlite
  - javascript
---
## The problem with Booleans in SQLite

If you've ever worked with SQLite, you should be aware of the supported data types and `Boolean` isn't one of them. More specifically as stated [here](https://www.sqlite.org/datatype3.html):

> ## 2.1. Boolean Datatype
>
> SQLite does not have a separate Boolean storage class. Instead, Boolean values are stored as integers 0 (false) and 1 (true).
>
> SQLite recognizes the keywords "TRUE" and "FALSE", as of version 3.23.0 (2018-04-02) but those keywords are really just alternative spellings for the integer literals 1 and 0 respectively.

Most JavaScript libraries for SQLite3 don't support \`TRUE\` and \`FALSE\` keywords and they require you to prepare the statements in your code using integers. For example, in [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) you would have to do this:

```javascript
const payload = {
  isActive: 1, // <======
  username: 'Brad',
  password: '1234',
  email: 'brad@gmail.com',
};

const result = database
  .prepare(
    `INSERT INTO accounts(isActive, username, password, email) VALUES(@isActive, @username, @password, @email) `
  )
  .run({ bucketID, taskSiteID, name, username, password, email }).changes;
```

Using \`number\` instead of \`boolean\` across your entire app would make for a terrible developer experience (plus probably use more memory).

You could use a helper function to transform your payload objects' **boolean** properties to **numbers** (I had actually done this once, in the past), but then you'd have to manually run it before every query. Yikes. Wouldn't it be great if this logic was executed in the background, every time we prepared and ran a statement?

## Welcome ES6 Proxies 👋 

One of the newer JavaScript features is the \`Proxy\` object. **Proxies** are essentially "traps" that intercept object operations like getters, setters and function calls. Using **Proxies** we can modify the SQLite JS wrapper library to execute our own logic, kind of like a middleware.

### Writing the helper function

For ease of development, we are going to use \`mapValues\` & \`isPlainObject\` utility functions from [lodash](https://lodash.com) , but you can of course code your own. The function below will map through an object (one-level deep) and convert values of type \`boolean\` to type \`number\`.

```javascript
import { mapValues } from 'lodash';

const booleanEntriesToNumbers = (object) =>
  mapValues(object, (value) =>
    typeof value === 'boolean' ? Number(value) : value
  );
```

### Using proxies to intercept query calls

Below we import \`better-sqlite3\` library and create a new database instance. Afterwards, we override the default \`prepare\` method with our own, which in turn overrides the methods \`run\`, \`get\` and \`all\`, by creating a new proxy for each one. You can of course create a proxy for any other method you want. 

```javascript
import Database from 'better-sqlite3';

// Create new database instance
const db = new Database(dbFilePath);

// We will use this function to override the default "prepare" method
const proxiedPrepare = new Proxy(db.prepare, {
    apply: (prepare, prepareThisArg, [stringStatement]) => {
      const statement = prepare.call(prepareThisArg, stringStatement);

      // Override the default "run" method
      statement.run = new Proxy(statement.run, {
        apply: (run, runThisArg, args) => {
          const mappedArgs = args.map((arg) =>
            isPlainObject(arg) ? booleanEntriesToNumbers(arg) : arg
          );

          return run.call(runThisArg, ...mappedArgs);
        },
      });

      // Override the default "get" method
      statement.get = new Proxy(statement.get, {
        apply: (get, getThisArg, args) => {
          const mappedArgs = args.map((arg) =>
            isPlainObject(arg) ? booleanEntriesToNumbers(arg) : arg
          );

          return get.call(getThisArg, ...mappedArgs);
        },
      });

      // Override the default "all" method
      statement.all = new Proxy(statement.all, {
        apply: (all, allThisArg, args) => {
          const mappedArgs = args.map((arg) =>
            isPlainObject(arg) ? booleanEntriesToNumbers(arg) : arg
          );

          return all.call(allThisArg, ...mappedArgs);
        },
      });

      return statement;
    },
  });

// Override the default "prepare" method
db.prepare = proxiedPrepare;
```

Essentially, once a call to the \`prepare\` method is triggered, we tell JavaScript: **Wait! We want to modify this function call. Instead of executing the logic that the original developer intended, we instead want to execute our own logic first (which is the mapping of the object payload).** After executing our own logic, we return the result of calling the original method by using \`call\` to bind the \`this\` argument. If you want to read more about how proxies work, read [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy). For our implementation we used the \`apply\` method [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/apply). 

Thanks for reading this post, I hope it helped someone working with SQLite in JavaScript 👊