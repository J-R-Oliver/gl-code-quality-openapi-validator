const { convertValidatorReport } = require("../../lib/generator");

describe("generator.js tests", () => {
  describe("convertValidatorReport tests", () => {
    test("When passed a report with no errors or warnings then returns an empty array", () => {
      const reportInput = {
        version: "0.80.0",
      };

      const gitlabReport = convertValidatorReport(
        reportInput,
        "./openapi-specification.yml"
      );

      expect(gitlabReport).toBeInstanceOf(Array);
      expect(gitlabReport).toHaveLength(0);
    });

    test("When passed a report with empty errors then returns an empty array", () => {
      const reportInput = {
        version: "0.80.0",
        errors: [],
      };

      const gitlabReport = convertValidatorReport(
        reportInput,
        "./openapi-specification.yml"
      );

      expect(gitlabReport).toBeInstanceOf(Array);
      expect(gitlabReport).toHaveLength(0);
    });

    test("When passed a report with empty warnings then returns an empty array", () => {
      const reportInput = {
        version: "0.80.0",
        warnings: [],
      };

      const gitlabReport = convertValidatorReport(
        reportInput,
        "./openapi-specification.yml"
      );

      expect(gitlabReport).toBeInstanceOf(Array);
      expect(gitlabReport).toHaveLength(0);
    });

    test("When passed a report with errors then returns an array containing converted errors", () => {
      const reportInput = {
        version: "0.80.0",
        errors: [
          {
            path: ["paths", "/api", "get", "responses", "200"],
            message:
              '"200" property must have required property "description".',
            rule: "oas3-schema",
            line: 22,
          },
          {
            path: [
              "components",
              "responses",
              "InternalServerError",
              "content",
              "application/json",
              "schema",
            ],
            message: '"properties" property type must be object.',
            rule: "oas3-schema",
            line: 77,
          },
        ],
      };

      const gitlabReportExpected = [
        {
          description:
            '"200" property must have required property "description".',
          fingerprint: "e15ad0a6144cdd30fe2446eee4e43198",
          severity: "major",
          location: {
            path: "./openapi-specification.yml",
            lines: {
              begin: 22,
            },
          },
        },
        {
          description: '"properties" property type must be object.',
          fingerprint: "0bb468c6d0ee704a851f35a5b6ada867",
          severity: "major",
          location: {
            path: "./openapi-specification.yml",
            lines: {
              begin: 77,
            },
          },
        },
      ];

      const gitlabReport = convertValidatorReport(
        reportInput,
        "./openapi-specification.yml"
      );

      expect(gitlabReport).toHaveLength(2);
      expect(gitlabReport).toStrictEqual(gitlabReportExpected);
    });

    test("When passed a report with warnings then returns an array with converted warnings", () => {
      const reportInput = {
        version: "0.80.0",
        warnings: [
          {
            path: ["paths", "/api", "get"],
            message:
              'Operation "description" must be present and non-empty string.',
            rule: "operation-description",
            line: 17,
          },
          {
            path: ["paths", "/api", "get", "operationId"],
            message: "Operation ids must be snake case",
            rule: "operation-id-case-convention",
            line: 18,
          },
        ],
      };

      const gitlabReportExpected = [
        {
          description:
            'Operation "description" must be present and non-empty string.',
          fingerprint: "0c1335ec845514387aa2b2c00577bb4f",
          severity: "minor",
          location: {
            path: "./openapi-specification.yml",
            lines: {
              begin: 17,
            },
          },
        },
        {
          description: "Operation ids must be snake case",
          fingerprint: "d378337650ad01c50618e91a0ccde0e0",
          severity: "minor",
          location: {
            path: "./openapi-specification.yml",
            lines: {
              begin: 18,
            },
          },
        },
      ];

      const gitlabReport = convertValidatorReport(
        reportInput,
        "./openapi-specification.yml"
      );

      expect(gitlabReport).toHaveLength(2);
      expect(gitlabReport).toStrictEqual(gitlabReportExpected);
    });

    test("When passed a report with errors and warnings then returns an array with converted errors and warnings", () => {
      const reportInput = {
        version: "0.80.0",
        errors: [
          {
            path: ["paths", "/api", "get", "responses", "200"],
            message:
              '"200" property must have required property "description".',
            rule: "oas3-schema",
            line: 22,
          },
          {
            path: [
              "components",
              "responses",
              "InternalServerError",
              "content",
              "application/json",
              "schema",
            ],
            message: '"properties" property type must be object.',
            rule: "oas3-schema",
            line: 77,
          },
        ],
        warnings: [
          {
            path: ["paths", "/api", "get"],
            message:
              'Operation "description" must be present and non-empty string.',
            rule: "operation-description",
            line: 17,
          },
          {
            path: ["paths", "/api", "get", "operationId"],
            message: "Operation ids must be snake case",
            rule: "operation-id-case-convention",
            line: 18,
          },
        ],
      };

      const gitlabReportExpected = [
        {
          description:
            '"200" property must have required property "description".',
          fingerprint: "e15ad0a6144cdd30fe2446eee4e43198",
          severity: "major",
          location: {
            path: "./openapi-specification.yml",
            lines: {
              begin: 22,
            },
          },
        },
        {
          description: '"properties" property type must be object.',
          fingerprint: "0bb468c6d0ee704a851f35a5b6ada867",
          severity: "major",
          location: {
            path: "./openapi-specification.yml",
            lines: {
              begin: 77,
            },
          },
        },
        {
          description:
            'Operation "description" must be present and non-empty string.',
          fingerprint: "0c1335ec845514387aa2b2c00577bb4f",
          severity: "minor",
          location: {
            path: "./openapi-specification.yml",
            lines: {
              begin: 17,
            },
          },
        },
        {
          description: "Operation ids must be snake case",
          fingerprint: "d378337650ad01c50618e91a0ccde0e0",
          severity: "minor",
          location: {
            path: "./openapi-specification.yml",
            lines: {
              begin: 18,
            },
          },
        },
      ];

      const gitlabReport = convertValidatorReport(
        reportInput,
        "./openapi-specification.yml"
      );

      expect(gitlabReport).toHaveLength(4);
      expect(gitlabReport).toStrictEqual(gitlabReportExpected);
    });

    test("When passed a report then input report is not mutated", () => {
      const reportInput = {
        version: "0.80.0",
        errors: [
          {
            path: ["paths", "/api", "get", "responses", "200"],
            message:
              '"200" property must have required property "description".',
            rule: "oas3-schema",
            line: 22,
          },
        ],
        warnings: [
          {
            path: ["paths", "/api", "get"],
            message:
              'Operation "description" must be present and non-empty string.',
            rule: "operation-description",
            line: 17,
          },
        ],
      };

      const inputControl = { ...reportInput };

      convertValidatorReport(reportInput, "./openapi-specification.yml");

      expect(reportInput).toStrictEqual(inputControl);
    });
  });
});
