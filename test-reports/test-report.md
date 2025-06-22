# @odyssee-software/imqfe Test Results

> **Started**: Sun, 22 Jun 2025 14:25:23 GMT

<center>

|Suites (3)|Tests (32)|
|:-:|:-:|
|![](https://img.shields.io/badge/Passed-3-green) | ![](https://img.shields.io/badge/Passed-32-green)|
|![](https://img.shields.io/badge/Failed-0-lightgrey) | ![](https://img.shields.io/badge/Failed-0-lightgrey)|
|![](https://img.shields.io/badge/Pending-0-lightgrey) | ![](https://img.shields.io/badge/Pending-0-lightgrey)|

---

<table>
<thead>
<tr>
<th>mq-flow.test.ts</th>
<th></th>
<th></th>
<th>0.896</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / constructor</strong></td>
<td><i>should initialize with empty specs if none provided</i></td>
<td>passed</td>
<td>0.002</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / constructor</strong></td>
<td><i>should initialize with provided specs</i></td>
<td>passed</td>
<td>0</td>
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
<td>0.011</td>
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
<th>0.899</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / WorkerController Validation</strong></td>
<td><i>should validate a properly constructed worker callback</i></td>
<td>passed</td>
<td>0.003</td>
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
<td>0</td>
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
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Queue enqueue and dequeue</strong></td>
<td><i>should enqueue and dequeue jobs</i></td>
<td>passed</td>
<td>0</td>
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
<td>0</td>
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
<td>0.014</td>
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
<td>0.002</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>resolver-registry.test.ts</th>
<th></th>
<th></th>
<th>1.295</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Noop</strong></td>
<td><i>should return an empty object</i></td>
<td>passed</td>
<td>0.003</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Echo</strong></td>
<td><i>should return input value in out property</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Echo</strong></td>
<td><i>should handle different input types</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::ThrowError</strong></td>
<td><i>should throw error with default message when no message provided</i></td>
<td>passed</td>
<td>0.007</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::ThrowError</strong></td>
<td><i>should throw error with provided message</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Conditional</strong></td>
<td><i>should return onTrue object when condition is true</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Conditional</strong></td>
<td><i>should return onFalse object when condition is false</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Conditional</strong></td>
<td><i>should handle different result value types</i></td>
<td>passed</td>
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Wait</strong></td>
<td><i>should resolve after specified delay with given result</i></td>
<td>passed</td>
<td>0.101</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Wait</strong></td>
<td><i>should handle different result value types</i></td>
<td>passed</td>
<td>0.206</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Wait</strong></td>
<td><i>should resolve immediately with 0ms delay</i></td>
<td>passed</td>
<td>0.002</td>
</tr>
</tbody>
</table>
</center>