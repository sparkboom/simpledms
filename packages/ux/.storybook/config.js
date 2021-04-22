import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { themes } from '@storybook/theming';
import { withA11y } from '@storybook/addon-a11y';
import { withKnobs, select } from '@storybook/addon-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import GlobalDecorator from '../src/style/global';
import "semantic-ui-css/semantic.min.css";

addDecorator(withKnobs);
addDecorator(withA11y);
addDecorator(Story => <React.StrictMode><GlobalDecorator><Story /></GlobalDecorator></React.StrictMode>);

addParameters({
  a11y: {
    config: {},
    options: {
      checks: { 'color-contrast': { options: { noScroll: true } } },
      restoreScroll: true,
    },
  },

  options: {
    brandTitle: 'Simple DMS',
    brandUrl: 'https://github.com/sparkboom/simpledms',
    hierarchySeparator: /\/|\./,
    hierarchyRootSeparator: '|',
    theme: themes.dark,
    storySort: (a, b) => {
      return a[1].kind === b[1].kind ? 0 : a[1].id.localeCompare(b[1].id, { numeric: true });
    },
  },

  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      salesforceMin: {
        name: 'Salesforce - Minimum',
        styles: {
          width: '1280px',
          height: '720px',
        },
      },
      appleMacPro1: {
        name: 'Apple Macbook Pro - Scale 1',
        styles: {
          width: '1024px',
          height: '640px',
        },
      },
      appleMacPro2: {
        name: 'Apple Macbook Pro - Scale 2',
        styles: {
          width: '1280px',
          height: '8000px',
        },
      },
      appleMacPro3: {
        name: 'Apple Macbook Pro - Scale 3 (Default)',
        styles: {
          width: '1440px',
          height: '900px',
        },
      },
      appleMacPro4: {
        name: 'Apple Macbook Pro - Scale 4',
        styles: {
          width: '1680px',
          height: '1050px',
        },
      },
      appleMacPro5: {
        name: 'Apple Macbook Pro - Scale 5',
        styles: {
          width: '1920px',
          height: '1200px',
        },
      },
    },
  },
});


configure(require.context('../src', true, /.stories.tsx$/), module);
