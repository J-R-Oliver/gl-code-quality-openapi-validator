const { createHash } = require("node:crypto");

/**
 * Report created by IBM OpenAPI validator.
 *
 * @typedef {object} validatorReport
 * @property {string} version - IBM OpenAPI validator version
 * @property {validatorViolation[]} errors - List of errors (present in v0 of openapi-validator)
 * @property {validatorV1ViolationResult[]} error - List of error results (present in v1 of openapi-validator)
 * @property {validatorViolation[]} warnings - List of warnings (present in v0 of openapi-validator)
 * @property {validatorV1ViolationResult[]} warning - List of warning results in (present v1 of openapi-validator)
 */

/**
 * Report created by IBM OpenAPI validator v0.
 *
 * @typedef {object} validatorReportV0
 * @property {string} version - IBM OpenAPI validator version
 * @property {validatorViolation[]} errors - List of errors (present in v0 of openapi-validator)
 * @property {validatorViolation[]} warnings - List of warnings (present in v0 of openapi-validator)
 */

/**
 * Report created by IBM OpenAPI validator v1.
 *
 * @typedef {object} validatorReportV1
 * @property {validatorV1ViolationResult[]} error - List of error results
 * @property {validatorV1ViolationResult[]} warning - List of warning results
 * @property {validatorV1ViolationResult[]} info - List of info results
 * @property {validatorV1ViolationResult[]} hint - List of hint results
 * @property {boolean} hasResults - A convenience flag indicating there is at least one result at any severity level
 */

/**
 * An error or warning result object produced by V1 of the IBM OpenAPI validator.
 *
 * @typedef {object} validatorV1ViolationResult
 * @property {validatorViolation[]} results - List of error or warning objects
 * @property {validatorV1Summary} summary - The summary of results
 */

/**
 * A summary of errors and warnings produced by V1 of the IBM OpenAPI validator
 *
 * @typedef {object} validatorV1Summary
 * @property {number} total - Total errors or warnings found
 * @property {validatorV1SummaryEntries} entries - A count of errors or warnings
 */

/**
 * A summary of errors and warnings produced by V1 of the IBM OpenAPI validator
 *
 * @typedef {object} validatorV1SummaryEntries
 * @property {string} generalizedMessage - General message associated with the error or warning
 * @property {number} count - Number of times a given error or warning was found
 * @property {number} percentage - Percentage representation of how many times a given error or warning was found
 */

/**
 * Summary of results produced by V1 of the IBM OpenAPI validator.
 *
 * @typedef {object} validatorReport
 * @property {string} version - IBM OpenAPI validator version
 * @property {validatorViolation[]} errors - List of errors in v0 of openapi-validator
 * @property {validatorV1ViolationResult[]} error - List of error results in v1 of openapi-validator
 * @property {validatorViolation[]} warnings - List of warnings in v0 of openapi-validator
 * @property {validatorV1ViolationResult[]} warning - List of warning results in v1 of openapi-validator
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
 * Converts IBM OpenAPI Validator V1 report to GitLab Code Quality report
 *
 * @param {validatorReportV1} validatorReport IBM OpenAPI validator report input
 * @param {string} specificationPath Filepath for the OpenAPI specification
 * @returns {gitLabReportViolation[]} GitLab Code Quality report output
 */
const convertV1ValidatorReport = (validatorReport, specificationPath) => {
  const {
    error: {
      results: errorResults = []
    } = {},
    warning: {
      results: warningResults = []
    } = {},
  } = validatorReport;

  const errors = errorResults.map((error) =>
    openapiToGitLabObject(error, "major", specificationPath)
  );

  const warnings = warningResults.map((warning) =>
    openapiToGitLabObject(warning, "minor", specificationPath)
  );

  return [
    ...errors,
    ...warnings,
  ];
}

/**
 * Converts IBM OpenAPI Validator V0 report to GitLab Code Quality report
 *
 * @param {validatorReportV0} validatorReport IBM OpenAPI validator report input
 * @param {string} specificationPath Filepath for the OpenAPI specification
 * @returns {gitLabReportViolation[]} GitLab Code Quality report output
 */
const convertV0ValidatorReport = (validatorReport, specificationPath) => {
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
}

/**
 * Converts IBM OpenAPI Validator report to GitLab Code Quality report
 *
 * @param {validatorReport} validatorReport IBM OpenAPI validator report input
 * @param {string} specificationPath Filepath for the OpenAPI specification
 * @returns {gitLabReportViolation[]} GitLab Code Quality report output
 */
exports.convertValidatorReport = (validatorReport, specificationPath) => {
  if (validatorReport.error || validatorReport.warning) {
    return convertV1ValidatorReport(validatorReport, specificationPath)
  }

  return convertV0ValidatorReport(validatorReport, specificationPath);
};
