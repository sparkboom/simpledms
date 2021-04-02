const useSelector = jest.fn((fn) => fn());
const dispatch = jest.fn();
const useDispatch = jest.fn(() => dispatch);
const connect = jest.fn(() => (cmp) => cmp);

export {
  useDispatch,
  useSelector,
  connect,
};
