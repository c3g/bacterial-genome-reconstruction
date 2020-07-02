import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { StyledDropZone } from 'react-drop-zone'
import {
  setFile,
  setReads,
  setMessage,
} from '../reducers/fastqInput'
import generateRandomReads from '../helpers/generate-random-reads'

const mapStateToProps = state => ({
  filename: state.fastqInput.filename,
  message: state.fastqInput.message,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setFile, setReads, setMessage }, dispatch)

class IdentifySpecies extends React.Component {

  onDropFile = (file, fileContent) => {
    this.props.setFile(file.name)
    const reads = generateRandomReads(fileContent)
    this.props.setReads(reads)
  }

  render() {
    const { filename } = this.props
    const label = filename ?
      <div className='DropZone__filename'>{filename}</div> :
      'Select or drop your file here'

    return (
      <div className='IdentifySpecies'>
        <StyledDropZone
          label={label}
          onDrop={this.onDropFile}
        />
        <button disabled={!Boolean(filename)}>Identify species</button>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentifySpecies);
