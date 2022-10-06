---
id: registernavigationroutes
title: registerNavigationRoutes
sidebar_label: registerNavigationRoutes
slug: /api/web/registernavigationroutes
---

## `registerNavigationRoutes(startingRoute, routes)`

where

- `startingRoute: string` - the route to open when first opening the app
- `routes: Record<string, (params?: Record<string, unknown>) => void>` - mapping between routes and functions responsible for rendering them

Registers all available routes in the web navigator, without calling it the navigation will not work.

### Example

```js
function Home(params) {
  ...
}

function Example(params) {
  ...
}

function Test(params) {
  ...
}

registerNavigationRoutes('home', {
  home: Home,
  example: Example,
  test: Test,
})
```
