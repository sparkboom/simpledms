/* eslint-disable import/no-extraneous-dependencies */
const React = require('react');
const { configure, shallow, render, mount } = require('enzyme');
const EnzymeAdapter = require('enzyme-adapter-react-16');
const registerRequireContextHook = require('babel-plugin-require-context-hook/register');

// As we're running tests in an jsdom environment, canvas is not supported out-of-the-box
// The test runner will complain that getContext isn't implemented, we can resolve this issue
// with the following 'mock' to the prototype implementation.
HTMLCanvasElement.prototype.getContext = () => {};

// Register require.context hook so that .storybook/config.js can be executed when using StoryShots
registerRequireContextHook();

// Configure Enzyme
configure({ adapter: new EnzymeAdapter() })

// Helpers
function runHook(hookFn: Function): any {
  const HookWrapper = props => (<div hook={props.hook()} />);
  return shallow(<HookWrapper hook={hookFn} />).find('div').props().hook;
};

// Assign React & Enzyme globals
Object.assign(global, {
  React,
  shallow,
  render,
  mount,
  runHook,
});
global.process.env.NODE_ENV = 'production';
