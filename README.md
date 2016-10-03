# sample-heap-allocations [![build status](https://secure.travis-ci.org/thlorenz/sample-heap-allocations.png)](http://travis-ci.org/thlorenz/sample-heap-allocations)

Samples heap allocations, indicating functions in which the memory was allocated

```js
const sh = require('sample-heap-allocations')

sh.startSampling(32, 10)
// allocate some things like Arrays
const allocs = sh.collectAllocations()
console.log(allocs)
```

```js
{ id: '0:0:0',
  script_id: 0,
  script_name: '',
  name: '(root)',
  line_number: 0,
  column_number: 0,
  allocations: [],
  child_ids: [ '34:10:10', '34:12:19', '48:573:26', '48:383:24', '48:414:23' ],
  children:
   [ { id: '34:10:10',
       script_id: 34,
       script_name: 'node.js',
       name: '',
       line_number: 10,
       column_number: 10,
       allocations: [],
       child_ids: [ '34:12:19' ],
       children:
        [ { id: '34:12:19',
            script_id: 34,
            script_name: 'node.js',
            name: 'startup',
            line_number: 12,
            column_number: 19,
            allocations: [],
            child_ids: [ '48:573:26' ],
  // many more children
```

## Status

Working version. No tests yet :(

## Example

Run the CLI example via `npm run cli` or `npm run cli-formatted`

Run the WebApp example via `npm run app`

## Installation

Not yet :(

## API

#### startSampling

```js
/**
 * Starts sampling of memory allocations
 *
 * @name startSampling
 * @function
 * @param {number} interval the sampling interval in ms, default: 32
 * @param {number} stack_depth depth of stack to include for each memory allocation, default: 2
 */
```

#### stopSampling

```js
/**
 * Stops sampling of memory allocations
 *
 * @name stopSampling
 * @function
 */
```


#### collectAllocations

```js
/**
 * Higher level API which collects all nodes of the callgraph via @see collectNodes
 * and then reconstructs the callgraph via @see constructCallgraph.
 *
 * @name collectAllocations
 * @function
 * @param {Object=} opts
 * @param {Boolean=} opts.stopSampling stops sampling after collecting nodes, default: true
 * @param {Boolean=} opts.noCircular attempts to scrub circular references from graph (still should use safe stringify when converting to JSON), default: true
 * @return {Object} the callgraph including all allocation information
 ```

#### collectNodes

```js
/**
 * Visits all nodes in the allocation callgraph and returns a flat array of them.
 * Each has an id and an array of ids of its children.
 * It has another array of allocations associated with that node.
 *
 * @name collectNodes
 * @function
 * @return Array.<Object> nodes found
 */
```

#### constructCallgraph

```js
/**
 * Reconstructs the callgraph from the nodes array obtained via @see collectNodes.
 *
 * @name constructCallgraph
 * @function
 * @param {Array.<Object>} nodes obtained via @see collectNodes
 * @return {Object} the callgraph including all allocation information
 */
 ```

## License

MIT
