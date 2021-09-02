# Agrippa
[![npm](https://img.shields.io/npm/v/agrippa?logo=npm&color=CB3837)](https://www.npmjs.com/package/agrippa)
[![license](https://img.shields.io/github/license/nitzanhen/agrippa?color=yellow)](https://choosealicense.com/licenses/mit/)

Agrippa is a humble CLI, whose purpose is to assist React developers in creating components without the boilerplate.
It can easily generate templates for React components of different compositions (styling solutions, prop validations, etc.) and in different environments. 

## v1.1.0

**Agrippa v1.1.0 is now out!** <br/>
It introduces two new major features: *base component directories* and *post commands*. Read all about [it in the release page](https://github.com/NitzanHen/agrippa/releases/tag/v1.1.0).

To update, call `npx agrippa [...]` (with the usual commands and options), or install it with `npm i -g agrippa@next`.

Also, we have a wiki now! The home page is still not complete, but [check the wiki out anyway](https://github.com/NitzanHen/agrippa/wiki).

## Features
🚀 **Extremely easy to pick up** and use in both new and existing projects.<br/>
🐙 **Flexible** - agrippa strives to be useful in many different circumstances.<br/>
🧠 **Smart defaults** - agrippa can detect and set defaults based on your environment's configuration, with no extra steps. <br/>
⚙️ **Configurable** - by using a plain old JSON file.

## Installation

Recommended use:
```bash
npx agrippa [...]
# e.g.
npx agrippa gen top-bar 
```
using `npx`, the latest version is always used.

Alterntively, install Agrippa globally:

```bash
npm install -g agrippa
# Or:
yarn global add agrippa
```

then use normally.

## Usage

Agrippa consists of two commands: `generate` (or `gen`) and `init`:

### Generate
`agrippa generate <name> [options]` is the core of the CLI - this command generates a new React component, based on the `name` and `options` passed to it.

`agrippa gen` is an alias of `generate`.

#### Options
| option                 | aliases              | type                                 | description                                                                                                                 | default                                                                                                                                                        |
|------------------------|----------------------|--------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--props`              |                      | `ts`, `jsdoc`,  `prop-types`, `none` | Which prop declaration/validation to generate.                                                                              | `ts` if the CLI manages to find a `tsconfig.json` file,  `none` otherwise.                                                                                     |
| `--children`           |                      | boolean                              | Whether the component is meant to have children or not.                                                                     | `false`                                                                                                                                                        |
| `--typescript`         |  `--ts`              | boolean                              | Whether to use Typescript.                                                                                                  | `true` if the CLI manages to find a `tsconfig.json` file,  false otherwise.                                                                                    |
| `--flat`               |                      | boolean                              | Whether to generate files in the current directory (true)  or create a new directory (false)                                | `false`                                                                                                                                                        |
| `--styling`            |                      | `css`, `scss`, `jss`, `mui`, `none`  | Which styling boilerplate to generate. This would typically be specified in a  config.                                      | `none`                                                                                                                                                         |
| `--styling-module`     |  `--stylingModule`   | boolean                              | Relevant for `css` or `scss` styling. If true, generates a scoped `module` stylesheet.                                      | `true`                                                                                                                                                         |
| `--import-react`       |  `--importReact`     | boolean                              | Whether to import `React` at the top of the generate component.                                                             | `true` if the CLI manages to find a `tsconfig.json` file and it has a `jsx` field under `compilerOptions` with `react-jsx` or `react-jsxdev`. False otherwise. |
| `--overwrite`          |                      | boolean                              | Whether to overwrite existing files when generating, if any are found.                                                      | `false`.                                                                                                                                                       |
| `--post-command`       | `--postCommand`      | string                               | A command to run after a component was successfully generated.                                                              | none.                                                                                                                                                          |
| `--base-dir`           | `--baseDir`          | string (path)                        | Path to a base directory which components should be generated in or relative to.                                            | The current working directory.                                                                                                                                 |
| `--destination`        | `--dest`             | string (path)                        | The path in which the component folder/files should be generated, relative to `baseDir`.                                    | `'.'` (Resolves to `baseDir`)                                                                                                                                  |
| `--allow-outside-base` | `--allowOutsideBase` | boolean                              | By default, Agrippa prevent the user from creating components outside `baseDir`. This flag, when set, allows this behavior. | `false`                                                                                                                                                        |
| `--debug`              |                      | boolean                              | Logs much additional, important information.                                                                                | `false`                                                                                                                                                        |                                                                                                                                                      |
### Init
`agrippa init` generates a basic `.agripparc.json` file, with some default values for options that agrippa accepts.  

## Using a config
In most projects, some options repeat themselves on most, if not all, components of the app. For example, if the codebase uses CSS modules as a styling solution, then the majority of component would be generated with `--styling css`. 

To avoid this unnecessary boilerplate, an `.agripparc.json` config file can be used. It's dead simple to set up! simply call `agrippa init` at the root of your project, or create an empty `.agripparc.json` file, and edit its contents to match the desired defaults. <br/>
The config file's options are the same as the CLI's. The latter's options take precedence over the former's, which is useful for overriding the project's defaults when needed.

## Community

My ambition is that Agrippa would become a tool that makes the lives of React developers easier, but perhaps more importantly one that they enjoy using. The tool's ease-of-use at the practical level is one aspect of that, but just as important is the cultivation of an active, positive community around it that developers feel welcome in.

Therefore, your thoughts, suggestions and collaboration are *most welcome!* <br/>
If you like Agrippa and want to see it grow, please spread its word! (and give it a ⭐)

## License
[MIT](https://choosealicense.com/licenses/mit/)
