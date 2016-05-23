# sample-heap-allocations [![build status](https://secure.travis-ci.org/thlorenz/sample-heap-allocations.png)](http://travis-ci.org/thlorenz/sample-heap-allocations)

Samples heap allocations, indicating functions in which the memory was allocated

```js
const sh = require('sample-heap-allocations')

sh.startSampling(32, 10)
// allocate some things like Arrays
sh.visitAllocationProfile(console.log)
sh.stopSampling()
```

## Status

Working version (needs NodeJS >=v6). No tests yet :(

## Example

Run the CLI example via `npm run cli`

## Installation

    npm install sample-heap-allocations

## License

MIT
