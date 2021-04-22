import React, { FunctionComponent, useCallback, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import { Header, Segment, Icon, Button } from 'semantic-ui-react';

// Types
interface UploadPanelProps {
  text: {
    label: string;
    buttonLabel: string;
  }
};

// Components
const UploadPanel: FunctionComponent<UploadPanelProps> = props => {
  const { text } = props ?? {};
  const [expandPanel, setExpandPanel] = useState(false);
  const toggleExpand = useCallback(() => {
    setExpandPanel(!expandPanel);
  }, [expandPanel, setExpandPanel]);
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    console.log(acceptedFiles);
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <Segment clearing placeholder={expandPanel}  {...getRootProps()}>
      <Button basic icon compact floated='right' onClick={toggleExpand}>
        <Icon corner name={expandPanel? 'compress':'expand'} />
      </Button>
      {expandPanel && (
        <>
          <input {...getInputProps()} />
          { isDragActive && (
            <>
              <Header icon>
                <Icon name='pdf file outline' />
                {text?.label}
              </Header>
              <Button primary>{text?.buttonLabel}</Button>
            </>
          )}
        </>
      )}
    </Segment>
  );
};
UploadPanel.displayName = 'SDMSUploadPanel';

export default UploadPanel;

