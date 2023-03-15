export const stringConverter = (value: any): string | undefined => {
  if (value === undefined || typeof value === 'string') {
    return value;
  }

  return value.toString();
};

export const booleanConverter = (value: any): boolean | undefined => {
  if (value === undefined || typeof value === 'boolean') {
    return value;
  }

  return value.toString() === 'true';
};

export const numberConverter = (value: any): number | undefined => {
  if (value === undefined || typeof value === 'number') {
    return value;
  }

  return parseFloat(value.toString());
};
