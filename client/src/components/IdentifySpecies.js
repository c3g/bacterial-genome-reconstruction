import React from 'react'
import { connect } from 'react-redux'
import cx from 'classname'
import { StickyTable as Table, Row, Cell } from 'react-sticky-table'

import { matchSpeciesName } from '../helpers/extract-genus'
import { setValue } from '../reducers/species'
import { identifyClosestReferences } from '../reducers/references'
import './IdentifySpecies.scss'

import Instructions from './Instructions'
import Spinner from './Spinner'


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
    const { data, value } = this.props

    return (
      <div className='IdentifySpecies__results'>
        <Table leftStickyColumnCount={0}>
          <Row className='IdentifySpecies__results__head'>
            <Cell>Name</Cell>
            <Cell>Bitscore</Cell>
          </Row>
          {data.map(s =>
            <Row
              key={s.accession}
              role='button'
              className={cx(
                'IdentifySpecies__row',
                s.accession === value ? 'IdentifySpecies__row--active' : undefined
              )}
              onClick={() => this.onSelectValue(s)}
            >
              <Cell>{renderSpeciesName(s.name)}</Cell>
              <Cell>{s.total_bitscore}</Cell>
            </Row>
          )}
        </Table>
      </div>
    )
  }

  render() {
    const { isLoading, isLoaded, status, order } = this.props

    return (
      <div className='IdentifySpecies'>

        <Spinner
          block
          size='5x'
          message={
            <div>
              Identifying species...<br/>
              {status ?
                <>Task is {status} in position {order + 1}</> :
                <>&nbsp;</>
              }
            </div>
          }
          loading={isLoading}
        >
          <div className='IdentifySpecies__content'>
            <Instructions>
              Next, select which <u>genus</u> is more likely to be present.
              Pick the top one if you don't know.<br />
              This will narrow the search and the specific species will be
              determined in the next step.
            </Instructions>

            {this.renderTable()}
          </div>
        </Spinner>
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
