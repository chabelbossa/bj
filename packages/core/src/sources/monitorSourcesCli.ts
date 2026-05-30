import { runServicePublicMonitor } from "./sourceMonitor";

const report = await runServicePublicMonitor();

console.log(JSON.stringify(report, null, 2));

if (report.changes.length > 0) {
  process.exitCode = 1;
}
