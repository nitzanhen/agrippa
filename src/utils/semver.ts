const semverRegex = /(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-.]+))?(?:\+[0-9A-Za-z-.]+)?/i;

interface ParsedSemver {
  major: number;
  minor: number;
  patch: number;
  preRelease?: (string | number)[];
  metadata?: string;
}

export const parseSemver = (semver: string): ParsedSemver | null => {
  const match = semverRegex.exec(semver);
  if (match === null) {
    return null;
  }

  const [, majorString, minorString, patchString, preReleaseString, metadata] = match;

  const [major, minor, patch] = [parseInt(majorString), parseInt(minorString), parseInt(patchString)];
  const preRelease = preReleaseString?.split('.').map(identifier => parseInt(identifier) || identifier);

  return { major, minor, patch, preRelease, metadata };

};

export const compareSemver = (v1: string, v2: string) => {
  const [s1, s2] = [parseSemver(v1), parseSemver(v2)];
  if (s1 === s2) return 0;
  else if (s1 === null) return 1;
  else if (s2 === null) return -1;

  // Compare major, minor, patch versions
  for (const key of ['major', 'minor', 'patch'] as const) {
    const [d1, d2] = [s1[key], s2[key]];
    if (d1 === d2) {
      continue;
    }

    return d1 < d2 ? 1 : -1;
  }

  // Compare pre-release
  if (s1.preRelease || s2.preRelease) {
    if (!s1.preRelease?.length) {
      // s2 has a pre-release, s1 doesn't
      return s1;
    }
    if (!s2.preRelease?.length) {
      // s1 has a pre-release, s2 doesn't
      return s2;
    }

    const [pr1, pr2] = [s1.preRelease!, s2.preRelease!];

    // both have a pre-release
    const preReleaseLength = Math.max(pr1.length, pr2.length);
    for (let i = 0; i < preReleaseLength; i++) {
      const [id1, id2] = [pr1[i], pr2[i]];

      if (id1 === id2) continue;
      else if (id1 === undefined) return id2;
      else if (id2 === undefined) return id1;

      const [type1, type2] = [typeof id1, typeof id2];
      if (type1 !== type2) {
        // One is a string and one's a number; the string is greater
        return type2 === 'string' ? 1 : -1;
      }

      // ids are different, but of the same type. compare regularily.
      return id1 < id2 ? 1 : -1;
    }
  }

  return 0;
};