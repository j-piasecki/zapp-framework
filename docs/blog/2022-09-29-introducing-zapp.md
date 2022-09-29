---
slug: introducing-zapp
title: Introducing Zapp
authors: jpiasecki
tags: [zapp]
---

Zapp is a declarative UI framework for Zepp OS platform, which also handles a lot of its quirks under the hood, so you don't have to. Its main features include:
- preservation of z-index when creating nodes (displaying them conditionally)
- layout calculation, so you don't have to position evertyhing absolutely
- more advanced navigation - preserving the state of screens when navigating, and mechanism for passing data backwards (similar to `rememberLauncherForActivityResult()` from Compose)
- everything from the `core` and `ui` packages also works on web so you can make use of the development tools when developing the ui
- a very simple API for persistent storage, almost indentical to state
- updating the UI automatically on state change