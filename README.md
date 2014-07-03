# stream-union

  union of sorted streams

## Installation

    npm install stream-union

## Example

```js
var cmp = require('typewise-cmp')
function max(a, b) { return 0 <= cmp(a, b) ? a : b }

function getKey(item) { return item.key }
function maxValue(a, b) { return max(a.value, b.value) }

var union = require('stream-union')
    .using({ toKey: getKey, cmp: cmp, merge: maxValue })

…
```

## API
### union(aStream :: ReadableStream, bStream :: ReadableStream) -> ReadableStream

  Intersect two streams.

### union.using({ toKey, cmp, merge }) -> function union(a, b) -> ReadableStream

  Customise the behaviour of `union`. Returns a customised `union` function.

#### toKey :: function(item) -> key

  the key function is applied to the items before comparison. it defaults to the identity function (a no-op).

#### cmp :: function(a, b) -> Number

  a comparison function.
  return `-1` for `a < b`, `1` for `a > b` and `0` for `a = b`.
  the default comparator considers values equal if they aren't less than or greater than each other.

#### merge :: function(a, b) -> item

  the merge function is called with every *equivalent* pair of input items, and its return value is output on the union stream.
  if it returns `undefined`, nothing will be output. if it returns `null`, the union stream ends.

