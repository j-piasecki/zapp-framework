---
id: color
title: Color
sidebar_label: Color
slug: /api/color
---

# Color
`added in @zapp-framework/core@0.1.0`

A helper class for working with colors.

### `rgb(r: number, g: number, b: number): number`
`added in @zapp-framework/core@0.1.0`

Accepts RGB values in [0-255] range and returns the hexadecimal color value.

### `hsl(h: number, s: number, l: number): number`
`added in @zapp-framework/core@0.1.0`

Accepts HSL values (H in [0-360] range, S and L in [0-1] range) and returns the hexadecimal color value.

### `toRGB(color: number): [red: number, green: number, blue: number]`
`added in @zapp-framework/core@0.1.0`

Accepts hexadecimal color value and returns RGB components in [0-255] range.

### `isDark(color: number): boolean`
`added in @zapp-framework/core@0.1.0`

Returns `true` if the provided color should be considered as dark, and `false` if it should be considered as light.

### `tint(color: number, factor: number): number`
`added in @zapp-framework/core@0.1.0`

Returns the provided color tinded by the provided factor.

### `shade(color: number, factor: number): number`
`added in @zapp-framework/core@0.1.0`

Returns the provided color shaded by the provided factor.

### `accent(color: number, factor: number): number`
`added in @zapp-framework/core@0.1.0`

If the provided color is dark, returns it tinted by the provided factor. Otherwise, returns it shaded by the provided factor.