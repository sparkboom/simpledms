
const reactIntlRedux = jest.requireActual('react-intl-redux');

export const updateIntl = jest.fn(reactIntlRedux.updateIntl);

export default {
  ...reactIntlRedux,
  updateIntl
};
