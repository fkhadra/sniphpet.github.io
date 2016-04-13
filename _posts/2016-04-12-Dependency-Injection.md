---
layout: post
title: Learning design patterns &#58; Dependency Injection
date: 2016-04-12 19:54:48 +0000
disqus_id: dis570e0333caf2f
permalink: learning-dependency-injection
tags:
- design pattern
- DI
- dependency injection
- solid
- inversion of control
- IOC
---

Dependency Injection is one of the most used design pattern in software development. You are probably using it already, without realising it.

If you already heard about [SOLID](https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)) principle and I hope you did, Dependency injection stand for the D.
"Depend upon Abstractions. Do not depend upon concretions".

<div markdown="1" class="toc">
<ul><li class="toc-summary">Contents</li></ul>

* TOC
{:toc}
</div>

<i>Note: Inversion of Control (IoC) is another name for Dependency Injection (DI)</i>

### The study case
------------------

Imagine we want to cook a burger ( I love burgers btw :grin: ), to do so we need at least 2 things : 
`bread` and `meat`.

If one of those ingredients is missing we can't make a burger !

Let's see how we can apply that to software design.
Generally the first approach will be to create a Burger class as follow :

{% highlight ruby %}
class Burger
{
    /**
     * @var Bread
     */
    private $bread;
    
    /**
     * @var Meat
     */
    private $meat;
    
    public function __construct()
    {
        $this->bread = new Bread();
        $this->meat  = new Meat();
    }
    /***/
}
{% endhighlight %}

Of course this is the wrong approach. The dependency are hidden. It's not obvious that our Burger class depends on the Bread class
and the Meat class.

Imagine now that we want to make a chicken burger. To make a chicken burger we will need to modify the Burger class :
{% highlight ruby %}
class Burger
{
    /**
     * @var Bread
     */
    private $bread;
    
    /**
     * @var ChickenMeat -> Here
     */
    private $meat;
    
    public function __construct()
    {
        $this->bread = new Bread();
        $this->meat  = new ChickenMeat(); -> Here
    }
    /***/
}
{% endhighlight %}
Same for others burgers. 
Of course, you could perform some checks inside the Burger class but it means that
for each kind of meat you want to allow you will need to add a validation. You definitely don't want to do that.

This approach violates the Open/Closed principle (the O in SOLID).
[“software entities … should be open for extension, but closed for modification.”](https://en.wikipedia.org/wiki/Open/closed_principle).
 

### Extract dependencies and inject them
----------------------------------------

The Burger class depends on `meat` and `bread`. So we need to inject them into the Burger class. The constructor is a good place to start.

#### First approach

Refactor the class as follow : 

{% highlight ruby %}
class Burger
{
    private $bread;
    
    private $meat;
    
    public function __construct(Bread $bread, Meat $meat)
    {
        $this->bread = $bread;
        $this->meat  = $meat
    }
}
{% endhighlight %}

Now we clearly see that the Burger class needs `bread` and `meat` to be instantiated :satisfied:.

But not enough for our case. We still depend upon concretion.

If you remember the chicken burger, we can't do :  
{% highlight ruby %}
$bread  = new Bread();
$meat   = new ChickenMeat()
$burger = new Burger($bread, $meat); //Error raised ! ChickenMeat is not type of Meat
{% endhighlight %}

Remember that : when you think about dependency injection, think **ABSTRACTION**. Abstraction is the key !

#### Abstraction is the solution, Interface is the tool

OOP language ship with [Interface](http://www.cs.utah.edu/~germain/PPS/Topics/interfaces.html).
To depend upon abstraction, we will use interfaces. See oop **interface** as a contract.

Let's create the interfaces : 

{% highlight ruby %}
interface MeatInterface{/* code goes here */}
interface BreadInterface{/* code goes here */}
{% endhighlight %}

### Dependency Injection in action
----------------------------------

##### Refactoring the Burger class

To rely on abstraction the Burger class looks like :

{% highlight ruby %}
class Burger
{
    /**
     * @var BreadInterface
     */
    private $bread;

    /**
     * @var MeatInterface
     */
    private $meat;

    public function __construct(BreadInterface $bread, MeatInterface $meat)
    {
        $this->bread = $bread;
        $this->meat  = $meat;
    }
}
{% endhighlight %}

Now, any type of meat that implement `MeatInterface` can be injected during a Burger instantiation.

In other word, each type of meat which meets the contract's conditions can be used to cook our burger.
Same case for the bread.

Concretely, let's create two types of meat and two types of bread which implements the interfaces defined previously :

{% highlight ruby %}
class ChickenMeat implements MeatInterface {/***/}

class BeefMeet implements MeatInterface {/***/}

class WhiteBread implements BreadInterface {/***/}

class WholeWheatBread implements BreadInterface {/***/}
{% endhighlight %} 

Now I'm able to cook different kind of burger without modifying the Burger Class :
{% highlight ruby %}
$chickenBurger = new Burger(new WhiteBread(), new ChickenMeat());

$beefBurger = new Burger(new WhiteBread(), new BeefMeat());

{% endhighlight %}
 
#### Respecting the Open/Closed principle

Our burger is so good that we decided to create one with pork meat.
All I have to do is to create a PorkMeat class that implements MeatInterface and voilà:

{% highlight ruby %}
class PorkMeat implements MeatInterface {/***/}

$porkBurger = new Burger(new WholeWheatBread(), new PorkMeat());
{% endhighlight %}

### Different types of Dependency Injection
-------------------------------------------

#### Constructor Injection

Constructor injection is probably one of the most used way to implement dependency injection. This is exactly what we did 
with the Burger class.

#### Setter Injection

Setter injection works exactly like constructor injection, but with setter this time :

{% highlight ruby %}
use Monolog\Logger;

class App 
{
    /***/
    public function setLogger(LoggerInterface $logger) 
    {
        $this->logger = $logger
    }
    /***/
}

$app = new App();
$monolog = new Logger('plop');
$app->setLogger($monolog);

{% endhighlight %}

### Benefit of using dependency injection
-----------------------------------------

Following my personal experience, I found several benefits for using DI/IoC :

- Easier to follow [Single Responsibility Principe](http://en.wikipedia.org/wiki/Single_responsibility_principle)
- Class are easier to test. 
- Code base is easier to maintain
- Respect of [Open/Closed principle](https://en.wikipedia.org/wiki/Open/closed_principle)
- Reduce bug probability
- Reduce also [Cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)

There is probably more reason to use DI but these are the firsts coming to my mind during writing that post.
The day I learned DI/IoC, my vision of software development changed forever. 

The same append when I learned domain driven design but this is another story :stuck_out_tongue_closed_eyes:. 

### A quick word on Dependency Injection Container
--------------------------------------------------

Dependency injection is a design pattern.

Dependency injection container is a tool which help to accomplish dependency injection.

Below a few DI containers for Php : 

- [zend-servicemanager](https://github.com/zendframework/zend-servicemanager)
- [pimple](http://pimple.sensiolabs.org/)
- [php-di](http://php-di.org/)
 
