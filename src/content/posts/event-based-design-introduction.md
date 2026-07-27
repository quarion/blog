---
title: "Event based design, part 1 - Introduction"
description: An introduction to event aggregators, event collections, and event buses in application design.
publishedAt: 2016-03-06
slug: 2016/03/06/event-based-design-introduction
---

## Introduction

This article is first one in the series on incorporating events into an application design.

The backbone of such a system is a communication pipeline (a *bus*) that allows event Subscribers and Publishers to exchange messages.


This kind of communication can be introduced into the application using **Event Aggregator** pattern. *Event Aggregator* is an abstraction for a common source of events, that allows Subscribers and Publishers to use it independently, without knowledge of each other.  

Concrete implementation of this pattern can have many variations, but it can be divided into two categories - *Event Bus* and *Event Collection*


## Event Collection

**Event Collection** is a class, that exposes events relevant for a given part of the system. The class must be implemented as a Singleton (to share state between different parts of the code), and simply exposes the defined events as its public properties. All of the parts of the system, that have access to this class, can easily subscribe to one of the defined events, or publish it, for all of the subscribers to receive.

Example of an *Event Collection* in a *C#* language (full example is available on [Github](https://github.com/quarion/EventAggregator/tree/master/EventCollection))

``` csharp
class EventAggregator
{
    // Events definitions
    internal delegate void OrderFinalizedEvent(object sender, object args);
    internal delegate void OrderCreatedEvent(object sender, object args);

    // Public accesors for events Subscribers
    public event OrderCreatedEvent OrderCreated;
    public event OrderFinalizedEvent OrderFinalized;

    // Public methods for events Publishers
    public void OnOrderFinalized(object args)
    {
        OrderFinalized?.Invoke(this, args);
    }

    public  void OnOrderCreated(object args)
    {
        OrderCreated?.Invoke(this, args);
    }
}
```

While this implementation is very simple, and may be useful in small applications, at the same time it is very limited. Maintaining the list of events as public properties (often with public methods to dispatch them) may be very cumbersome and inflexible. As the number of different events in the system grows, it may be difficult to maintain.



## Event Bus

**Event Bus** is a class, that exposes a generic way for handling events. It can route any event to any Subscriber, without defining them explicitly and up front.

The concrete implementation may vary, especial depending on what a given programming language can offer. It can be simple matching of Messages to Subscribers based on string keys, or strongly typed approach based on generic classes.

Signature of an *Event Bus* in a pseudo code

``` csharp
public class SimpleEventAggregator
{
    public void Subscribe(eventKey, eventHandler);

    public void Publish(eventKey, eventData);
}
```

For a .NET ecosystem, a very good implementation of the *Event Bus* is available as a component of an open source library *Caliburn.Micro* (also available as a separate NuGet package, containing only the *Event Aggregator* code). It uses generics and strongly typed events.

Quick example of publishing an event with *Caliburn.Micro* *EventAggregator* (full example available on [Github](https://github.com/quarion/EventAggregator/tree/master/EventBus))

``` csharp
class Producer
{
    private readonly IEventAggregator _eventAggregator;
    private readonly string _name;

    public Producer(IEventAggregator eventAggregator, string name)
    {
        this._eventAggregator = eventAggregator;

        _name = name;
    }

    public void CreateOrder()
    {
        _eventAggregator.Publish(new OrderCreatedEvent(_name));
    }
}


class OrderCreatedEvent
{
    public string Name { get; }

    public OrderCreatedEvent(string name)
    {
        this.Name = name;
    }
}
```

## Coming next

- Design patterns for events based system
- Managing context

## References

[http://martinfowler.com/eaaDev/EventAggregator.html](http://martinfowler.com/eaaDev/EventAggregator.html)  
[http://caliburnmicro.com/documentation/event-aggregator](http://caliburnmicro.com/documentation/event-aggregator)
