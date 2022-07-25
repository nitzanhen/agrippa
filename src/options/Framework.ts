
export enum Framework {
  REACT = 'react',
  SOLIDJS = 'solidjs',
  PREACT = 'preact',
  REACT_NATIVE = 'react-native',
}

export namespace Framework {

  const values = [
    Framework.REACT,
    Framework.SOLIDJS,
    Framework.PREACT,
    Framework.REACT_NATIVE
  ];

  export function fromString(str: string): Framework | null {
    return values.find(fw => fw === str) ?? null;
  }
}
