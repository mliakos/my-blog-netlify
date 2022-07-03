---
title: Cleaner imports with aliases in React & TypeScript
date: 2022-07-03T12:21:55.282Z
---
## The problem with relative imports

As a project's been growing, you might've found yourself making imports like this:

```javascript
import { someUtil } from '../../../../src/utils';
import defaultExport, { SomeModule } from '../../../src/modules/dummy-module';
```

This can quickly get out of hand, resulting in many chaotic imports from some deeply nested folders. This would get a lot cleaner, if we could do something like this: 

```javascript
import { someUtil } from '@/utils';
import defaultExport, { SomeModule } from '@dummy-module';
```

We essentially mapped `@` to `src` folder and `@dummy-module` to `src/modules/dummy-module` folder which allowed us to reference them directly using their alias.

## Configuring aliased imports

### TypeScript configuration

In order for TypeScript to become aware of our alias paths, we must define them inside our `tsconfig.json` file, under `compilerOptions`:

```javascript
// tsconfig.json

{
  "compilerOptions": {
    "baseUrl": ".",
    ...,
    "paths": {
      "@/*": ["src/*"], // 👈 This line allows us to import from folders inside "src" folder using "@"
      "@dummy-module": ["src/modules/dummy-module"], // 👈 This line allows us to import from the "dummy-module" folder itself using "@dummy-module"
      "@dummy-module/*": ["src/modules/dummy-module/*"] // 👈 This line allows us to import from folders inside "src/modules/dummy-module" folder using "@dummy-module"
    }
  },
    ...
}
```

We are now able to import using the above aliases. In case TypeScript still complains about your imports, then create a separate `tsconfig.paths.json` file next to `tsconfig.json` (inside root directory), to extend your base config from:

```javascript
// tsconfig.paths.json

{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"], // 👈 This line allows us to import from folders inside "src" folder using "@"
      "@dummy-module": ["src/modules/dummy-module"], // 👈 This line allows us to import from the "dummy-module" folder itself using "@dummy-module"
      "@dummy-module/*": ["src/modules/dummy-module/*"] // 👈 This line allows us to import from folders inside "src/modules/dummy-module" folder using "@dummy-module"
    }
  }
}
```

and modify `tsconfig.json` like this:

```javascript
// tsconfig.json

{
  "compilerOptions": {
    "baseUrl": ".",
    ... 👈 Remove "paths" option
  },

  "extends": "./tsconfig.paths.json" // 👈 Add this line
}
```

### Webpack configuration

In a react app, you've most likely used `create-react-app` as a scaffold. So you need to override its internal webpack configuration, in order to let the bundler know how to resolve your aliases during build time. To do that without [ejecting](https://create-react-app.dev/docs/available-scripts/#npm-run-eject), you can use [craco](https://www.npmjs.com/package/@craco/craco):

```shell
npm i @craco/craco
```

or

```shell
yarn add @craco/craco
```

Next, create a **`craco.config.js`** file at your project’s root and paste this code:

```javascript
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@dummy-module': path.resolve(__dirname, 'src/modules/dummy-module'),

    },
  },
};
```

Finally, replace `react-scripts` with `craco` inside `package.json` file:

```javascript
"scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "craco eject"
 }
```

and restart your app:


```shell
yarn start
```

And that's all folks 🥳