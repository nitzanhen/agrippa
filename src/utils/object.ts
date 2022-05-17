import { entries } from 'rhax';


export function merge<O1, O2>(o1: O1, o2: O2): O1 & O2;
export function merge(o1: any, o2: any) {
  if (!o1) {
    o1 = {};
  }

  for (const [key, value] of Object.entries(o2)) {
    if (typeof value === 'object' && value !== null) {
      if (!o1[key]) {
        o1[key] = {};
      }
      merge(o1[key], value);
    }
    else {
      o1[key] = value;
    }
  }

  return o1;
}

export function clone<O extends object>(o: O): O {
  return merge({}, o);
}

export function assignDefaults<O1 extends object, O2 extends object>(o1: O1, o2: O2): O1 & O2;
export function assignDefaults(o1: Record<string, any>, o2: Record<string, any>) {
  for (const [key, value] of entries(o2)) {
    if (value === undefined) {
      continue;
    }
    else if (typeof value === 'object' && value !== null) {
      if (typeof o1[key] !== 'object' || o1[key] === null) {
        o1[key] = {};
      }

      assignDefaults(o1[key], value);
    }
    else {
      o1[key] = value;
    }
  }

  return o1;
}


