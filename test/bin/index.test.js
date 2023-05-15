const { join } = require("path");
// eslint-disable-next-line security/detect-child-process
const { execSync } = require("child_process");
const { readFileSync } = require("fs");

describe("index.js tests", () => {
  describe("Entrypoint", () => {
    beforeAll(() => {
      execSync("npm install --global");
    });

    afterAll(() => {
      execSync("npm uninstall --global");
    });

    test("When passed a valid OpenAPI Validator report file produced by Version 0, then creates a valid GitLab Code Quality report file", () => {
      const validatorReportPath = join(
        __dirname,
        "/data/openapi-validator-report-v0.json"
      );
      const glReportPath = join(__dirname, "/data/gl-code-quality-report.json");
      const expectGLReportPath = join(
        __dirname,
        "/data/expected-gl-code-quality-report-v0.json"
      );

      execSync(
        `gl-code-quality-openapi-validator -s ./openapi-specification.yml -i ${validatorReportPath} -o ${glReportPath}`
      );

      const bufferActual = readFileSync(glReportPath);
      const gitLabReportActual = JSON.parse(bufferActual);

      const bufferExpected = readFileSync(expectGLReportPath);
      const gitLabReportExpected = JSON.parse(bufferExpected);

      expect(gitLabReportActual).toStrictEqual(gitLabReportExpected);
    });

    test("When passed a valid OpenAPI Validator report file produced by Version 1, then creates a valid GitLab Code Quality report file", () => {
      const validatorReportPath = join(
        __dirname,
        "/data/openapi-validator-report-v1.json"
      );
      const glReportPath = join(__dirname, "/data/gl-code-quality-report.json");
      const expectGLReportPath = join(
        __dirname,
        "/data/expected-gl-code-quality-report-v1.json"
      );

      execSync(
        `gl-code-quality-openapi-validator -s ./openapi-specification.yml -i ${validatorReportPath} -o ${glReportPath}`
      );

      const bufferActual = readFileSync(glReportPath);
      const gitLabReportActual = JSON.parse(bufferActual);

      const bufferExpected = readFileSync(expectGLReportPath);
      const gitLabReportExpected = JSON.parse(bufferExpected);

      expect(gitLabReportActual).toStrictEqual(gitLabReportExpected);
    });
  });
});
