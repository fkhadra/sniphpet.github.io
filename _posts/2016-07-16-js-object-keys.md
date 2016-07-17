---
layout: post
title:  "How to loop through javascript object, the right way"
date:   2016-07-16
permalink: how-to-loop-through-a-javascript-object
disqus_id: dis57742cecee76d
tags:
- javascript
- object literal
- loop
- keys
- es5
- prototype
- array
- node list
- foreach
- iterate
---

Looping through an object is a common task when programming. The inheritance in javascript is prototype-based.
Objects inherit from other objects through a prototype property. There is no classes in javascript (es6 classes are syntactic sugar).
We need to be careful when looping through objects.


<div markdown="1" class="toc">
<ul><li class="toc-summary">Contents</li></ul>

* TOC
{:toc}
</div>


## For ... in
-----------------

If you google 'how to loop through a javascript object' you will get a bunch of results. Most of the snippets uses a ```for ... in``` loop.
The ```for ... in``` loop through the object as expected but there is one drawback. It also enumerates the properties in the prototype chain(inherited properties).
So, you have to check if the property is owned by the current object for each iteration :

```javascript

for(var prop in obj) {
  if (obj.hasOwnProperty(prop)){
      console.log(prop);
  }
}

```


## Object.keys + forEach
----------------

Most browsers support ES5 standard(ie >=9 if you support ie). ES5 brought interesting functions.

Let's focus on ```forEach()``` and ```Object.keys()```.

The first one loops over an array. It's attached to the Array.prototype. You will get an error if you try to use it on an object.

The second one returns an array of object's enumerable own properties. Inherited properties are skipped.

Combining both functions, we can iterate over an object without worrying about properties in the prototype chain :
 
```javascript

 var Dog = {/*Inherit from Animal object*/}:
 
 Object.keys(Dog).forEach(function(prop){
    console.log(Dog[prop]); //Log Dog own properties
 });
 
 var nodeList = document.querySelectorAll('div');
 
 Object.keys(nodeList).forEach(function(prop){
     console.log(nodeList[prop]); 
     // Do something fancy with the node list element
 });
 
```

Pretty cool hmm :grin:. This method can be used to loop through a node list as well.

## The right way
----------------

Always pick the right tool for the job.


| Case        | for in           | Object.keys + forEach  |
| ------------- |:-------------:| -----:|
| Iterating over own properties only | <i class="fa fa-times" aria-hidden="true"></i> | <i class="fa fa-check" aria-hidden="true"></i> |
| Iterating over own properties and inherited properties| <i class="fa fa-check" aria-hidden="true"></i> | <i class="fa fa-times" aria-hidden="true"></i> |

  