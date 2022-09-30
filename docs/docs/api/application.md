---
id: application
title: Application
sidebar_label: Application
slug: /api/application
---

## `Application(config: ApplicationConfig)`
`added in @zapp-framework/core@0.1.0`

`Application` function is the entry point of the application. It sets up lifecycle bindings to correctly handle starting and exiting the app.

### `ApplicationConfig`
`added in @zapp-framework/core@0.1.0`

A type with the lifecycle methods you can use to run your code at certain points in the lifecycle.

#### `onInit()`
`added in @zapp-framework/core@0.1.0`

Called when the application is being initialized.

#### `onDestroy()`
`added in @zapp-framework/core@0.1.0`

Called when the application is being destroyed.

### Example

```js title=app.js
import "@zapp-framework/watch";
import { Application } from "@zapp-framework/core";
import { setTheme } from "@zapp-framework/ui";

Application({
  onInit() {
    setTheme();
  },
  onDestroy() {},
});
```