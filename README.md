*This is experimental.*

So I've been fooling around with a fairly different JavaScript style than what
I would use at work. As of 8/30 11:50am, this code has not even been run.
It's merely a stylistic experiment, but it was linted using [eslint](http://eslint.org/).

Note that I'm using [lodash-fp](http://eslint.org/), which has auto-curried callback-first functions.

# Basic Guide

## Functions

Use arrow function syntax.
Use `const`.
Split the expression into 3 lines. Name. Arguments. Body.
Put function decorators (ie: `curry()`, `memoize()`) on same line as name.
Put arguments that act as function parameters first. Arguments should have data as last argument. 

Ideally (not required, context depdendent-- use your discretion):
  * Function should be one expression.
  * Don't use return
  * Don't use intermediate variables
  * Build functions from smaller functions
  * Curry your functions if they have more than argument.

```javascript

const indexes =
  (array) =>
    range(0, array.length);

export const mapIndexes = curry(
  (cb, array) =>
    map(cb, indexes(array)));
  
```

## Function Composition

`lodash` provides a called `flow` ((docs)[https://lodash.com/docs#flow]) which does left-to-right function composition. I find it to be tremendously useful, however, a downside is the input to the composed function is not declared anywhere:

```javascript

const someTransformation = flow(
  doThingToArray,
  first,
  doAnotherThing,
  doYetAnotherThing
)

```

Its not obvious what we need to pass to `someTransformation`. We can look at the first function and infer that we need an array, but what does the array need to contain. We'd have to look at the definition of that function to figure it out. So to avoid this problem, simply wrap the composed function in a function that takes one argument and passes it to composed function.


```javascript

const someTransformation =
  (arrayOfType) => flow(
    doThingToArray,
    first,
    doAnotherThing,
    doYetAnotherThing
  )(arrayOfType)

```

Its a bit uglier, but the clarity gained is more important.