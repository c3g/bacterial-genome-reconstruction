import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { StyledDropZone, readFileAsText } from 'react-drop-zone'
import {
  setFiles,
  setMessages,
} from '../reducers/fastqInput'
import { identifyClosestSpecies } from '../reducers/species'
import './InputFiles.scss'

const mapStateToProps = state => ({
  r1: state.fastqInput.r1,
  r2: state.fastqInput.r2,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setFiles, setMessages, identifyClosestSpecies }, dispatch)

class InputFiles extends React.Component {

  onSelectFiles = (files) => {
    const r1 = files.find(f => /\br1\b/i.test(f.name)) || files[0]
    const r2 = files.find(f => /\br2\b/i.test(f.name)) || files[1]
    this.props.setFiles({ r1: r1 || null, r2: r2 || null })
  }

  onSelectR1 = (file) => {
    this.props.setFiles({ r1: file })
  }

  onSelectR2 = (file) => {
    this.props.setFiles({ r2: file })
  }

  onClickIdentify = () => {
    const r1 = window.files.get(this.props.r1.file)
    console.log(r1.lastModifiedDate)
    this.props.nextStep()
    this.props.identifyClosestSpecies(r1)
    .then(result => {
      console.log(result)
    })
  }

  render() {
    const hasR1 = this.props.r1.file !== undefined
    const r1 = window.files.get(this.props.r1.file)
    const r2 = window.files.get(this.props.r2.file)

    return (
      <div className='InputFiles'>
        <StyledDropZone className='InputFiles__dropzone' onDrop={this.onSelectFiles} multiple>
          <div className='container'>
            <StyledDropZone
              dontRead
              className='InputFiles__innerDropzone six columns'
              title={r1?.name}
              onDrop={this.onSelectR1}
            >
              {
                r1 ?
                  <span className='InputFiles__file.name'>
                    {r1.name}
                  </span>
                  :
                  'Select R1'
              }
            </StyledDropZone>
            <StyledDropZone
              dontRead
              className='InputFiles__innerDropzone six columns'
              title={r2?.name}
              onDrop={this.onSelectR2}
            >
              {
                r2 ?
                  <span className='InputFiles__file.name'>{r2.name}</span> :
                  'Select R2'
              }
            </StyledDropZone>
          </div>
          Select both
        </StyledDropZone>

        <button onClick={this.onClickIdentify} disabled={!hasR1}>
          Identify species
        </button>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputFiles);
