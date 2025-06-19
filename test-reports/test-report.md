# @odyssee-software/imqfe Test Results

> **Started**: Thu, 19 Jun 2025 17:39:13 GMT

<center>

|Suites (3)|Tests (26)|
|:-:|:-:|
|![](https://img.shields.io/badge/Passed-3-green) | ![](https://img.shields.io/badge/Passed-26-green)|
|![](https://img.shields.io/badge/Failed-0-lightgrey) | ![](https://img.shields.io/badge/Failed-0-lightgrey)|
|![](https://img.shields.io/badge/Pending-0-lightgrey) | ![](https://img.shields.io/badge/Pending-0-lightgrey)|

---

<table>
<thead>
<tr>
<th>qm-flow.test.ts</th>
<th></th>
<th></th>
<th>0.902</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / constructor</strong></td>
<td><i>should initialize with empty specs if none provided</i></td>
<td>passed</td>
<td>0.003</td>
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
<td>0.014</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / static run()</strong></td>
<td><i>should execute flow and resolve with outputs</i></td>
<td>passed</td>
<td>0</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>qm.test.ts</th>
<th></th>
<th></th>
<th>0.927</th>
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
<td>0.012</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / Job lifecycle and events</strong></td>
<td><i>should allow following a job with follow()</i></td>
<td>passed</td>
<td>0.001</td>
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
<td>0</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / job() method</strong></td>
<td><i>should return undefined for unknown job id</i></td>
<td>passed</td>
<td>0</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>resolver-registry.test.ts</th>
<th></th>
<th></th>
<th>1.333</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Noop</strong></td>
<td><i>should return an empty object</i></td>
<td>passed</td>
<td>0.002</td>
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
<td>0.006</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::ThrowError</strong></td>
<td><i>should throw error with provided message</i></td>
<td>passed</td>
<td>0.001</td>
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
<td>0.001</td>
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
<td>0.102</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Wait</strong></td>
<td><i>should handle different result value types</i></td>
<td>passed</td>
<td>0.205</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>ResolversRegistry / flowher::Wait</strong></td>
<td><i>should resolve immediately with 0ms delay</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
</tbody>
</table>
</center>