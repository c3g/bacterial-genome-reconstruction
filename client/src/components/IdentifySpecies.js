import React from 'react'
import { connect } from 'react-redux'

import { matchSpeciesName } from '../helpers/extract-genus'
import { setValue } from '../reducers/species'
import { identifyClosestReferences } from '../reducers/references'
import './IdentifySpecies.scss'

import Instructions from './Instructions'
import ResultsTable, { Row, Cell } from './ResultsTable'
import TaskSpinner from './TaskSpinner'


const mapStateToProps = state => ({
  isLoading: state.species.isLoading,
  isLoaded: state.species.isLoaded,
  status: state.species.status,
  order: state.species.order,
  value: state.species.value,
  data: state.species.data,
})

const mapDispatchToProps = { setValue, identifyClosestReferences }

class IdentifySpecies extends React.Component {

  onSelectValue = (s) => {
    this.props.setValue(s)
    this.props.identifyClosestReferences()
    this.props.nextStep()
  }

  renderTable() {
    const { data } = this.props

    return (
      <div className='IdentifySpecies__results'>
        <ResultsTable columns={['Name', 'Bitscore']}>
          {data.map(s =>
            <Row
              key={s.accession}
              role='button'
              onClick={() => this.onSelectValue(s)}
            >
              <Cell>{renderSpeciesName(s.name)}</Cell>
              <Cell>{s.total_bitscore}</Cell>
            </Row>
          )}
        </ResultsTable>
      </div>
    )
  }

  render() {
    const { isLoading, status, order } = this.props

    return (
      <div className='IdentifySpecies'>

        <TaskSpinner
          message='Identifying species...'
          status={status}
          order={order}
          loading={isLoading}
        >
          <div className='IdentifySpecies__content'>
            <Instructions>
              Next, select which <b>genus</b> is more likely to be present.
              Pick the top one if you don't know.<br />
              This will narrow the search and the specific species will be
              determined in the next step.
            </Instructions>

            {this.renderTable()}
          </div>
        </TaskSpinner>
      </div>
    );
  }
}

function renderSpeciesName(value) {
  const { genus, species, complete } = matchSpeciesName(value)

  return (
    <>
      <span className='bold'>{genus}</span>{' '}
      <span className='text-normal'>{species}</span>{' '}
      <span className='text-muted'>{complete}</span>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentifySpecies);
