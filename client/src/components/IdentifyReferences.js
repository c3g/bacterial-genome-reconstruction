import React from 'react'
import { connect } from 'react-redux'
import cx from 'classname'
import { StickyTable as Table, Row, Cell } from 'react-sticky-table'
import { setValue } from '../reducers/references'
import './IdentifyReferences.scss'

const mapStateToProps = state => ({
  isLoading: state.references.isLoading,
  isLoaded: state.references.isLoaded,
  value: state.references.value,
  data: state.references.data,
})

const mapDispatchToProps = { setValue }

class IdentifyReferences extends React.Component {

  onSelectValue = (s) => {
    this.props.nextStep()
    this.props.setValue(s)
    // TODO
  }

  renderTable() {
    const { data, value } = this.props

    return (
      <div className='IdentifyReferences__results'>
        <Table leftStickyColumnCount={0}>
          <Row className='IdentifyReferences__results__head'>
            <Cell>Name</Cell>
            <Cell>Bitscore</Cell>
          </Row>
          {data.map(s =>
            <Row
              key={s.accession}
              role='button'
              className={cx(
                'IdentifyReferences__row',
                s.accession === value ? 'IdentifyReferences__row--active' : undefined
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
      <div className='IdentifyReferences'>
        <div>
          Loading: {String(isLoading)}
        </div>

        {isLoaded && this.renderTable()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentifyReferences);
