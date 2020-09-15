import React from 'react';
import { StyledDropZone } from 'react-drop-zone'

class IdentifyReference extends React.Component {
  state = {
    file: undefined,
    fileContent: undefined,
  }

  onDropFile = (file, fileContent) => {
    this.setState({ file, fileContent })
  }

  render() {
    const { file } = this.state
    const label = file ?
      file.name :
      'Select or drop your file here'

    return (
      <div className='IdentifyReference'>
        <StyledDropZone
          label={label}
          onDrop={this.onDropFile}
        />
        <button>Identify reference</button>
      </div>
    );
  }
}

export default IdentifyReference;
