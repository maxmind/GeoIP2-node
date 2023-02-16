/**
 * Converts snake_case to camelCase
 * @param {string} input - snake_case string
 * @param {string} exclude - `input` that contains `exclude` will be returned unmodified
 * @returns {string} - camelCase string
 */
export function snakeToCamelCase(input: string, exclude = '-'): string {
  // Return the input string unchanged if there are no underscores
  // or it includes the `exclude` character.
  if (!input.includes('_') || input.includes(exclude)) {
    return input;
  }
  // remove trailing/leading underscores
  let output = input.replace(/^_+/, '').replace(/_+$/, '');
  let currentIndex = output.indexOf('_');
  while (currentIndex !== -1) {
    output =
      output.slice(0, currentIndex) +
      output[currentIndex + 1].toUpperCase() +
      output.slice(currentIndex + 2);
    currentIndex = output.indexOf('_', currentIndex);
  }
  return output;
}

const isObject = (value: unknown) =>
  typeof value === 'object' &&
  value !== null &&
  !Array.isArray(value) &&
  !(value instanceof RegExp) &&
  !(value instanceof Error) &&
  !(value instanceof Date);

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
