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

## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="addFormat"><span class="type-signature"></span>addFormat<span class="signature">(opts, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Adds a <code>formatted</code> property to each callsite and optionally the source of the function
at which allocations occurred.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
</td>
<td class="description last">
<h6>Properties</h6>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>allocations</code></td>
<td class="type">
<span class="param-type">Array.&lt;Object></span>
</td>
<td class="description last"><p>allocations collected via @see collectAllocations</p></td>
</tr>
<tr>
<td class="name"><code>includeSourceLines</code></td>
<td class="type">
<span class="param-type">Number</span>
</td>
<td class="description last"><p>number of lines of code of each function to include (set to <code>0</code> if no code should be included), default: 5</p></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when all formatting information was added (with an error if one occurred)</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/lib/add-format.js">lib/add-format.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/lib/add-format.js#L54">lineno 54</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="collectAllocations"><span class="type-signature"></span>collectAllocations<span class="signature">()</span><span class="type-signature"> &rarr; {Array.&lt;Object>}</span></h4>
</dt>
<dd>
<div class="description">
<p>Higher level API which collects all allocated callsites via @see visitAllocationProfile.</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/sample-heap-allocations.js">sample-heap-allocations.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/sample-heap-allocations.js#L78">lineno 78</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>array of collected callsites</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Array.&lt;Object></span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="startSampling"><span class="type-signature"></span>startSampling<span class="signature">(interval, stack_depth)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Starts sampling of memory allocations</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>interval</code></td>
<td class="type">
<span class="param-type">number</span>
</td>
<td class="description last"><p>the sampling interval in ms, default: 32</p></td>
</tr>
<tr>
<td class="name"><code>stack_depth</code></td>
<td class="type">
<span class="param-type">number</span>
</td>
<td class="description last"><p>depth of stack to include for each memory allocation, default: 6</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/sample-heap-allocations.js">sample-heap-allocations.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/sample-heap-allocations.js#L6">lineno 6</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="stopSampling"><span class="type-signature"></span>stopSampling<span class="signature">()</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Stops sampling of memory allocations</p>
</div>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/sample-heap-allocations.js">sample-heap-allocations.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/sample-heap-allocations.js#L19">lineno 19</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="visitAllocationProfile"><span class="type-signature"></span>visitAllocationProfile<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Allows collecting all sampled allocations using the Visitor pattern, thus matching the underlying v8 API.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with each callsite for which memory allocations where encountered</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/sample-heap-allocations.js">sample-heap-allocations.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/sample-heap-allocations/blob/master/sample-heap-allocations.js#L29">lineno 29</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT
