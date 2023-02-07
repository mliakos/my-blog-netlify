---
title: Jest with TypeScript and aliased imports (custom paths)
cover: /media/gd97g4kdyk1bpdeyfqst.png
date: 2023-02-07T19:22:08.695Z
description: How to configure Jest with a TypeScript project, while also using
  custom path mapping.
slug: jest-with-typescript-and-aliased-imports
---
In this post we are going to setup `jest` for a `TypeScript` project with custom aliases (path mapping) support. If you haven't read my previous post about cleaner imports in TypeScript using aliases, you can do that [here](https://blog.manos-liakos.dev/cleaner-imports-with-aliases-in-react-typescript/). It's pretty cool that we can use the same aliases in our tests to keep them nice and clean ✨

We are going to use `yarn` package manager. However, there are no differences with `npm` - other than the commands themselves.

## Install Jest
- Run `yarn add --dev jest`.

## Add TS support
- Add type support: `yarn add --dev @types/jest`
- Install `ts-jest`. It's a custom jest transformer that will help us use Jest with TypeScript.
- Run `yarn jest --init` to initialize a config file. Answer the questions as you wish (ask Yes for TS support).
- Go to your `tsconfig` and `"@types/jest"` inside `types` array:

```js
{
...,
"types": [..., "@types/jest"],
...
}
```

## Add path support

- Make sure you have at least the following config in `jest.config.ts`:

```js
import { pathsToModuleNameMapper, JestConfigWithTsJest } from "ts-jest";
import { compilerOptions } from "./tsconfig.paths.json";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  moduleDirectories: ["node_modules", "<rootDir>"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
 }
 
export default jestConfig;
 ```
 
 Here we import our custom paths defined in `tsconfig.paths.json` (for more info on this read [here](https://blog.manos-liakos.dev/cleaner-imports-with-aliases-in-react-typescript/)):

```js
import { compilerOptions } from "./tsconfig.paths.json";
```
 
 
 ___
 
 The `moduleDirectories` prop did the trick for me. Also make sure to remove comments from both `jest.config` and `tsconfig`, since they sometimes cause parsing errors. Hope this helped someone 😎