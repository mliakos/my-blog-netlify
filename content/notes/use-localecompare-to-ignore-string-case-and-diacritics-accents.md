---
title: Use localeCompare to ignore string case and diacritics (accents)
date: 2021-04-28T16:09:24.468Z
slug: locale-compare
tags:
  - note
  - javascript
---
It's a very common scenario when you have to compare strings ignoring their case. The usual approach is to convert both of them to upper or lower case:

```javascript
const a = 'JavaScript';
const b = 'JAVASCRIPT';

console.log(
  a.toLowerCase() === a.toLowerCase()
); // true
```

But what about when comparing accented strings like Café, Jalapeño or résumé ? Here's where the `localeCompare `method comes in handy. From [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare):

> The **`localeCompare()`** method returns a number indicating whether a reference string comes before, or after, or is the same as the given string in sort order.

A number `0` means that strings match.

```javascript
const a = 'Café';
const b = 'cafe';

console.log(
  a.localeCompare(b, 'en', { sensitivity: 'base' })
); // 0 (strings match)
```

The second argument is the locale and indicates the language, whose formatting conventions should be used. You can omit it by providing a value of `undefined`.