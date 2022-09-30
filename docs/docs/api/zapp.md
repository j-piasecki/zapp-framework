---
id: zapp
title: Zapp
sidebar_label: Zapp
slug: /api/zapp
---

# Zapp
`added in @zapp-framework/core@0.1.0`

Zapp is the entry point of the framework. It allows you to start and stop the main loop as well as get important information and store global values.

### `startLoop()`
`added in @zapp-framework/core@0.1.0`

Starts the main Zapp loop and sets up event handling. You only need to call it on web, on watches it's handled internally.

### `stopLoop()`
`added in @zapp-framework/core@0.1.0`

Stops the main Zapp loop. You only need to call it on web, on watches it's handled internally.

### `setValue(key: string, value: unknown)`
`added in @zapp-framework/core@0.1.0`

Sets the value in the global scope, you can read the value associated with the key anywhere in the app.

### `getValue(key: string): unknown`
`added in @zapp-framework/core@0.1.0`

Gets the value associated with the key.

### `platform: Platform`
`added in @zapp-framework/core@0.1.0`

Returns whether the app is running on web or on a watch. Possible values are: `Platform.Web` and `Platform.Watch`.

### `screenShape: ScreenShape`
`added in @zapp-framework/core@0.1.0`

Returns whether the device has a square or a round screen. Possible values are: `ScreenShape.Round` and `ScreenShape.Square`.

### `screenWidth: number`
`added in @zapp-framework/core@0.1.0`

Returns width of the screen.

### `screenHeight: number`
`added in @zapp-framework/core@0.1.0`

Returns height of the screen.