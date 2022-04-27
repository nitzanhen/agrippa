
export enum Styling {
  CSS = 'css',
  SCSS = 'scss',
  JSS = 'jss',
  STYLED_COMPONENTS = 'styled-components',
  REACT_NATIVE = 'react-native'
}

export namespace Styling {

  const values = [
    Styling.CSS,
    Styling.SCSS,
    Styling.JSS,
    Styling.STYLED_COMPONENTS,
    Styling.REACT_NATIVE
  ];

  export function fromString(str: string): Styling | null {
    return values.find(sty => sty === str) ?? null;
  }
}
