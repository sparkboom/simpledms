import React from 'react';
import SimplePage from '../../layout/SimplePage';
import Page from './Page';
import { StoryDefinition } from '../../types';

// Story Definition
const definition: StoryDefinition = {
  component: Page,
  title: 'Components/Header/Header',
  parameters: { notes: 'Header' },
  decorators: [Story => <SimplePage><Story /></SimplePage>],
};
export default definition;

// Stories

export const simplePage = () => {
  return <Page />;
};
simplePage.story = {
  name: 'Simple Page',
};
