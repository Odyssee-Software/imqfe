# @odyssee-software/imqfe Test Results

> **Started**: Sat, 28 Jun 2025 18:47:36 GMT

<center>

|Suites (6)|Tests (53)|
|:-:|:-:|
|![](https://img.shields.io/badge/Passed-6-green) | ![](https://img.shields.io/badge/Passed-53-green)|
|![](https://img.shields.io/badge/Failed-0-lightgrey) | ![](https://img.shields.io/badge/Failed-0-lightgrey)|
|![](https://img.shields.io/badge/Pending-0-lightgrey) | ![](https://img.shields.io/badge/Pending-0-lightgrey)|

---

<table>
<thead>
<tr>
<th>resolver-expected-results.test.ts</th>
<th></th>
<th></th>
<th>1.704</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>resolverExpectedResults</strong></td>
<td><i>should return empty object if data is falsy</i></td>
<td>passed</td>
<td>0.002</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>resolverExpectedResults</strong></td>
<td><i>should return data as-is if expected is falsy or not an object</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>resolverExpectedResults</strong></td>
<td><i>should rename simple key-value pairs</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>resolverExpectedResults</strong></td>
<td><i>should handle nested objects</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>resolverExpectedResults</strong></td>
<td><i>should handle deeply nested objects</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>simple-transform.test.ts</th>
<th></th>
<th></th>
<th>1.7</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>simpleTransform</strong></td>
<td><i>should transform data according to the pattern</i></td>
<td>passed</td>
<td>0.007</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>simpleTransform</strong></td>
<td><i>should handle empty data and pattern</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>handle-transform-properties.test.ts</th>
<th></th>
<th></th>
<th>1.792</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>handleTransformProperties</strong></td>
<td><i>should return merged input and properties when properties is invalid</i></td>
<td>passed</td>
<td>0.011</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>handleTransformProperties</strong></td>
<td><i>should return merged input and properties when no transform property exists</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>handleTransformProperties</strong></td>
<td><i>should call simpleTransform when transform is an object</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>handleTransformProperties</strong></td>
<td><i>should return merged input and properties when transform is not an object</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>mq-flow.test.ts</th>
<th></th>
<th></th>
<th>1.862</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / constructor</strong></td>
<td><i>should initialize with empty specs if none provided</i></td>
<td>passed</td>
<td>0.005</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / constructor</strong></td>
<td><i>should initialize with provided specs</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / add()</strong></td>
<td><i>should throw error for invalid resolver name</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / add()</strong></td>
<td><i>should add valid task to queue</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / run()</strong></td>
<td><i>should run flow and return expected outputs</i></td>
<td>passed</td>
<td>0.023</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / static run()</strong></td>
<td><i>should execute flow and resolve with outputs</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>mq.test.ts</th>
<th></th>
<th></th>
<th>1.903</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / WorkerController Validation</strong></td>
<td><i>should validate a properly constructed worker callback</i></td>
<td>passed</td>
<td>0.002</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / WorkerController Validation</strong></td>
<td><i>should create worker with correct structure</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Job lifecycle and events</strong></td>
<td><i>should trigger &#34;start&#34;, &#34;success&#34; and &#34;end&#34; events</i></td>
<td>passed</td>
<td>0.023</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Job lifecycle and events</strong></td>
<td><i>should allow following a job with follow()</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Job lifecycle and events</strong></td>
<td><i>should handle error event</i></td>
<td>passed</td>
<td>0.002</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Queue enqueue and dequeue</strong></td>
<td><i>should enqueue and dequeue jobs</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Queue enqueue and dequeue</strong></td>
<td><i>should return null when dequeue with unknown id</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / job() method</strong></td>
<td><i>should find a job by id</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / job() method</strong></td>
<td><i>should return undefined for unknown job id</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Worker start()</strong></td>
<td><i>should return worker result</i></td>
<td>passed</td>
<td>0.002</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Worker start()</strong></td>
<td><i>should execute worker and return result in callback if used</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Worker start()</strong></td>
<td><i>should execute worker and return errors in callback if used</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Worker start()</strong></td>
<td><i>should execute worker and return result</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Worker start()</strong></td>
<td><i>should handle worker execution errors</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Job chaining</strong></td>
<td><i>should chain jobs and pass results between workers</i></td>
<td>passed</td>
<td>0.004</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>resolver-registry.test.ts</th>
<th></th>
<th></th>
<th>2.07</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Noop</strong></td>
<td><i>should return an empty object</i></td>
<td>passed</td>
<td>0.01</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Echo</strong></td>
<td><i>should return input value in out property</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Echo</strong></td>
<td><i>should handle different input types</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::ThrowError</strong></td>
<td><i>should throw error with default message when no message provided</i></td>
<td>passed</td>
<td>0.028</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::ThrowError</strong></td>
<td><i>should throw error with provided message</i></td>
<td>passed</td>
<td>0.002</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Conditional</strong></td>
<td><i>should return onTrue object when condition is true</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Conditional</strong></td>
<td><i>should return onFalse object when condition is false</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Conditional</strong></td>
<td><i>should handle different result value types</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Wait</strong></td>
<td><i>should resolve after specified delay with given result</i></td>
<td>passed</td>
<td>0.102</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Wait</strong></td>
<td><i>should handle different result value types</i></td>
<td>passed</td>
<td>0.209</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Wait</strong></td>
<td><i>should resolve immediately with 0ms delay</i></td>
<td>passed</td>
<td>0.002</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::SubFlow</strong></td>
<td><i>should execute a sub-flow and resolve with its result</i></td>
<td>passed</td>
<td>0.023</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::SubFlow</strong></td>
<td><i>should reject with error message when sub-flow fails</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Stop</strong></td>
<td><i>should call stop on queue and return promise when context has queue</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Stop</strong></td>
<td><i>should handle missing context gracefully</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Loop</strong></td>
<td><i>should process items sequentially when parallel is false</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Loop</strong></td>
<td><i>should process items in parallel when parallel is true</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Loop</strong></td>
<td><i>should handle empty input collection</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::Loop</strong></td>
<td><i>should return outCollection with transformed items</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::ArrayMap</strong></td>
<td><i>should map over array sequentially when parallel is false</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / imqfe::ArrayMap</strong></td>
<td><i>should handle empty params array</i></td>
<td>passed</td>
<td>0</td>
</tr>
</tbody>
</table>
</center>