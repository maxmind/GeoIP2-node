import { snakeToCamelCase, camelcaseKeys } from './utils';

describe('src/Utils', () => {
  describe('snakeToCamelCase()', () => {
    it('correctly converts snake_case to camelCase', () => {
      const cases = [
        { input: 'snake_case', expected: 'snakeCase' },
        { input: 'camel_case_party_time', expected: 'camelCasePartyTime' },
        {
          input: 'really_long_snake_case_input_string_time',
          expected: 'reallyLongSnakeCaseInputStringTime',
        },
      ];
      cases.forEach((testCase) => {
        expect(snakeToCamelCase(testCase.input)).toEqual(testCase.expected);
      });
    });

    it('correctly handles double underscore, leading or trailing underscore', () => {
      const cases = [
        { input: 'snake__case', expected: 'snakeCase' },
        { input: '_camel_case_party_time', expected: 'camelCasePartyTime' },
        {
          input: 'really_long_snake_case_input_string_time_',
          expected: 'reallyLongSnakeCaseInputStringTime',
        },
      ];
      cases.forEach((testCase) => {
        expect(snakeToCamelCase(testCase.input)).toEqual(testCase.expected);
      });
    });

    it('returns strings containing "-" unchanged', () => {
      const cases = [
        { input: 'snake-case', expected: 'snake-case' },
        { input: 'camel-case-party-time', expected: 'camel-case-party-time' },
        {
          input: 'en-GB',
          expected: 'en-GB',
        },
      ];
      cases.forEach((testCase) => {
        expect(snakeToCamelCase(testCase.input)).toEqual(testCase.expected);
      });
    });

    it('preserves existing camel casing', () => {
      const cases = [
        { input: '_existingCamelCase', expected: 'existingCamelCase' },
        { input: 'camelCase_party_time', expected: 'camelCasePartyTime' },
        {
          input: 'mixed_caseString_example',
          expected: 'mixedCaseStringExample',
        },
      ];
      cases.forEach((testCase) => {
        expect(snakeToCamelCase(testCase.input)).toEqual(testCase.expected);
      });
    });
  });
  describe('camelcaseKeys()', () => {
    it("converts an object's keys from snake_case to camelCase", () => {
      const cases = [
        { input: { snake_case: 1 }, expected: { snakeCase: 1 } },
        {
          input: { snake_case: 1, another_snake_case: 2 },
          expected: { snakeCase: 1, anotherSnakeCase: 2 },
        },
      ];
      cases.forEach((testCase) => {
        expect(camelcaseKeys(testCase.input)).toEqual(testCase.expected);
      });
    });

    it("converts a nested object's keys from snake_case to camelCase", () => {
      const cases = [
        {
          input: { snake_case_: { ab_cd: 1 } },
          expected: { snakeCase: { abCd: 1 } },
        },
        {
          input: { snake_case: { 'en-GB': 1 } },
          expected: { snakeCase: { 'en-GB': 1 } },
        },
        {
          input: { 'en-GB': { _snake_case_plus: { another__one: 1 } } },
          expected: { 'en-GB': { snakeCasePlus: { anotherOne: 1 } } },
        },
        {
          input: {
            'en-GB': { _snake_case_plus: { another__one: { yet_another: 1 } } },
          },
          expected: {
            'en-GB': { snakeCasePlus: { anotherOne: { yetAnother: 1 } } },
          },
        },
      ];
      cases.forEach((testCase) => {
        expect(camelcaseKeys(testCase.input)).toEqual(testCase.expected);
      });
    });

    it('converts keys of objects contained in an array', () => {
      const cases = [
        {
          input: { snake_case_: { ab_cd: [{ qwerty_dvorak: 1 }] } },
          expected: { snakeCase: { abCd: [{ qwertyDvorak: 1 }] } },
        },
        {
          input: {
            snake_case_: [
              { ab_cd: [{ qwerty_dvorak: 1 }] },
              'dont_change_me',
              { zxy_wt: [7, { _pp: 42, llll_mmm: 'aa_aa' }] },
            ],
            case_snake: {
              _snake_camel: [
                { mn_op_qr_st: [[{ obj_key: ['a', 7, { key_obj_: 99 }] }]] },
              ],
            },
          },
          expected: {
            snakeCase: [
              { abCd: [{ qwertyDvorak: 1 }] },
              'dont_change_me',
              { zxyWt: [7, { pp: 42, llllMmm: 'aa_aa' }] },
            ],
            caseSnake: {
              snakeCamel: [
                { mnOpQrSt: [[{ objKey: ['a', 7, { keyObj: 99 }] }]] },
              ],
            },
          },
        },
        {
          input: [
            42,
            { snake_case_: { ab_cd: [{ qwerty_dvorak: 1 }] } },
            '180',
          ],
          expected: [42, { snakeCase: { abCd: [{ qwertyDvorak: 1 }] } }, '180'],
        },
      ];
      cases.forEach((testCase) => {
        expect(camelcaseKeys(testCase.input)).toEqual(testCase.expected);
      });
    });
  });
});
