# @odyssee-software/imqfe Test Results

> **Started**: Thu, 19 Jun 2025 15:56:10 GMT

<center>

|Suites (2)|Tests (8)|
|:-:|:-:|
|![](https://img.shields.io/badge/Passed-2-green) | ![](https://img.shields.io/badge/Passed-8-green)|
|![](https://img.shields.io/badge/Failed-0-lightgrey) | ![](https://img.shields.io/badge/Failed-0-lightgrey)|
|![](https://img.shields.io/badge/Pending-0-lightgrey) | ![](https://img.shields.io/badge/Pending-0-lightgrey)|

---

<table>
<thead>
<tr>
<th>qm-flow.test.ts</th>
<th></th>
<th></th>
<th>1.067</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>FlowProducer / constructor</strong></td>
<td><i>should initialize with empty specs if none provided</i></td>
<td>passed</td>
<td>0.001</td>
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
<td>0.007</td>
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
<th>qm.test.ts</th>
<th></th>
<th></th>
<th>0.161</th>
</tr>
</thead>
<tbody>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / WorkerController Validation</strong></td>
<td><i>should validate a properly constructed worker callback</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
<tr style="background-color: lightgreen; color: black">
<td><strong>Memory Queue Tests / WorkerController Validation</strong></td>
<td><i>should create worker with correct structure</i></td>
<td>passed</td>
<td>0.001</td>
</tr>
</tbody>
</table>
</center>