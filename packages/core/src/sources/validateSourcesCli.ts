import { getSourceValidationSummary, validateSourceIntegrity } from "./validation";

const issues = validateSourceIntegrity();
const summary = getSourceValidationSummary(issues);

if (issues.length > 0) {
  for (const issue of issues) {
    const prefix = issue.severity === "error" ? "ERROR" : "WARN";
    console.log(`${prefix} ${issue.id}: ${issue.message}`);
  }
}

console.log(
  `Source validation: ${summary.errors} error(s), ${summary.warnings} warning(s), ${summary.total} issue(s).`,
);

if (summary.errors > 0) {
  process.exitCode = 1;
}
