# gl-code-quality-openapi-validator

[![Build](https://github.com/J-R-Oliver/gl-code-quality-openapi-validator/actions/workflows/build.yml/badge.svg)](https://github.com/J-R-Oliver/gl-code-quality-openapi-validator/actions/workflows/build.yml)
[![npm version](https://badge.fury.io/js/gl-code-quality-openapi-validator.svg)](https://badge.fury.io/js/gl-code-quality-openapi-validator)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)
[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](http://unlicense.org/)
![NPM Downloads](https://img.shields.io/npm/dw/gl-code-quality-openapi-validator)


<table>
<tr>
<td>
GitLab Code Quality generator for IBM's OpenAPI Validator.
</td>
</tr>
</table>

## Intro

`gl-code-quality-openapi-validator` converts the JSON file output of
IBM's [OpenAPI Validator](https://github.com/IBM/openapi-validator)
to a [GitLab Code Quality](https://docs.gitlab.com/ee/user/project/merge_requests/code_quality.html) report JSON file.
This file can then be exposed from a GitLab CI/CD job as an artifact and used to display code quality changes directly
on the merge request.

## Contents

- [Installation](#installation)
- [Options](#options)
- [Local Development](#local-development)
- [Testing](#testing)
- [Conventional Commits](#conventional-commits)
- [GitHub Actions](#github-actions)

## Installation

To install this project you will need to have [Node.js](https://nodejs.org/en/) (`>=14.0.0`)
installed. `gl-code-quality-openapi-validator` has been tested on the current LTS versions, `14.0.X` and `16.0.X`.

To install `gl-code-quality-openapi-validator` using `npm` execute:

```shell
npm install -g gl-code-quality-openapi-validator
```

The `-g` option installs `gl-code-quality-openapi-validator` globally so that it can be run from anywhere in the file
system.

To execute `gl-code-quality-openapi-validator` after installing globally run:

```shell
gl-code-quality-openapi-validator
```

`gl-code-quality-openapi-validator` is designed to work
with the JSON file output of [IBM's OpenAPI Validator](https://github.com/IBM/openapi-validator). Instructions for
installation and usage can be found [here](https://github.com/IBM/openapi-validator#installation).

The following command runs `lint-openapi` against `openapi-spec.yml` and redirects the JSON output to
`openapi-validator-report.json`. `gl-code-quality-openapi-validator` is then able to convert this file into a GitLab
Code Quality report.

```shell
lint-openapi --json openapi-spec.yml >> openapi-validator-report.json
gl-code-quality-openapi-validator -s openapi-spec.yml 
```

## Options

`gl-code-quality-openapi-validator` has a handful of options. These options can be used to override the defaults that
have been provided. For example:

```shell
gl-code-quality-openapi-validator -s ./specification/openapi-specification.yml -i /reporting/openapi-validator-report.json -o ./code-quality/gl-code-quality-report.json
```

### Command Line Options

The following command line options are available for configuration:

| Option                               | Default                         | Description                                          |
|--------------------------------------|---------------------------------|------------------------------------------------------|
| -V, --version                        | 1.0.0                           | Output the version number                            |
| -s, --specification \<specification> | ./openapi-specification.yml     | Filepath for the OpenAPI specification               |
| -i, --input \<input>                 | ./openapi-validator-report.json | Filepath for the OpenAPI Validator JSON report input |
| -o, --output \<output>               | ./gl-code-quality-report.json   | Filepath for the GitLab Code Quality report output   |
| -h, --help                           |                                 | display help for command                             |

## Local Development

### Prerequisites

To install, run and modify this project you will need to have:

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com)

### Installation

To start, please `fork` and `clone` the repository to your local machine. You are able to run the service directly on
the command line or with your IDE of choice.

### Running

#### Command Line

To run the service from the command line first you need to install the dependencies, install the project locally, and
then execute `gl-code-quality-openapi-validator`.

```shell
npm install
npm install --global
gl-code-quality-openapi-validator
```

## Testing

All tests have been written using [Jest](https://jestjs.io). To run the tests execute:

```shell
npm test
```

Code coverage is also measured by `Jest` and set to a minimum of 95%. To run tests with coverage execute:

```shell
npm run test:coverage
```

Code coverage reports can be found in the `/coverage/` directory.

## Conventional Commits

This project uses the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit
messages. The specification provides a simple rule set for creating commit messages, documenting features, fixes, and
breaking changes in commit messages.

A [pre-commit](https://pre-commit.com) [configuration file](.pre-commit-config.yaml) has been provided to automate
commit linting. Ensure that *pre-commit* has been [installed](https://www.conventionalcommits.org/en/v1.0.0/) and
execute...

```shell
pre-commit install
````

...to add a commit [Git hook](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) to your local machine.

An automated pipeline job has been [configured](.github/workflows/build.yml) to lint commit messages on a push.

## GitHub Actions

CI/CD pipelines has been created using [GitHub Actions](https://github.com/features/actions) to automated tasks such as
linting, testing, and releasing.

### Build Workflow

The [build](./.github/workflows/build.yml) workflow handles integration tasks. This workflow consists of two jobs, `Git`
and `Node`, that run in parallel. This workflow is triggered on a push to a branch.

#### Git

This job automates tasks relating to repository linting and enforcing best practices.

#### Node

This job automates `Node.js` specific tasks.

### Release Workflow

The [release](./.github/workflows/release.yml) workflow handles release tasks. This workflow consists of one job, `npm`.
This workflow is triggered manually from
the [GitHub Actions UI](https://github.com/J-R-Oliver/gl-code-quality-openapi-validator/actions).

#### npm

This job automates tasks relating to updating [changelog](./CHANGELOG.md), and publishing
to [npm](https://www.npmjs.com).
