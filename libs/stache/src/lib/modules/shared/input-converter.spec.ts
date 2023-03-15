import {
  booleanConverter,
  numberConverter,
  stringConverter,
} from './input-converter';

describe('Input converters', () => {
  it('should convert values to a boolean', () => {
    const convertedTrue = booleanConverter('true');
    expect(convertedTrue).toBeTrue();

    const convertedFalse = booleanConverter('false');
    expect(convertedFalse).toBeFalse();

    const convertedUndefinedBoolean = booleanConverter(undefined);
    expect(convertedUndefinedBoolean).toBeUndefined();

    const nonStandardString = booleanConverter('thing');
    expect(nonStandardString).toBeFalse();
  });

  it('should convert values to a number', () => {
    const convertedNumber = numberConverter('7');
    expect(convertedNumber).toBe(7);

    const convertedUndefinedNumber = numberConverter(undefined);
    expect(convertedUndefinedNumber).toBeUndefined();

    const nonStandardNumber = numberConverter('thing');
    expect(nonStandardNumber).toBeNaN();
  });

  it('should convert values to a string', () => {
    const convertedNumberString = stringConverter(5);
    expect(convertedNumberString).toBe('5');

    const unconvertedString = stringConverter('hello');
    expect(unconvertedString).toBe('hello');

    const convertedUndefinedString = stringConverter(undefined);
    expect(convertedUndefinedString).toBeUndefined();

    const nonStandardString = stringConverter({ foo: 'bar' });
    expect(nonStandardString).toBe('[object Object]');
  });
});
