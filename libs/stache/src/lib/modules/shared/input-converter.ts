export const stringConverter = (value: unknown): string | undefined => {
  if (value === undefined || typeof value === 'string') {
    return value;
  }

  if (value === null) {
    return undefined;
  }

  return value.toString();
};

export const booleanConverter = (value: unknown): boolean | undefined => {
  if (value === undefined || typeof value === 'boolean') {
    return value;
  }

  if (value === null) {
    return false;
  }

  return value.toString() === 'true';
};

export const numberConverter = (value: unknown): number | undefined => {
  if (value === undefined || typeof value === 'number') {
    return value;
  }

  if (value === null) {
    return undefined;
  }

  return parseFloat(value.toString());
};

export function InputConverter(converter: (value: unknown) => unknown) {
  return (target: unknown, key: string): void => {
    Object.defineProperty(target, key, {
      get: function () {
        return this['__' + key];
      },
      set: function (value) {
        this['__' + key] = converter(value);
      },
      enumerable: true,
      configurable: true,
    });
  };
}
