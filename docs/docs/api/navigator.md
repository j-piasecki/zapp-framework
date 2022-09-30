---
id: navigator
title: Navigator
sidebar_label: Navigator
slug: /api/navigator
---

# Navigator

Navigator is used to switch pages in the application.

### `navigate(route: string, params?: Record<string, unknown>)`
`added in @zapp-framework/core@0.1.0`

Pushes the current page onto the navigation stack and changes current page to the specified route and passes the params to it if given.

### `goBack()`
`added in @zapp-framework/core@0.1.0`

Pops the navigation stack and changes the current page to the popped one.

### `goHome()`
`added in @zapp-framework/core@0.1.0`

Exits the application and navigates to the home screen.

### `finishWithResult(params: Record<string, unknown>)`
`added in @zapp-framework/core@0.1.0`

Pops the navigation stack and changes the current page to the popped one. If the current page was started using [`rememberLauncherForResult`](./effect/rememberLauncherForResult.md), the callback provided to it is run with the provided params.