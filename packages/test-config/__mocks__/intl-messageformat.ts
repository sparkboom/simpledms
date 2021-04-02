const mockIntlMessageFormat = jest.fn().mockImplementation((key, locale) => {
  return {
    format: jest.fn(values => `[${locale}]${key} ${JSON.stringify(values)}`),
  };
});

export default mockIntlMessageFormat;
