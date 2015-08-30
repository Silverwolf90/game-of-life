##### **This is experimental. I would love to hear feedback on both the general style and the code itself.**

If you are unfamiliar with the game of life I suggest you look at the [Wikipedia article](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

To run the game:

```
babel-node --stage 0 main.js
```

I've been fooling around with a fairly different (and significantly more
constrained) JavaScript style. Linted using [eslint](http://eslint.org/). Note
that I am not a functional programmer and I have never done any serious
functional programming, but I have been toying with more FP
inspired work in my day-to-day style. 

Note that I'm using [lodash-fp](https://github.com/lodash/lodash-fp), which has auto-curried callback-first functions.

# Basic Guide

### Heavy use of functions

* Use arrow function syntax.
* Use `const`.
* Split the expression into 3 lines. Name. Arguments. Body.
* Put function decorators (ie: `curry()`, `memoize()`) on same line as name.
* Put arguments that act as function parameters first. Arguments should have data as last argument. 

Ideally (not required, context dependant-- use your discretion):
  * Functions should be pure (you need a really good reason to not follow this one)
  * Function should be one expression. Avoid return.
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

`lodash` provides a function called `flow` ([documentation](https://lodash.com/docs#flow)) which does left-to-right function composition. I find it to be tremendously useful, however, a downside is the input to the composed function is not declared anywhere:

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

##### Debugging

A downside to function composition is that it makes runtime debugging a bit more difficult. But it's not so bad, use the `log()`, `trace()` and `debug()` functions in `util.js` and put them after a function to debug the output.

```javascript
const add10ThenDivideBy5 = flow(add(10), log, divide(5));
log(add10ThenDivideBy5(5));
//=> 15
//=> 3
```

```javascript
const add10ThenDivideBy5 = flow(add(10), trace('completed addition'), divide(5));
log(add10ThenDivideBy5(5));
//=> 'completed addition' 15
//=> 3
```

##### Using Impure Functions

Some functions you need to use might mutate the world and/or not return what you want while still performing a useful operation. Particularly if using libraries or frameworks that you don't control, like `console.log`. It both mutates the world and returns `undefined` which makes it difficult to compose. So to force a return value you can use `lodash.constant` to create a function that always returns the value provided.Here's an example of a composable logging function (which you'll find in `util.js`):

(The ES7 function bind operator makes this much nicer than using `.bind()`)

```javascript
const log = 
  (value) => flow(
    ::console.log,
    constant(value)
  )(value)
```

If the function is guaranteed to return something falsy, then you could do this...

```javascript
const log =
  (value) =>
    console.log(value) || value;
```

### Data Types (not classes)

Just use plain javascript objects. We have no classes in the traditional sense. Do not couple data and behavior. Use upper-cased functions that take in their data as arguments and simply wrap them in an object. ES6 shorthand syntax makes this nice.

```javascript
const Person =
  (firstName, lastName, occupation) => ({
    firstName,
    lastName,
    occupation,
  });
```

When you're passing an object and you only need a couple of the fields, use destructuring.

```javascript
const getFullName = 
  ({firstName, lastName}) =>
    `${firstName} ${lastName}` 
```

### Imports

Prefer to name every dependency you need from a module at the top of your file instead of passing the entierty of the module around.

It's a bit cumbersome, but it means your dependencies in the file are clearly declared in a single place and your file has exactly what it needs to run. No more, no less. 

If you're only using a couple functions it should fit on one line, but if you have a long list break, feel free to break it into multiple lines.

A less important reason to do this: it's prettier :) I really don't like having my code peppered with `_.`

```javascript
import { or, map2dIndexes } from './util';
import { size, map, flow, filter, times, constant,
  range, curry, get, where } from 'lodash-fp';
```

### Lodash

<3 lodash -- If you need some kind of low level behavior, chances are lodash provides it or you'll only need to compose a couple functions. The library is tested, documented and optimized. Use it heavily.

#### Lodash tips:

Use `property(key)` or `get(key, obj)` which allows you to generate property getters that take an object. They also support accessing deep structures and will return undefined if the path is invalid.

```javascript
const getFirstName = get('firstName'); 
const person = Person('Bojack', 'Horseman', 'Actor');
getFirstName(person)
//=> 'Bojack'
``` 

You can pass in `_` as an argument to a curried function to indicate a placeholder argument.

```javascript
const numbers = [1, 2, 3, 4];
const mapNumbers = map(_, numbers);
const greaterThan2 = gt(2);
mapNumbers(greaterThan2)
//=> [false, false, true, true]
```

### Questions I have
1. Are the type signatures as comments useful?
2. Does this style scale?
3. How well are my files/functions/types organized?
4. Is the pattern for types going over-board? Do they make the code more clear?
6. Do you think this is good code? Why or why not?
7. How much would be gained by adding static types using Flow or TypeScript?
8. Performance? Lots of wrapped functions means lots more calls. Does it matter?
9. Should we drop the usage of semi-colons?

The MIT License (MIT)

Copyright (c) 2015 Cyril Silverman

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.