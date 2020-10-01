import React from 'react'
import { connect } from 'react-redux'
import cx from 'classname'
import { StickyTable as Table, Row, Cell } from 'react-sticky-table'

import extractGenus from '../helpers/extract-genus'
import { setValue } from '../reducers/species'
import { identifyClosestReferences } from '../reducers/references'
import './IdentifySpecies.scss'

const mapStateToProps = state => ({
  isLoading: state.species.isLoading,
  isLoaded: state.species.isLoaded,
  value: state.species.value,
  data: state.species.data,
})

const mapDispatchToProps = { setValue, identifyClosestReferences }

class IdentifySpecies extends React.Component {

  onSelectValue = (s) => {
    this.props.nextStep()
    this.props.setValue(s)

    this.props.identifyClosestReferences(extractGenus(s.name))
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
              <Cell>{s.name}</Cell>
              <Cell>{s.total_bitscore}</Cell>
            </Row>
          )}
        </Table>
      </div>
    )
  }

  render() {
    const { isLoading, isLoaded } = this.props

    return (
      <div className='IdentifySpecies'>
        <div>
          Loading: {String(isLoading)}
        </div>

        {isLoaded && this.renderTable()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentifySpecies);
