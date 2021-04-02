// Dynamic Provider for redux-saga-test-plan
// For more information about dynamic providers, please see
// http://redux-saga-test-plan.jeremyfairbank.com/integration-testing/mocking/dynamic-providers.html

// Here we make sure than no 'delay' effects will be executed by redux-saga middleware during our tests
export default jest.fn(({ fn }, next) => (fn.name === 'delayP') ? null : next());
