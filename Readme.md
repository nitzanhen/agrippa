# Agrippa
[![npm](https://img.shields.io/npm/v/agrippa?logo=npm&color=CB3837)](https://www.npmjs.com/package/agrippa)
[![license](https://img.shields.io/github/license/nitzanhen/agrippa?color=yellow)](https://choosealicense.com/licenses/mit/)

Agrippa is a humble CLI, whose purpose is to assist React developers in creating components without the boilerplate.
It can easily generate templates for React components of different compositions (styling solutions, prop validations, etc.) and in different environments. 

[docs](https://github.com/NitzanHen/agrippa/wiki)

## v1.2.0

**Agrippa v1.2.0 is now officially out!! 🎉🎉** <br/>
It introduces a few new generation options, such as the option to generate a component as a function declaration (`function Component(props) ...`) and the option to export the component as a `default` export.
v1.2.0 also features a rewriting of the generation logic, in a way that would make generation easier to maintain, scale and test. Some standardized testing has also already been implemented.

To update to the new version, call `npm i -g agrippa`.
Read more about our release on [the release page](https://github.com/NitzanHen/agrippa/releases/tag/v1.2.0).

Also, [we have a Twitter account now](https://twitter.com/agrippa_cli)! It will post news, tips and more, check it out!

## Features
🚀 **Extremely easy to pick up** and use in both new and existing projects.<br/>
🐙 **Flexible** - agrippa strives to be useful in many different circumstances.<br/>
🧠 **Smart defaults** - agrippa can detect and set defaults based on your environment's configuration, with no extra steps. <br/>
⚙️ **Configurable** - by using a plain old JSON file.

## Docs 

This page contains useful information to get started with using Agrippa. 
All other documentation & guides can be found [on our wiki](https://github.com/NitzanHen/agrippa/wiki).

## Installation

```bash
npm install -g agrippa
# Or:
yarn global add agrippa
```

Alterntively, use:
```bash
npx agrippa [...]
# e.g.
npx agrippa gen top-bar 
```
using `npx`, the latest version is always used.

## Usage

Agrippa consists of two commands: `generate` (or `gen`) and `init`:

### Generate
`agrippa gen <name> [options]` is the core of the CLI - this command generates a new React component, based on the `name` and `options` passed to it.

`agrippa generate` is an alias of `agrippa gen`.

The options that `agrippa gen` accepts are listed in [The Complete List of Generation Options](https://github.com/NitzanHen/agrippa/wiki/The-Complete-List-of-Generation-Options), on our [wiki](https://github.com/NitzanHen/agrippa/wiki).

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
