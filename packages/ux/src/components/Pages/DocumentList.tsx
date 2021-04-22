import React, { FunctionComponent, useMemo } from 'react';
import { Table, Grid } from 'semantic-ui-react';

interface Document {
  title: string;
  sizeBytes: number;
  uploadDate: string;
};

interface DocumentListProps {
  text: {
    headers: Record<keyof Document, string>;
  },
  documents: Document[];
};

// Helpers

const bytesToString = (bytes: number) => {
  let amount = bytes;
  if (amount < 1024) {
    return `${Math.round(amount)} B`;
  }
  amount /= 1024;
  if (amount < 1024) {
    return `${Math.round(amount)} kB`;
  }
  amount /= 1024;
  if (amount < 1024) {
    return `${Math.round(amount)} MB`;
  }
  amount /= 1024;
  if (amount < 1024) {
    return `${Math.round(amount)} GB`;
  }
  amount /= 1024;
  return `${Math.round(amount)} TB`;
}

// Components

const DocumentList: FunctionComponent<DocumentListProps> = props => {
  const { text, documents } = props ?? {};

  const tableRows = useMemo(() => documents.map( d =>
    (
      <Table.Row>
        <Table.Cell>{d.title}</Table.Cell>
        <Table.Cell>{bytesToString(d.sizeBytes)}</Table.Cell>
        <Table.Cell>{d.uploadDate}</Table.Cell>
      </Table.Row>
    )
  ), [documents]);

  return (
    <Grid.Column>
      <Table basic verticalAlign='top'>
        <Table.Header>
          <Table.HeaderCell>{text.headers.title}</Table.HeaderCell>
          <Table.HeaderCell>{text.headers.sizeBytes}</Table.HeaderCell>
          <Table.HeaderCell>{text.headers.uploadDate}</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {tableRows}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
};
DocumentList.displayName = 'SDMSDocumentList';

export default DocumentList;
