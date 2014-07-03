'use strict';
var ReadableStream = require('readable-stream')
module.exports = (function create(opts) {
  union.using = function(opts_) {
    return create(
      { cmp: opts_.cmp || opts.cmp
      , toKey: opts_.toKey || opts.toKey
      , merge: opts_.merge || opts.merge
      })
  }

  var cmp = opts.cmp || simpleCmp
    , toKey = opts.toKey || identity
    , merge = opts.merge || identity

  return union

  function union(a, b) {
    var stream = new ReadableStream({ objectMode: true })
      , aVal = null
      , bVal = null
      , ended = false

    stream._read = readA

    a.on('end', end)
    b.on('end', end)
    function end() {
      if (ended) return
      ended = true
      stream.push(null)
    }

    return stream

    function readA() {
      if (ended) return
      aVal = a.read()
      if (aVal === null)
        return a.once('readable', readA)
      push()
    }

    function readB() {
      if (ended) return
      bVal = b.read()
      if (bVal === null)
        return b.once('readable', readB)
      push()
    }

    function push() {
      if (aVal === null)
        return readA()
      if (bVal === null)
        return readB()

      var c = cmp(toKey(aVal), toKey(bVal))
      if (c < 0) {
        stream.push(aVal)
        return readA()
      }
      if (c > 0)
        stream.push(bVal)
        return readB()
      }

      var val = merge(aVal, bVal)
      if (val === undefined)
        readA()
      else if (val !== null)
        stream.push(val)
      else
        end()
    }
})({})

function identity(x) { return x }
function simpleCmp(a, b) {
  if (a !== a)
    return -1
  if (b !== b)
    return 1

  return a < b
    ? -1
    : a > b
      ? 1
      : 0
}
