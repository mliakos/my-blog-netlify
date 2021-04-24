---
title: Arrays passed to template literals get coerced to strings
date: 2020-12-04
tags: ['note', 'javascript']
hide: false
---

Nice little thing I learned today: When you pass an `Array` as a value to a template literal, it gets implicitly coerced into a `String`. Behind the scenes `String.prototype.concat` is used, as stated in the [ECMA-262 specification document](https://tc39.es/ecma262/#sec-template-literals-runtime-semantics-evaluation).

```js
const fruits = ['apples', 'oranges'];
console.log(`${fruits}`); // 'apples,oranges'
```
