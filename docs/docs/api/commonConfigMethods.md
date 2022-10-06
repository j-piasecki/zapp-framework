### `merge(other: Config)`

Copies all set properties from provided config into this one.

### `fillSize()`

`added in @zapp-framework/core@0.1.0`

Makes the view fill all available width and height.

### `fillWidth(portion = 1)`

`added in @zapp-framework/core@0.1.0`

Makes the view fill a portion of the available width. If no argument is passed, the view will fill all available width. The portion needs to be in the [0-1] range.

:::caution
Keep in mind that this will ignore the size of the siblings, i.e. setting `fillWidth(1)` on two views will result in both of them filling the full width and possibly overflowing parent.
:::

### `fillHeight(portion = 1)`

`added in @zapp-framework/core@0.1.0`

Makes the view fill a portion of the available height. If no argument is passed, the view will fill all available height. The portion needs to be in the [0-1] range.

:::caution
Keep in mind that this will ignore the size of the siblings, i.e. setting `fillHeight(1)` on two views will result in both of them filling the full height and possibly overflowing parent.
:::

### `width(value: number)`

`added in @zapp-framework/core@0.1.0`

Sets the view width, the value is needs to be in pixels.

### `height(value: number)`

`added in @zapp-framework/core@0.1.0`

Sets the view height, the value is needs to be in pixels.

### `weight(value: number)`

`added in @zapp-framework/core@0.1.0`

Sets the view weight. Depending on the parent layout it will set the view width (if inside [`Row`](./layout/row.md)) or height (if inside [`Column`](./layout/column.md)) to fill `value` / `total weights` of the available space.

### `offset(x: number, y: number)`

`added in @zapp-framework/core@0.1.0`

A vector by which the view will be moved after being layouted. Keep in mind that this doesn't impact layout, just the final position of the view.

### `positionAbsolutely(value: boolean)`

`added in @zapp-framework/core@0.1.0`

If the value is `true` the view will be positioned at point `(0,0)`.Keep in mind that this doesn't impact layout, just the final position of the view.

### `onPointerDown(callback: (event: PointerData) => void)`

`added in @zapp-framework/core@0.1.0`

Sets the listener for pointer down event, which will execute the provided callback.

### `onPointerMove(callback: (event: PointerData) => void)`

`added in @zapp-framework/core@0.1.0`

Sets the listener for pointer move event, which will execute the provided callback.

### `onPointerUp(callback: (event: PointerData) => void)`

`added in @zapp-framework/core@0.1.0`

Sets the listener for pointer up event, which will execute the provided callback.

### `onPointerEnter(callback: (event: PointerData) => void)`

`added in @zapp-framework/core@0.1.0`

Sets the listener for pointer enter event, which will execute the provided callback.

### `onPointerLeave(callback: (event: PointerData) => void)`

`added in @zapp-framework/core@0.1.0`

Sets the listener for pointer leave event, which will execute the provided callback.

## `PointerData`

`added in @zapp-framework/core@0.1.0`

### `target: string`

`added in @zapp-framework/core@0.1.0`

The `id` of the view that was the target of this event.

### `id: number`

`added in @zapp-framework/core@0.1.0`

The identifier of this pointer.

### `x: number`

`added in @zapp-framework/core@0.1.0`

The absolute x coordinate of this event.

### `y: number`

`added in @zapp-framework/core@0.1.0`

The absolute y coordinate of this event.

### `timestamp: number`

`added in @zapp-framework/core@0.1.0`

The timestamp at which this event occurred.

### `type: PointerEventType`

`added in @zapp-framework/core@0.1.0`

The type of this event. Possible values are: `PointerEventType.DOWN`, `PointerEventType.MOVE`, `PointerEventType.UP`, `PointerEventType.ENTER`, `PointerEventType.LEAVE`.

### `capture: () => void`

`added in @zapp-framework/core@0.1.0`

Calling this method makes the current target 'capture' this specific pointer, meaning all further events of this pointer will be retargeted to it.
