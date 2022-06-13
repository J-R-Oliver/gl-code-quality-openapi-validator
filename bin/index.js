#!/usr/bin/env node
const { program } = require("commander");
const { readFileSync, writeFileSync } = require("fs");
const { convertValidatorReport } = require("../lib/generator");
const packageJson = require("../package.json");

/**
 * Commander action callback.
 *
 * @param {object} commanderOptions Object containing commander options
 * @param {string} commanderOptions.input Filepath for the OpenAPI Validator JSON report input
 * @param {string} commanderOptions.specification Filepath for the OpenAPI specification
 * @param {string} commanderOptions.output Filepath for the GitLab Code Quality report output
 */
const action = ({ input, specification, output }) => {
  console.log(`Reading OpenAPI Validator JSON report from ${input}`);
  const buffer = readFileSync(input);
  const validatorReport = JSON.parse(buffer);

  console.log("Converting report...");
  const gitlabReport = convertValidatorReport(validatorReport, specification);

  console.log(`Writing GitLab Code Quality report to ${output}`);
  const gitlabReportJson = JSON.stringify(gitlabReport, null, 2);
  writeFileSync(output, gitlabReportJson);
};

program
  .name("gl-code-quality-openapi-validator")
  .description("GitLab Code Quality generator for IBM's OpenAPI Validator.")
  .version(packageJson.version)
  .option(
    "-s, --specification <specification>",
    "filepath for the OpenAPI specification",
    "./openapi-specification.yml"
  )
  .option(
    "-i, --input <input>",
    "filepath for the OpenAPI Validator JSON report input",
    "./openapi-validator-report.json"
  )
  .option(
    "-o, --output <output>",
    "filepath for the GitLab Code Quality report output",
    "./gl-code-quality-report.json"
  )
  .action(action)
  .parse();
