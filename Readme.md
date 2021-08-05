# Agrippa

Agrippa is a humble CLI, whose purpose is to assist React developers in creating components without the boilderplate.
It can easily generate templates for React components of different compositions (styling solutions, prop validations, etc.) and in different enviroments. 

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

Agrippa consists of two commands: `create` and `init`:

### Create
`agrippa create <name> [options]` is the core of the CLI - this command generates a new React component, based on the `name` and `options` passed to it.

#### Options:


### Init
`agrippa init` generates a basic `.agripparc.json` file, with some default values for options that agrippa accepts. 

## Using a config
In most projects, some options repeat themselves on most, if not all, components of the app. For example, if the codebase uses CSS modules as a styling solution, then the majority of component would be generated with `--styling css`. 

To avoid this unnecessary boilerplate, an `.agripparc.json` config file can be used. It's dead simple! simply call `agrippa init` at the root of your project, or create an empty `.agripparc.json` file, and edit its contents to match the desired defaults. <br/>
The config file's options are the same as the CLI's. The latter's options take precedence over the former's, which is useful for overriding the project's defaults when needed.

## License
[MIT](https://choosealicense.com/licenses/mit/)