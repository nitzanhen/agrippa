
export enum Styling {
  CSS = 'css',
  SCSS = 'scss',
  JSS = 'jss',
  STYLED_COMPONENTS = 'styled-components'
}

export namespace Styling {

  const values = [
    Styling.CSS,
    Styling.SCSS,
    Styling.JSS,
    Styling.STYLED_COMPONENTS
  ];

  export function fromString(str: string): Styling | null {
    return values.find(sty => sty === str) ?? null;
  }
}
