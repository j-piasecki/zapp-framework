---
id: introduction
title: Introduction
sidebar_label: Introduction
slug: /
---

# Introduction

Zapp is divided into four packages:

- `core` - As the name suggests, it contains the core functionality of the framework: managing state, layout calculation, updating UI, handling events and animations. It also provides core components for building more complex UIs.
- `ui` - Not suprisingly, it provides basic UI components and cohesive theming system.
- `watch` - Injects Zepp OS bindings into the `core` package and provides watch-specific functionality, like key-value storage and different screen types.
- `web` - Injects web bindings into the `core` package and provides web-specific functionality (mainly with regards to navigation).

## Ok, but how does it work?

The general idea is that executing a function related to the view or effect creates a node in the tree representing the current state of the app. This function, in turn, executes its body in the context of the newly created node, thus maintaining parent-child relation. That tree is then transformed to a new tree containing only the view nodes and layout is calculated using the new tree. Next, the new tree is compared to the old one and the differences between them are resolved - if a node is no longer presend, the corresponding native view is dropped, if a new node appears, the new native view is created, and if the node stays, the existing native view gets updated.

## This sounds like a lot, doesn't it impact performance?

Yes, it does. The heavier the tree (the more nodes it has), the more time those operations take and, since the Zepp OS watches are not really powerful devices, the time required to perform update quickly rises. It's not making apps unusable but it certainly gets noticable. There is a lot of room to improvement so things may get better in the future, but many of the shortcomings may be solved by some original ideas. For example, in the bus stop app the first render took a bit more time than I liked, causing a very noticable lag when hiding activity indicator, so I made only four first departures visible during the first render. The rest gets rendered after that - the lag is still there, but it's divided into two parts, and the second, longer, one happens when the screen is populated so it's almost unnoticable.

## So why should I use it despite the performance hit?

Well, it provides a lot of things that are missing in the native Zepp OS:

- preservation of z-index when creating nodes (displaying them conditionally)
- layout calculation, so you don't have to position evertyhing absolutely
- more advanced navigation - preserving the state of screens when navigating, and mechanism for passing data backwards (similar to `rememberLauncherForActivityResult()` from Compose)
- everything from the `core` and `ui` packages also works on web so you can make use of the development tools when developing the ui
- a very simple API for persistent storage, almost indentical to state
- updating the UI automatically on state change
- animation API (not very useful at the moment due to performance)
- nice-ish, declarative API

Besides, it abstracts away some quirks that affects Zepp OS at the moment, like the need to update all props of a rectangle to move it or change its size, or the fact that touch event are a pain to work with.
