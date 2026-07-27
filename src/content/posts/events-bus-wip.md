---
title: "events-bus-wip"
description: Working notes on ambient dependencies, event-based design, pitfalls, and event sourcing.
publishedAt: 2016-03-06
slug: drafts/events-bus-wip
draft: true
---


### How to supply 'ambient' dependencies
[Material for new post]

Using constructor injection for cross-cutting concerns, are not very efficient [constructor pollution]. If we have the same interface (like ILogger or IEventLocator) injected to most of our classes, then we should look for a better way of supplying those dependencies.

Possible solutions:

- Property Injection
- Ambient Context
- Abstract factory (?)


## Events based design


- Mediators
- Commands
- Events vs messages - semantics
  - Events - are public broadcasts
  - Messages - are addressed by sender to a specific recipients
- Application vs domain events



## Pitfalls

- Indirection through events makes code harder to read. Often it is easier (or even required) to use debugger to find sources of problems


## Events sourcing

Design focused on domain events promises very high extensibility...
