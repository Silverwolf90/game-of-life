### *This is experimental.*

So I've been fooling around with a fairly different JavaScript style than what
I would use at work. As of 8/30 11:50am, this code has not even been run.
It's merely a stylistic experiment, but it was linted using [eslint](http://eslint.org/).

Note that I'm using [lodash-fp](http://eslint.org/), which has auto-curried callback-first functions.

# Basic Guide

### Heavy use of functions

* Use arrow function syntax.
* Use `const`.
* Split the expression into 3 lines. Name. Arguments. Body.
* Put function decorators (ie: `curry()`, `memoize()`) on same line as name.
* Put arguments that act as function parameters first. Arguments should have data as last argument. 

Ideally (not required, context dependant-- use your discretion):
  * Function should be one expression.
    * Don't use return
  * Avoid intermediate variables
  * Build functions from smaller functions
  * Curry your functions if they have more than argument.

```javascript

const indexes =
  (array) =>
    range(0, array.length);

const mapIndexes = curry(
  (cb, array) =>
    map(cb, indexes(array)));
  
```

### Function Composition

`lodash` provides a function called `flow` ([documentation](https://lodash.com/docs#flow) which does left-to-right function composition. I find it to be tremendously useful, however, a downside is the input to the composed function is not declared anywhere:

```javascript

const someTransformation = flow(
  mapThingOverArray,
  firstElement,
  doThingToThatFirstElement,
  doYetAnotherThing
)

```

Its not obvious what we need to pass to `someTransformation`. We can look at the first function and infer that we need an array, but what does the array need to contain. We'd have to look at the definition of that function to figure it out. So to avoid this problem, simply wrap the composed function in a function that takes one argument and passes it to composed function.


```javascript

const someTransformation =
  (itemsToTransform) => flow(
    mapOverArray,
    firstElement,
    doThingToThatFirstElement,
    doYetAnotherThing
  )(itemsToTransform)

```

Its a bit uglier, but the clarity gained is more important. I see it as similar to the chaining syntax that underscore or lodash provide.

### Data (not classes)

Just use plain javascript objects. We have no classes in the traditional sense. Do not couple data and behavior. Use upper-cased functions that take in their data as arguments and simply wrap them in an object. ES6 shorthand syntax makes this nice.

```javascript
const Person =
  (firstName, lastName, occupation) => ({
    firstName,
    lastName,
    occupation,
  });
```

### Imports

Prefer to extract your dependencies at the top of your file.

If you're only using a couple functions it should fit on one line, but if you have a long list break, feel free to break it into multiple lines.

It's a bit cumbersome, but it means your dependencies in the file are clearly declared in a single place. As less important reason to do this: it's prettier :) I really don't like having my code peppered with `_.`

```javascript
import { or, map2dIndexes } from './util';
import { size, map, flow, filter, times, constant,
  range, curry, get, where } from 'lodash-fp';
```

### Lodash

<3 lodash -- If you need some kind of low level behavior, chances are lodash provides it or you'll only need to compose a couple functions. The library is tested, documented and optimized. Use it heavily.

#### Lodash tips:

Use `get(key, obj)` which allows you to generate property getters that take an object. 

```
const getFirstName = get('firstName'); 
const person = Person('Bojack', 'Horseman', 'Actor');
getFirstName(person)
//=> 'Bojack'
``` 

You can pass in `_` as an argument to a curried function to indicate a placeholder argument.

```
const numbers = [1, 2, 3, 4];
const mapNumbers = map(_, numbers);
const greaterThan2 = gt(2);
mapNumbers(greaterThan2)
//=> [false, false, true, true]
```