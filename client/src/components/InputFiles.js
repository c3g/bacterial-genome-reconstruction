import React from 'react'
import { connect } from 'react-redux'
import { StyledDropZone, readFileAsText } from 'react-drop-zone/dist/index'
import {
  setFiles,
  setMessages,
} from '../reducers/inputFiles'
import { createRequest } from '../reducers/request'
import { identifyClosestSpecies } from '../reducers/species'
import * as Fastq from '../helpers/fastq'
import * as Fasta from '../helpers/fasta'

import Icon from './Icon'
import Instructions from './Instructions'
import Button from './Button'
import TaskSpinner from './TaskSpinner'

import './InputFiles.scss'

const ACCEPT_PATTERN = '.fasta,.faa,.fa,.fastq,.fq'

const mapStateToProps = state => ({
  isLoading: state.request.isLoading,
  isLoaded: state.request.isLoaded,
  message: state.request.message,
  r1: state.inputFiles.r1,
  r2: state.inputFiles.r2,
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

    r1 && validate(r1).catch(err => {
      this.props.setMessages({ r1: err.message })
    })
    r2 && validate(r2).catch(err => {
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

  removeR1 = (ev) => {
    ev.stopPropagation()
    this.props.setFiles({ r1: null })
    this.props.setMessages({ r1: null })
  }

  removeR2 = (ev) => {
    ev.stopPropagation()
    this.props.setFiles({ r2: null })
    this.props.setMessages({ r2: null })
  }

  onClickIdentify = () => {
    const r1 = window.files.get(this.props.r1.file)
    const r2 = window.files.get(this.props.r2.file)
    this.props.createRequest({ r1, r2 })
    .then(action => {
      if (!action.error) {
        this.props.nextStep()
        this.props.identifyClosestSpecies()
      }
    })
  }

  render() {
    const { isLoading, message, r1, r2 } = this.props
    const hasR1 = r1.file !== undefined && !r1.message
    const disabled = !hasR1 || (r2?.message !== undefined)
    const r1File = window.files.get(this.props.r1.file)
    const r2File = window.files.get(this.props.r2.file)

    console.log(r1File, r1)

    return (
      <div className='InputFiles'>
        <TaskSpinner
          message='Uploading files...'
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
                    <div className='InputFiles__filename__content'>
                      {r1.message ?
                        <Icon name='exclamation-triangle' marginRight='0.5em' /> :
                        <Icon name='file' marginRight='0.5em' />
                      }{' '}
                      {r1File.name}{' '}
                      <Button
                        flat
                        iconButton
                        icon='times'
                        onClick={this.removeR1}
                      />
                    </div>
                    {r1.message &&
                      <div className='InputFiles__filename__message'>
                        {r1.message}
                      </div>
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
                    <div className='InputFiles__filename__content'>
                      {r2.message ?
                        <Icon name='exclamation-triangle' marginRight='0.5em' /> :
                        <Icon name='file' marginRight='0.5em' />
                      }{' '}
                      {r2File.name}{' '}
                      <Button
                        flat
                        iconButton
                        icon='times'
                        onClick={this.removeR2}
                      />
                    </div>
                    {r2.message &&
                      <div className='InputFiles__filename__message'>
                        {r2.message}
                      </div>
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
            {message &&
              <div className='text-error bold h-padded'>
                <Icon name='exclamation-triangle' /> {message}
              </div>
            }
            <Button onClick={this.onClickIdentify} disabled={disabled}>
              Identify Genus <Icon name='arrow-right' marginLeft={5} />
            </Button>
          </div>

        </TaskSpinner>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputFiles);


// Helpers

function validate(file) {
  return readFileAsText(file).then(text => {
    const result =
      text.startsWith('@') ? Fastq.parse(text) :
      text.startsWith('>') ? Fasta.parse(text) :
        { ok: false, error: new Error('Unrecognized input format') }

    if (!result.ok)
      return Promise.reject(result.error)
  })
}
