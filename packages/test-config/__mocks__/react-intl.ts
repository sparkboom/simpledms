export const useIntl = jest.fn(() => ({
  formatMessage: jest.fn(({id}) => `{text @ ${id}}`),
}));

const FormattedMessage = () => '<FormattedMessage />';

export {
  FormattedMessage,
};

export default {
  useIntl,
  FormattedMessage,
};
