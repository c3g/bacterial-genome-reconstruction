import React from 'react'
import { connect } from 'react-redux'
import { StyledDropZone } from 'react-drop-zone'
import {
  setFiles,
  setMessages,
} from '../reducers/fastqInput'
import { createRequest } from '../reducers/request'
import { identifyClosestSpecies } from '../reducers/species'

import Icon from './Icon'
import Instructions from './Instructions'
import Button from './Button'
import Spinner from './Spinner'

import './InputFiles.scss'

const mapStateToProps = state => ({
  isLoading: state.request.isLoading,
  isLoaded: state.request.isLoaded,
  r1: state.fastqInput.r1,
  r2: state.fastqInput.r2,
})

const mapDispatchToProps = {
  setFiles,
  setMessages,
  identifyClosestSpecies,
  createRequest,
}

class InputFiles extends React.Component {

  onSelectFiles = (fileList) => {
    const files = Array.from(fileList)
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
    this.props.createRequest(r1)
    .then(() => {
      this.props.nextStep()
      this.props.identifyClosestSpecies()
    })
  }

  render() {
    const { isLoading } = this.props
    const hasR1 = this.props.r1.file !== undefined
    const r1 = window.files.get(this.props.r1.file)
    const r2 = window.files.get(this.props.r2.file)

    return (
      <div className='InputFiles'>
        <Spinner
          block
          size='5x'
          message={
            <div>
              Uploading files...<br/>
            </div>
          }
          loading={isLoading}
        >
          <Instructions>
            First, select the files you want to use.
            They must be in the <code>.fasta</code> format.
          </Instructions>

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
                  <span className='InputFiles__filename'>
                    <Icon name='file' marginRight='0.5em' /> {r1.name}
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
                  <span className='InputFiles__filename'>
                    <Icon name='file' marginRight='0.5em' /> {r2.name}
                  </span> :
                  'Select R2'
                }
              </StyledDropZone>
            </div>
            Select both
          </StyledDropZone>

          <div className='flex-row'>
            <div className='flex-fill' />
            <Button onClick={this.onClickIdentify} disabled={!hasR1}>
              Identify species
            </Button>
          </div>

        </Spinner>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputFiles);
