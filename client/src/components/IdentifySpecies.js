import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { StyledDropZone, readFileAsText } from 'react-drop-zone'
import {
  setFilenames,
  setReads,
  setMessages,
} from '../reducers/fastqInput'
import generateRandomReads from '../helpers/generate-random-reads'
import './IdentifySpecies.scss'

const mapStateToProps = state => ({
  r1: state.fastqInput.r1,
  r2: state.fastqInput.r2,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setFilenames, setReads, setMessages }, dispatch)

class IdentifySpecies extends React.Component {

  onSelectFiles = (files) => {
    const r1 = files.find(f => /\br1\b/i.test(f.name)) || files[0]
    const r2 = files.find(f => /\br2\b/i.test(f.name)) || files[1]

    this.props.setFilenames({ r1: r1 ? r1.name : null, r2: r2 ? r2.name : null })
    Promise.all([
      r1 ? readFileAsText(r1) : null,
      r2 ? readFileAsText(r2) : null,
    ])
    .then(texts => texts.map(generateRandomReads))
    .then(([r1Reads, r2Reads]) => {
      this.props.setReads({
        r1: r1 ? r1Reads : null,
        r2: r2 ? r2Reads : null,
      })
    })
  }

  onSelectR1 = (file, fileContent) => {
    this.props.setFilenames({ r1: file.name, r2: null })
    const reads = generateRandomReads(fileContent)
    this.props.setReads({ r1: reads, r2: null })
  }

  onSelectR2 = (file, fileContent) => {
    this.props.setFilenames({ r1: null, r2: file.name })
    const reads = generateRandomReads(fileContent)
    this.props.setReads({ r1: null, r2: reads })
  }

  render() {
    const { r1, r2 } = this.props

    const hasR1 = r1.reads !== undefined

    return (
      <div className='IdentifySpecies'>
        <StyledDropZone className='IdentifySpecies__dropzone' onDrop={this.onSelectFiles} multiple>
          <div className='container'>
            <StyledDropZone
              className='IdentifySpecies__innerDropzone six columns'
              title={r1.filename}
              onDrop={this.onSelectR1}
            >
              {
                r1.filename ?
                  <span className='IdentifySpecies__filename'>
                    {r1.filename}
                  </span>
                  :
                  'Select R1'
              }
            </StyledDropZone>
            <StyledDropZone className='IdentifySpecies__innerDropzone six columns' onDrop={this.onSelectR2}>
              {
                r2.filename ?
                  <span className='IdentifySpecies__filename'>{r2.filename}</span> :
                  'Select R2'
              }
            </StyledDropZone>
          </div>
          Select both
        </StyledDropZone>

        <button disabled={!hasR1}>Identify species</button>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentifySpecies);
