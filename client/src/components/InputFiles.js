import React from 'react'
import { connect } from 'react-redux'
import { StyledDropZone, readFileAsText } from 'react-drop-zone/dist/index'
import {
  setFiles,
  setMessages,
} from '../reducers/fastqInput'
import { createRequest } from '../reducers/request'
import { identifyClosestSpecies } from '../reducers/species'
import * as Fastq from '../helpers/fastq'

import Icon from './Icon'
import Instructions from './Instructions'
import Button from './Button'
import Spinner from './Spinner'

import './InputFiles.scss'

const ACCEPT_PATTERN = '.fasta,.faa,.fa,.fastq,.fq'

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

    validate(r1).catch(err => {
      this.props.setMessages({ r1: err.message })
    })
    validate(r2).catch(err => {
      this.props.setMessages({ r2: err.message })
    })
  }

  onSelectR1 = (file) => {
    this.props.setFiles({ r1: file })
    validate(file).catch(err => {
      this.props.setMessages({ r1: err.message })
    })
  }

  onSelectR2 = (file) => {
    this.props.setFiles({ r2: file })
    validate(file).catch(err => {
      this.props.setMessages({ r2: err.message })
    })
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
    const { isLoading, r1, r2 } = this.props
    const hasR1 = r1.file !== undefined && !r1.message
    const r1File = window.files.get(this.props.r1.file)
    const r2File = window.files.get(this.props.r2.file)

    console.log(r1File, r1)

    return (
      <div className='InputFiles'>
        <Spinner
          block
          size='5x'
          message={
            <div>
              <b>Uploading files...</b><br/>
              <small>&nbsp;</small><br/>
              <br/>
              <br/>
              { /* ...to maintain the same dimension as TaskSpinner */ }
            </div>
          }
          loading={isLoading}
        >
          <Instructions>
            First, select the files you want to use.
            They must be in the <code>.fasta</code> or <code>.fastq</code> format.
          </Instructions>

          <StyledDropZone
            multiple
            dontRead
            className='InputFiles__dropzone'
            accept={ACCEPT_PATTERN}
            onDrop={this.onSelectFiles}
          >
            <div className='container'>
              <StyledDropZone
                dontRead
                className='InputFiles__innerDropzone six columns'
                accept={ACCEPT_PATTERN}
                title={r1.message || r1File?.name}
                onDrop={this.onSelectR1}
              >
                {
                  r1File ?
                  <div className='InputFiles__filename'>
                    {r1.message ?
                      <>
                        <div className='InputFiles__filename__content'>
                          <Icon name='exclamation-triangle' marginRight='0.5em' /> {r1File.name}
                        </div>
                        <div className='InputFiles__filename__message'>
                          {r1.message}
                        </div>
                      </> :
                      <>
                        <div className='InputFiles__filename__content'>
                          <Icon name='file' marginRight='0.5em' /> {r1File.name}
                        </div>
                      </>
                    }
                  </div>
                  :
                  'Select R1'
                }
              </StyledDropZone>
              <StyledDropZone
                dontRead
                className='InputFiles__innerDropzone six columns'
                accept={ACCEPT_PATTERN}
                title={r2.message || r2File?.name}
                onDrop={this.onSelectR2}
              >
                {
                  r2File ?
                  <div className='InputFiles__filename'>
                    {r2.message ?
                      <>
                        <div className='InputFiles__filename__content'>
                          <Icon name='exclamation-triangle' marginRight='0.5em' /> {r2File.name}
                        </div>
                        <div className='InputFiles__filename__message'>
                          {r2.message}
                        </div>
                      </> :
                      <>
                        <div className='InputFiles__filename__content'>
                          <Icon name='file' marginRight='0.5em' /> {r2File.name}
                        </div>
                      </>
                    }
                  </div>
                  :
                  'Select R2'
                }
              </StyledDropZone>
            </div>
            Select both
          </StyledDropZone>

          <div className='flex-row'>
            {process.env.NODE_ENV === 'development' &&
              <Button variant='simple' onClick={window.clearStore}>
                Clear
              </Button>
            }
            <div className='flex-fill' />
            <Button onClick={this.onClickIdentify} disabled={!hasR1}>
              Identify Genus <Icon name='arrow-right' marginLeft={5} />
            </Button>
          </div>

        </Spinner>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputFiles);


// Helpers

function validate(file) {
  return readFileAsText(file).then(text => {
    const result = Fastq.parse(text)
    if (!result.ok)
      return Promise.reject(result.error)
  })
}
