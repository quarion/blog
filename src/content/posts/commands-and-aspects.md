---
title: Commands and Aspects
description: Encapsulating application behavior as commands and applying reusable cross-cutting concerns through decorators.
publishedAt: 2016-05-09
slug: 2016/05/09/commands-and-aspects
historicalDiscussion: true
---

## Building block - the command pattern

Command pattern is a behavioral design pattern. The intent is to encapsulate specific behavior inside an object.

```csharp
public class BookOrderCommand : ICommand
{
   public void Execute()
   {
       /* Logic for creating new order in the system */
   }
}

// call the command somewhere in the application
var bookCommand = new BookOrderCommand();
bookCommand.Execute();
```

Using command classes allows you to divide the application logic into structured, re-usable components with precise responsibilities. It helps with the organization and navigation of the code.

Great example of the benefits to code organization is the *CQRS* (Command Query Responsibility Segregation) architectural pattern.<br>
This powerful pattern started from a simple rule for organizing application code called *command and query separation (CQS)*.

> CQS is a principle, that states that system should be organized into clearly separated elements - commands, that changes the state of the system, but do not return any data, and queries, that return current state, but don’t have any side effects.

### Benefits of using command objects

In addition to the organizational benefits, encapsulating the application logic inside command objects allows us to use additional, powerful techniques.

- Polymorphic behavior - Separate the behavior interface from the specific implementation.

  As an example, imagine that you have an UI component with a text box and a “submit” button. This component knows how to handle Submit command with a following signature:

  `public void Submit(string text)`

  In your application you can have many such controls, each assigned to a different command (eg. “send e-mail command” or “change user name command”), and some of the commands can even be assigned dynamically at the run time.

  Polymorphism is the most important property of the object-oriented languages.

- Composition - Allows to compose different command objects inside a “macro” command to create new behaviors.

- Control of indirection - Commands execution can be triggered by events or messages from a queue. Having a clear responsibility of how events and messages can be handled, helps to reason about the logic flow in the system and makes the code maintenance easier.

- Deferred execution - Commands object can be saved “for later use”, together with its properties. Such commands can be queued, or just saved as “templates” for execution at any time in the future.

- *Aspect oriented programming* - Structuring application logic using commands allows us to easily decorate them with different aspects. Aspects handles cross-cutting concerns, like logging or error handling.

### Potential pitfalls

- Anemic models - Using commands brings in the same danger, as concentrating all application logic inside service classes. Our object model become anemic, and we loose many advantages of the object-oriented design.

To alleviate this risk, we should focus our commands in the application and infrastructure layer (see **Onion Architecture**). This way, we can keep our behavior-rich object model inside the domain layer.

## Implementing the pattern

To implement the commands handling in your system, it is useful to create some basic interfaces or abstract classes, that will clearly mark specific class as a command, and allow us to use polymorphism. In C# it is best implemented using generic interfaces.

### Commands and command handlers

There are two different ways that we can implement the command pattern

> Both the input parameters and the execution logic are contained inside a single **Command** class.

Or

> The input parameters and the execution logic are separated into **Command** and **Command Handler** classes.

Separating the *Command* and *Command Handler* have a number of advantages. It makes it easier to create generic, *Dependency Injection* friendly interfaces, or to make the command handlers work with messages from a message bus.

Following code shows our definition of the Command and Command Handler abstractions.

```csharp
public interface ICommandHandler<in TCommand>
{
   void Execute(TCommand request);
}

public interface ICommandHandler<in TCommand, out TResult>
{
   TResult Execute(TCommand request);

   //In CQS canonical command do not return any value. But in practice some commands sometimes returns data.
   //For example "CreateOrder" command may return the ID of the created order
}
```

The example shows only definitions for the *command* side. But following the *CQS* practices, we should define similar structures for the *query* operations.

Using the ICommandHandler interface, we can implement concrete application operations.<br>
Following example shows a command that handles creating a new order in the system.

```csharp
public class BookOrderCommand
{
    public string DeliveryAddres { get; set; }
    public IEnumerable<string> OrderItemIds { get; set; }
}

public class BookOrderCommandHandler : ICommandHandler<BookOrderCommand>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IValidator<BookOrderCommand> _validator;

    public BookOrderCommandHandler(IOrderRepository orderService, IValidator<BookOrderCommand> validator)
    {
        _orderRepository = orderService;
        _validator = validator;
    }

    public void Execute(BookOrderCommand command)
    {
        try
        {
            _validator.Validate(command);

            var order = Order.CreateNew(command.DeliveryAddres, command.OrderItemIds);

            _orderRepository.Add(order);
        }
        catch (Exception e)
        {
            //handle all exceptions, including validation
            Console.WriteLine(e);
        }
    }
}
```

With a command like this, in our application we would expect to call `ICommandHandler<BookOrderCommand>` interface. It may be a callback implemented as public property on some object, or a constructor dependency that will be injected with *IoC container* inside one of our application services.

## Adding *aspects* to your *commands*

As you may have noticed in the Book Order example, the command handler have three responsibilities, of with two are general, and only one is specific for this particular use case.<br>
The responsibilities are:

1.  Validate input data.
2.  Execute business logic using domain model.
3.  Handle all exceptions.

If we would continue to add more functionality to our application, we would spot this as a pattern - there are responsibilities common for the entire system (*cross cutting concerns*) and responsibilities specific for a given command.

To avoid duplicating the code responsible for those cross cutting concerns, we can apply simple refactoring using a decorator pattern.

```csharp
public class ErrorHandlingAspect<TCommand> : ICommandHandler<TCommand>
{
    private readonly ICommandHandler<TCommand> _commandHandler;

    public ErrorHandlingAspect(ICommandHandler<TCommand> commandHandler)
    {
        _commandHandler = commandHandler;
    }

    public void Execute(TCommand request)
    {
        try
        {
            _commandHandler.Execute(request);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
        }
    }
}

class ValidationAspect<TCommand> : ICommandHandler<TCommand>
{
    private readonly ICommandHandler<TCommand> _commandHandler;
    private readonly IValidator<TCommand> _validator;

    public ValidationAspect(ICommandHandler<TCommand> commandHandler, IValidator<TCommand> validator)
    {
        _commandHandler = commandHandler;
        _validator = validator;
    }

    public void Execute(TCommand request)
    {
        _validator.Validate(request);

        _commandHandler.Execute(request);
    }
}
```

Those two decorator classes represents two *aspects* that now can be re-used for all of the commands. Following code shows how to call a decorated command.

```csharp
var _commandHandler = new ErrorHandlingAspect<BookOrderCommand>(
                                new ValidationAspect<BookOrderCommand>(
                                    new BookOrderCommandHandler(repository), validator));

_commandHandler.Execute(new BookOrderCommand() {DeliveryAddres = "address"});
```

Similarly to the command pattern itself, aspect decorators pattern gets more useful the more complex our application becomes.

Common aspects that can be extracted using this technique are:

- Input validation
- Error handling - catching exceptions, logging them, creating error responses.
- Transaction handling - start a transaction before handling a command, and roll it back if there are any exceptions.
- Logging - all executed commands and their parameters can be logged to produce full inspection log of the system activity.
- Security - common mechanism for verification if command can be handled under current circumstances (e.g. check if the user is authenticated).

## Handling complexity with an IoC container

Separating application logic into smaller classes makes it harder to maintain all of the different classes dependencies “by hand”. In addtion, using aspects greatly magnifies this issue (as you can see in the example with command and aspect execution). To maintain this complexity, we should use an IoC container and register all of our command handlers and aspects there.

As we are dealing with lot of smaller classes, it is very helpful if our container have an API that allows us to use convention to register all of the generic Command Handler classes and their Aspect automatically. Following example shows how to configure such convention with *Ninject* container (using *Ninject.Extensions.Conventions* package).

```csharp
public class CommandsNinjectModule : NinjectModule
{
   public override void Load()
   {
       //(...)

       //Validators
       Kernel.Bind(scanner => scanner
           .FromThisAssembly()
           .IncludingNonePublicTypes()
           .SelectAllClasses()
           .InheritedFrom(typeof(IValidator<>))
           .WhichAreNotGeneric()
           .BindSingleInterface());

       //Commands
       Kernel.Bind(scanner => scanner
           .FromThisAssembly()
           .IncludingNonePublicTypes()
           .SelectAllClasses()
           .InheritedFrom(typeof (ICommandHandler<>))
           .WhichAreNotGeneric()
           .BindSingleInterface()
           .Configure(c => c
               .WhenInjectedInto(typeof(ValidationAspect<>))));

       //Aspects
       Bind(typeof (ICommandHandler<>)).To(typeof(ValidationAspect<>))
           .WhenInjectedInto(typeof(ErrorHandlingAspect<>));

       Bind(typeof(ICommandHandler<>)).To(typeof(ErrorHandlingAspect<>));
   }
}
```

In the snippet we do the following:

- Register all validators (classes that inherit from `IValidator<T>` interface)
- Register all command handlers (classes that inherit from `ICommandHandler<TCommand>` interface). Note, that we specify first aspects (`ValidationAspect<>`) in our decorator chain there with the `WhenInjectedInto` method.
- Register all aspects classes creating a chain of decorators. Here you need to pay special attention to `WhenInjectedInto` rules, as they specify the order of decorators in the chain. For example, for us it is important, that Validation aspect will be executed before Error Handling aspect, as our validation also may throw exceptions.

It is important to note, that not all containers may support creating decorators chains, or allow for easy, automated registrations. For example, Microsoft Unity requires a [custom extension](http://www.beefycode.com/post/Decorator-Unity-Container-Extension.aspx) to enable it to register and resolve decorators.

## Example sources

Full source code including examples from this article is available on [GitHub](https://github.com/quarion/CommandsAndAspects)

## References

- [Design Patterns: Elements of Reusable Object-Oriented Software](http://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)

- <http://martinfowler.com/bliki/CommandQuerySeparation.html>

- [Meanwhile… on the command side of my architecture](https://cuttingedge.it/blogs/steven/pivot/entry.php?id=91)
