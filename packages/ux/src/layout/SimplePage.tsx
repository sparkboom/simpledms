import React, { FunctionComponent } from 'react';
import { Menu, Container, Segment, List, Image, Header } from 'semantic-ui-react'

interface SimplePageProps {
  title?: string;
}

// Components
const Footer: FunctionComponent<{}> = () => {
  return (
    <Segment inverted vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
      <Container textAlign='center'>
        <Image centered size='mini' src='/logo.png' />
        <List horizontal inverted divided link size='small'>
          <List.Item as='a' href='#'>
            Site Map
          </List.Item>
          <List.Item as='a' href='#'>
            Contact Us
          </List.Item>
          <List.Item as='a' href='#'>
            Terms and Conditions
          </List.Item>
          <List.Item as='a' href='#'>
            Privacy Policy
          </List.Item>
        </List>
      </Container>
    </Segment>
  );
};

const SimplePage: FunctionComponent<SimplePageProps> = (props)=> {
  const { children, title } = props ?? {};

  return (
    <div>
      <Menu fixed='top' inverted>
        <Container>
          <Menu.Item as='a' header>
            <Image size='mini' src='/logo.png' style={{ marginRight: '1.5em' }} />
            Project Name
          </Menu.Item>
          <Menu.Item as='a'>Home</Menu.Item>
        </Container>
      </Menu>

      <Container style={{ marginTop: '7em' }}>
        {title && <Header as='h1'>{title}</Header>}
        {children}
      </Container>
      {/* <Footer / > */}
    </div>
  );
};
SimplePage.displayName = 'SRSimplePage';

export default SimplePage;
