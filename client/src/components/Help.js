import React from 'react'
import pure from 'recompose/pure'

import Icon from './Icon'

import './Help.scss'


function Help(props) {
  return (
    <div className='Help'>
      <div className='Help__content'>
        <h1 className='Help__title'>Help</h1>

        <h4>What is this tool?</h4>
        <p className='Help__text'>
          The Bacterial Genome Reconstruction tool. It identifies the bacteria reference for
          the input files you feed it.
        </p>

        <h4>How does it work?</h4>
        <p className='Help__text'>
          Add your input files, either as <code>.fastq</code> or <code>.fastq</code> files.
          Next, follow the instructions in each step.
        </p>

        <h4>I have a question or a problem</h4>
        <p className='Help__text'>
          Contact us <a href='mailto:TODO'>by email</a>.
        </p>
      </div>
    </div>
  )
}

export default pure(Help)
