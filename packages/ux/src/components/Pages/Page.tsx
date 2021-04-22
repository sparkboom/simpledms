import React, { FunctionComponent } from 'react';
import { Table, Segment, Container, Grid } from 'semantic-ui-react';
import DocumentList from './DocumentList';
import UploadPanel from './UploadPanel';
import { uploadPanelText, documentHeaders } from './__fixtures__/text';
import docs from './__fixtures__/docs';

const Page: FunctionComponent<{}> = () => {

  return (
    <Container>
      {/* <Header as='h2'>Documents</Header> */}
      <UploadPanel text={uploadPanelText} />
      <Grid columns={2} doubling stackable>
        <DocumentList documents={docs} text={{headers: documentHeaders}} />
        <Grid.Column>
            <Segment>Preview</Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};
Page.displayName = 'SDMSPage';

export default Page;
