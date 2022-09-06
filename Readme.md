<table align="center">
  <tr>
    <td>
      <img src="agrippa.svg" align="center" width="150px" alt="Agrippa logo" />
    </td>
    <td align="center" width="400px">
        <h1 display="inline">Agrippa</h1>
        <p align="center">
        <a href="https://www.agrippa.dev/">Docs</a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://github.com/NitzanHen/agrippa">GitHub</a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://www.npmjs.com/package/agrippa">npm</a>
      </p>
    </td>
  </tr>
</table>



Agrippa is a humble CLI, whose purpose is to assist React developers in creating components without the boilerplate.
It can easily generate templates for React components of different compositions (styling solutions, prop validations, etc.) and in different environments. 

[docs](https://github.com/NitzanHen/agrippa/wiki)

## Features
🚀 **Extremely easy to pick up** and use in both new and existing projects.<br/>
🐙 **Flexible** - agrippa strives to be useful in many different circumstances.<br/>
🧠 **Smart defaults** - agrippa can detect and set defaults based on your environment's configuration, with no extra steps. <br/>
⚙️ **Configurable** - by using a plain old JSON file.

## v1.4.0

**Agrippa v1.4.0 is officially out!** <br/>

The new version introduces some cool new features:
- ***Agrippa's terminal UI has been revamped**!* hopefully you'll agree the new look is a lot more ✨*aesthetic*✨<br/><br/>
- **tsPropsDeclaration**: TS users can now select between `interface`s and `type`s for component props declarations.<br/>For more info, see [the docs on `tsPropsDeclaration`](https://github.com/NitzanHen/agrippa/wiki/The-complete-list-of-generation-options).<br/><br/>
- **Styled-components**: Agrippa now supports styling with `styled-components`! This is actually the second issue opened for Agrippa, and it's been open for quite a while now. t's truly nice to see it finally implemented. <br/>To check it out, use the value `styled-components` for the `styling` flag.<br/><br/>
- **New post-command variables**: two new variables, `<ComponentName>` and `<component-name>`, can now be used with post commands.<br/>The first is the generated component's name in pascal case (e.g. `NiceButton`), while the second is in kebab case (e.g. `nice-button`).<br/><br/>
- **Dependency cleanup**: two packages that Agrippa has been using up to now but didn't really need to were removed, and Agrippa should now be a little lighter.

Also, more tests were added, which is always nice.

>  To update, call `npm i -g agrippa`. <br/>
>  Please reach out with any bugs or feedback!

## Docs 

This page contains useful information to get started with using Agrippa. 
All other documentation & guides can be found [on our wiki](https://github.com/NitzanHen/agrippa/wiki).

Examples can be found among our [integration tests](https://github.com/NitzanHen/agrippa/tree/main/test/integration).

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

To avoid this unnecessary boilerplate, an `.agripparc.json` config file can be used. It's dead simple to set up! simply call `agrippa init` at the root of your project, or create a basic `.agripparc.json` file, and edit its contents to match the desired defaults. <br/>
The config file's options are the same as the CLI's. The latter's options take precedence over the former's, which is useful for overriding the project's defaults when needed.

> Note: many options - including *Typescript* & *React Native* - can be determined automatically by Agrippa, so they don't need to be specified in the config or at the command line.

## Community

My ambition is that Agrippa would become a tool that makes the lives of React developers easier, but perhaps more importantly one that they enjoy using. The tool's ease-of-use at the practical level is one aspect of that, but just as important is the cultivation of an active, positive community around it that developers feel welcome in.

Therefore, your thoughts, suggestions and collaboration are *most welcome!* <br/>
If you like Agrippa and want to see it grow, please spread its word! (and give it a ⭐)

## License
[MIT](https://choosealicense.com/licenses/mit/)
