import React, { FunctionComponent } from 'react';
import { Global, css } from '@emotion/core';
// import WG_QuickHandWoff from '../../assets/fonts/web/WG_QuickHand.woff';
// import RobotoSlabRegularWoff from '../../assets/fonts/web/RobotoSlab-Regular.woff';

// TODO: use file-loader by looking at webpack genrenated config and removing existing config
// https://github.com/storybookjs/storybook/issues/7335
const styles = css`

`;


  /* @font-face {
    font-family: 'QuickHand';
    font-weight: normal;
    font-style: normal;
    src: url(${WG_QuickHandWoff}) format('woff');
  }
  @font-face {
    font-family: 'RobotoSlab';
    font-weight: normal;
    font-style: normal;
    src: url(${RobotoSlabRegularWoff}) format('woff');
  } */

// {
//   '@font-face': {
//     fontFamily: 'RobotoSlab',
//     src: 'url(\'/assets/fonts/RobotoSlab-Regular.ttf\') format(\'truetype\')',
//   },
// };

const GlobalDecorator: FunctionComponent = props => {
  const { children } = props ?? {};

  return (
    <>
      <Global styles={styles} />
      {children}
    </>
  );

};

export default GlobalDecorator;
