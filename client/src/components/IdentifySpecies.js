import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { StyledDropZone, readFileAsText } from 'react-drop-zone'
import {
  setFiles,
  setMessages,
} from '../reducers/fastqInput'
import { identifyClosestSpecies } from '../requests'
import './IdentifySpecies.scss'

const mapStateToProps = state => ({
  r1: state.fastqInput.r1,
  r2: state.fastqInput.r2,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setFiles, setMessages }, dispatch)

class IdentifySpecies extends React.Component {

  onSelectFiles = (files) => {
    const r1 = files.find(f => /\br1\b/i.test(f.name)) || files[0]
    const r2 = files.find(f => /\br2\b/i.test(f.name)) || files[1]
    this.props.setFiles({ r1: r1 || null, r2: r2 || null })
  }

  onSelectR1 = (file) => {
    this.props.setFiles({ r1: file, r2: null })
  }

  onSelectR2 = (file) => {
    this.props.setFiles({ r1: null, r2: file })
  }

  onClickIdentify = () => {
    identifyClosestSpecies(this.props.r1.file)
    .then(result => {
      console.log(result)
      debugger
    })
  }

  render() {
    const { r1, r2 } = this.props

    const hasR1 = r1.file !== undefined

    return (
      <div className='IdentifySpecies'>
        <StyledDropZone className='IdentifySpecies__dropzone' onDrop={this.onSelectFiles} multiple>
          <div className='container'>
            <StyledDropZone
              dontRead
              className='IdentifySpecies__innerDropzone six columns'
              title={r1.file?.name}
              onDrop={this.onSelectR1}
            >
              {
                r1.file ?
                  <span className='IdentifySpecies__file.name'>
                    {r1.file.name}
                  </span>
                  :
                  'Select R1'
              }
            </StyledDropZone>
            <StyledDropZone
              dontRead
              className='IdentifySpecies__innerDropzone six columns'
              title={r2.file?.name}
              onDrop={this.onSelectR2}
            >
              {
                r2.file ?
                  <span className='IdentifySpecies__file.name'>{r2.file.name}</span> :
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

export default connect(mapStateToProps, mapDispatchToProps)(IdentifySpecies);
