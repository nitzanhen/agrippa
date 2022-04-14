
export enum Environment {
  REACT = 'react',
  SOLIDJS = 'solidjs',
  PREACT = 'preact',
  REACT_NATIVE = 'react-native',
}



export namespace Environment {

  const values = [
    Environment.REACT,
    Environment.SOLIDJS,
    Environment.PREACT,
    Environment.REACT_NATIVE
  ];

  export function fromString(str: string): Environment | null {
    return values.find(env => env === str) ?? null;
  }
}
