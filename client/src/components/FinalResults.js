import React from 'react'
import { connect } from 'react-redux'

import './FinalResults.scss'

import * as api from '../api'
import { downloadFromURL } from '../helpers/download'
import Button from './Button'
import Icon from './Icon'
import Instructions from './Instructions'
import ResultsTable, { Row, Cell } from './ResultsTable'

const mapStateToProps = state => ({
  requestId: state.request.data.id,
  reference: state.references.value,
  readLengths: state.readLengths.data,
})

const mapDispatchToProps = {}

class FinalResults extends React.Component {

  render() {
    const { requestId, reference, readLengths } = this.props

    return (
      <div className='FinalResults'>
        <div className='FinalResults__content'>

          <h4 className='text-center'><Icon name='table' /> Results</h4>
          <Instructions>
            We have identified the input file as being:
          </Instructions>

          <ResultsTable className='FinalResults__fields'>
            <Row>
              <Cell className='ResultsTable__head'>Reference name</Cell>
              <Cell>{reference.name}</Cell>
            </Row>
            <Row>
              <Cell className='ResultsTable__head'>Accession</Cell>
              <Cell>{reference.accession}</Cell>
            </Row>
            <Row>
              <Cell className='ResultsTable__head'>Optimal read length</Cell>
              <Cell>
                {readLengths.r1.data[0].cutoff} (R1)
                {readLengths.r2 &&
                  <> and {readLengths.r2.data[0].cutoff} (R2)</>
                }
              </Cell>
            </Row>
          </ResultsTable>

          <Instructions>
            The detailed result files for each step can be downloaded here.
            All files are in the CSV format.
          </Instructions>

          <div className='FinalResults__downloadButtons'>
            <Button icon='download' onClick={() => downloadFromURL(api.urlFor.download.identifyClosestSpecies(requestId))}>
              Genus (1)
            </Button>
            <Button icon='download' onClick={() => downloadFromURL(api.urlFor.download.identifyClosestReferences(requestId))}>
              References (2)
            </Button>
            <Button icon='download' onClick={() => downloadFromURL(api.urlFor.download.readLengthOptimization(requestId))}>
              Optimization ({readLengths.r2 ? '2' : '1'})
            </Button>
          </div>

        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalResults);
