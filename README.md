# sample-heap-allocations [![build status](https://secure.travis-ci.org/thlorenz/sample-heap-allocations.png)](http://travis-ci.org/thlorenz/sample-heap-allocations)

Samples heap allocations, indicating functions in which the memory was allocated

```js
const sh = require('sample-heap-allocations')

sh.startSampling(32, 10)
// allocate some things like Arrays
const allocs = sh.collectAllocations()
console.log(allocs)
sh.stopSampling()
```

## Status

Working version (needs NodeJS >=v6). No tests yet :(

## Example

Run the CLI example via `npm run cli` or `npm run cli-formatted`

Run the WebApp example via `npm run app`

![app](assets/sampling-memory.gif)

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
 * @param {number} stack_depth depth of stack to include for each memory allocation, default: 6
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
 * @return {Object} the callgraph including all allocation information
 */
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
