import path from 'path';
import { shallow } from 'enzyme';
import { createSerializer } from 'enzyme-to-json';
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots({
  framework: 'react',
  configPath: path.resolve(__dirname, '../../.storybook'),
  renderer: shallow,
  snapshotSerializers: [createSerializer()],
});
