# Agrippa
[![npm](https://img.shields.io/npm/v/agrippa?logo=npm&color=CB3837)](https://www.npmjs.com/package/agrippa)
[![license](https://img.shields.io/github/license/nitzanhen/agrippa?color=yellow)](https://choosealicense.com/licenses/mit/)

Agrippa is a humble CLI, whose purpose is to assist React developers in creating components without the boilerplate.
It can easily generate templates for React components of different compositions (styling solutions, prop validations, etc.) and in different environments. 

## v1.1.0

**The first RC of Agrippa v1.1.0 is now out!** 
It introduces two new major features: *base component directories* and *post commands*. Read all about [it in the release page](https://github.com/NitzanHen/agrippa/releases/tag/1.1.0-rc.1).

The official release will take place in a few days. To try it out now, install with `npm i -g agrippa@next`.
You can check the code out [in the v1.1.0 branch](https://github.com/NitzanHen/agrippa/tree/v1.1.0).

Also, we have a wiki now! The home page is still not complete, but [check the wiki out anyway](https://github.com/NitzanHen/agrippa/wiki).

## Features
🚀 **Extremely easy to pick up** and use in both new and existing projects.<br/>
🐙 **Flexible** - agrippa strives to be useful in many different circumstances.<br/>
🧠 **Smart defaults** - agrippa can detect and set defaults based on your environment's configuration, with no extra steps. <br/>
⚙️ **Configurable** - by using a plain old JSON file.

## Installation

```bash
npm install -g agrippa
# Or:
yarn global add agrippa
```

## Usage

Agrippa consists of two commands: `generate` (or `gen`) and `init`:

### Generate
`agrippa generate <name> [options]` is the core of the CLI - this command generates a new React component, based on the `name` and `options` passed to it.

`agrippa gen` is an alias of `generate`.

#### Options
| option             | aliases             | type                                 | description                                                                                  | default                                                                                                                                                        |
|--------------------|---------------------|--------------------------------------|----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--props`          |                     | `ts`, `jsdoc`,  `prop-types`, `none` | Which prop declaration/validation to generate                                                | `ts` if the CLI manages to find a `tsconfig.json` file,  `none` otherwise.                                                                                     |
| `--children`       |                     | boolean                              | Whether the component is meant to have children or not                                       | `false`                                                                                                                                                        |
| `--typescript`     |  `--ts`             | boolean                              | Whether to use Typescript                                                                    | `true` if the CLI manages to find a `tsconfig.json` file,  false otherwise.                                                                                    |
| `--flat`           |                     | boolean                              | Whether to generate files in the current directory (true)  or create a new directory (false) | `false`                                                                                                                                                        |
| `--styling`        |                     | `css`, `scss`, `jss`, `mui`, `none`  | Which styling boilerplate to generate                                                        | `none`                                                                                                                                                         |
| `--styling-module` |  `--stylingModule`  | boolean                              | Relevant for `css` or `scss` styling. If true, generates a scoped `module` stylesheet        | `true`                                                                                                                                                         |
| `--import-react`   |  `--importReact`    | boolean                              | Whether to import `React` at the top of the generate component                               | `true` if the CLI manages to find a `tsconfig.json` file and it has a `jsx` field under `compilerOptions` with `react-jsx` or `react-jsxdev`. False otherwise. |
| `--overwrite`      |                     | boolean                              | Whether to overwrite existing files when generating, if any are found                        | `false`.                                                                                                                                                       |
### Init
`agrippa init` generates a basic `.agripparc.json` file, with some default values for options that agrippa accepts.  

## Using a config
In most projects, some options repeat themselves on most, if not all, components of the app. For example, if the codebase uses CSS modules as a styling solution, then the majority of component would be generated with `--styling css`. 

To avoid this unnecessary boilerplate, an `.agripparc.json` config file can be used. It's dead simple to set up! simply call `agrippa init` at the root of your project, or create an empty `.agripparc.json` file, and edit its contents to match the desired defaults. <br/>
The config file's options are the same as the CLI's. The latter's options take precedence over the former's, which is useful for overriding the project's defaults when needed.

## License
[MIT](https://choosealicense.com/licenses/mit/)
