const { createHash } = require("node:crypto");

/**
 * Report created by IBM OpenAPI validator.
 *
 * @typedef {object} validatorReport
 * @property {string} version - IBM OpenAPI validator version
 * @property {validatorViolation[]} errors - List of errors
 * @property {validatorViolation[]} warnings - List of warnings
 */

/**
 * An error or warning object produced by the IBM OpenAPI validator.
 *
 * @typedef {object} validatorViolation
 * @property {string[]} path - List of OpenAPI specification YAML keys where the validation violation occurred
 * @property {string} message - Description of the validator violation
 * @property {string} rule - The validator rule
 * @property {number} line - The line on which the validator volition occurred
 */

/**
 * GitLab Code Quality report entry.
 *
 * @typedef {object} gitLabReportViolation
 * @property {string} description - Description of the code quality violation
 * @property {string} fingerprint - A unique fingerprint to identify the code quality violation
 * @property {string} severity - Violation severity (can be info, minor, major, critical, or blocker)
 * @property {object} location - Object containing the file path where the violation occurred
 * @property {string} location.path - The relative path to the file containing the code quality violation
 * @property {object} location.lines - Object containing violation location
 * @property {number} location.lines.begin - The line on which the code quality violation occurred
 */

/**
 * Converts IBM OpenAPI report violation to GitLab Code Quality report violation.
 *
 * @param {validatorViolation} validatorEntry Description of the validator violation and line where it occurred
 * @param {string} severity Violation severity (can be info, minor, major, critical, or blocker)
 * @param {string} specificationPath Filepath for the OpenAPI specification
 * @returns {gitLabReportViolation} GitLab Code Quality report entry
 */
const openapiToGitLabObject = (
  { message, line },
  severity,
  specificationPath
) => {
  const hash = createHash("md5");
  const fingerprint = hash
    .update(message)
    .update(line.toString())
    .digest("hex");

  return {
    description: message,
    fingerprint,
    severity,
    location: {
      path: specificationPath,
      lines: {
        begin: line,
      },
    },
  };
};

/**
 * Converts IBM OpenAPI Validator report to GitLab Code Quality report
 *
 * @param {validatorReport} validatorReport IBM OpenAPI validator report input
 * @param {string} specificationPath Filepath for the OpenAPI specification
 * @returns {gitLabReportViolation[]} GitLab Code Quality report output
 */
exports.convertValidatorReport = (validatorReport, specificationPath) => {
  const gitlabReport = [];

  if (validatorReport.errors) {
    const errors = validatorReport.errors.map((error) =>
      openapiToGitLabObject(error, "major", specificationPath)
    );

    gitlabReport.push(...errors);
  }

  if (validatorReport.warnings) {
    const warnings = validatorReport.warnings.map((warning) =>
      openapiToGitLabObject(warning, "minor", specificationPath)
    );

    gitlabReport.push(...warnings);
  }

  return gitlabReport;
};
