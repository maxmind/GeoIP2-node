/**
 * Converts snake_case to camelCase
 * @param {string} input - snake_case string
 * @returns {string} - camelCase string
 */
export function snakeToCamelCase(input: string): string {
  return input.replace(/_+(\w?)/g, (_, p, o) =>
    o === 0 ? p : p.toUpperCase()
  );
}

const isObject = (value: unknown) =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof RegExp) &&
  !(value instanceof Error) &&
  !(value instanceof Date);

// toCidr takes an IP and prefix length and returns a normalized CIDR.
export function toCidr(ip: string, prefixLen: number) {
  const isV6 = ip.includes(':');
  const isV4Mapped = isV6 && ip.includes('.');
  const cleanIp = isV4Mapped
    ? ip.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/, (_, v4) =>
        binaryToV6Part(ipToBinary(v4, false))
      )
    : ip;

  const binaryIp = ipToBinary(cleanIp, isV6);
  const binaryMasked = maskPrefix(binaryIp, prefixLen);
  const masked = isV6 ? binaryToV6(binaryMasked) : binaryToV4(binaryMasked);

  return `${masked}/${prefixLen}`;
}

// Convert IP address to binary string
function ipToBinary(ip: string, isV6: boolean): Uint8Array {
  if (isV6) {
    const octets = new Uint8Array(16);
    const fullSegments = expandIPv6(ip);
    for (let i = 0; i < 8; i++) {
      const s = parseInt(fullSegments[i], 16);
      octets[2 * i] = s >> 8;
      octets[2 * i + 1] = s & 0xff;
    }
    return octets;
  } else {
    return new Uint8Array(ip.split('.').map((octet) => parseInt(octet)));
  }
}

// Expand compressed IPv6 address
function expandIPv6(ip: string): string[] {
  const segments = ip.split(':');
  if (segments.length < 8) {
    const emptyIndex = segments.indexOf('');
    const zerosToAdd = 8 - segments.length + 1;
    return [
      ...segments.slice(0, emptyIndex),
      ...Array(zerosToAdd).fill('0'),
      ...segments.slice(emptyIndex + 1),
    ];
  }
  return segments;
}

// Apply prefix mask and return network address in binary
function maskPrefix(octets: Uint8Array, prefix: number) {
  const unchanged = Math.floor(prefix / 8);
  if (octets.length == unchanged) {
    return octets;
  }

  const masked = new Uint8Array(octets.length);

  for (let i = 0; i < unchanged; i++) {
    masked[i] = octets[i];
  }

  masked[unchanged] = octets[unchanged] & (0xff << (8 - (prefix % 8)));

  return masked;
}

// Convert binary network address back to IPv4 dotted-decimal notation
function binaryToV4(octets: Uint8Array): string {
  return octets.join('.');
}

// Convert binary network address back to IPv6 notation
function binaryToV6(octets: Uint8Array): string {
  if (octets.length !== 16) {
    throw new Error('Invalid input, IPv6 address requires exactly 16 octets.');
  }

  if (isV4Mapped(octets)) {
    return '::ffff:' + binaryToV4(octets.slice(12));
  }

  const [zeroStart, zeroEnd] = findLongestZeroRun(octets);

  if (zeroStart == zeroEnd) {
    return binaryToV6Part(octets);
  }

  return (
    binaryToV6Part(octets.slice(0, zeroStart)) +
    '::' +
    binaryToV6Part(octets.slice(zeroEnd))
  );
}

// Check if the octets are for an IP in ::ffff:0:0/96.
function isV4Mapped(octets: Uint8Array): boolean {
  return (
    octets[0] === 0 &&
    octets[1] === 0 &&
    octets[2] === 0 &&
    octets[3] === 0 &&
    octets[4] === 0 &&
    octets[5] === 0 &&
    octets[6] === 0 &&
    octets[7] === 0 &&
    octets[8] === 0 &&
    octets[9] === 0 &&
    octets[10] === 0xff &&
    octets[11] === 0xff
  );
}

// Converts an even-sized octet array to part of IPv6 presentation notation.
function binaryToV6Part(octets: Uint8Array): string {
  if (octets.length == 0) {
    return '';
  }
  const parts = new Array(octets.length / 2);
  for (let i = 0; i < parts.length; i++) {
    const first = octets[2 * i];
    const second = octets[2 * i + 1];
    if (first == 0) {
      parts[i] = second.toString(16);
    } else {
      parts[i] = first.toString(16) + second.toString(16).padStart(2, '0');
    }
  }

  return parts.join(':');
}

// Finds the longest run of zeros in the array, starting and ending on
// an even index.
function findLongestZeroRun(octets: Uint8Array) {
  let maxStart = 0;
  let maxLength = 0;
  let curStart = 0;
  let curLength = 0;

  for (let i = 0; i < octets.length / 2; i++) {
    if (octets[2 * i] === 0 && octets[2 * i + 1] === 0) {
      if (curLength === 0) {
        // Start of a new slice of zeros
        curStart = 2 * i;
      }
      curLength++;
    } else {
      if (curLength > maxLength) {
        maxLength = curLength;
        maxStart = curStart;
      }
      curLength = 0;
    }
  }

  if (curLength > maxLength) {
    maxLength = curLength;
    maxStart = curStart;
  }

  return [maxStart, maxStart + 2 * maxLength];
}

const processArray = (arr: Array<unknown>): unknown[] =>
  arr.map((el) =>
    Array.isArray(el)
      ? processArray(el)
      : isObject(el)
        ? camelcaseKeys(el as Record<string, unknown>)
        : el
  );

/**
 * Deeply clones an object and converts keys from snake_case to camelCase
 * @param input - object with some snake_case keys
 * @returns - object with camelCase keys
 */
export function camelcaseKeys(
  input: Record<string, unknown> | unknown[]
): Record<string, unknown> | unknown[] {
  if (Array.isArray(input)) {
    return processArray(input);
  }

  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (Array.isArray(value)) {
      output[snakeToCamelCase(key)] = processArray(value);
    } else if (isObject(value)) {
      output[snakeToCamelCase(key)] = camelcaseKeys(
        value as Record<string, unknown>
      );
    } else {
      output[snakeToCamelCase(key)] = value;
    }
  }

  return output;
}
