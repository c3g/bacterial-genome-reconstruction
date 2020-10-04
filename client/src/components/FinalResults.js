import React from 'react'
import { connect } from 'react-redux'
import cx from 'classname'

import './FinalResults.scss'

import Button from './Button'
import Icon from './Icon'
import Instructions from './Instructions'
import ResultsTable, { Row, Cell } from './ResultsTable'

const mapStateToProps = state => ({
  reference: state.references.value,
  readLength: state.readLengths.value,
})

const mapDispatchToProps = {}

class FinalResults extends React.Component {

  render() {
    const { reference, readLength } = this.props

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
              <Cell>{readLength.cutoff}</Cell>
            </Row>
          </ResultsTable>

          <Instructions>
            The detailed result files for each step can be downloaded here.
            All files are in the CSV format.
          </Instructions>

          <div className='FinalResults__downloadButtons'>
            <Button icon='download'>
              Genus (2)
            </Button>
            <Button icon='download'>
              References (2)
            </Button>
            <Button icon='download'>
              Optimization (1)
            </Button>
          </div>

        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FinalResults);
