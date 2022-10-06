---
id: config
title: Config
sidebar_label: Config
slug: /api/config
---

import CommonConfigMethods from './commonConfigMethods.md'

## `Config(id: string)`

`added in @zapp-framework/core@0.1.0`

Returns a base config builder with specified id. Zapp uses the config ids to track views between updates.

## `BaseConfigBuilder`

`added in @zapp-framework/core@0.1.1`

Returned by the `Config` method.

:::info
If you're making a custom component and you need to create a custom config for it, consider extending the `ConfigBuilder` class, which provides only the core functionality (`id`, `build()` and `merge()`) so there are no unused methods exported.
:::

<CommonConfigMethods />
