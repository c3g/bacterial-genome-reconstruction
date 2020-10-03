import React from 'react'
import { connect } from 'react-redux'
import cx from 'classname'
import { StickyTable as Table, Row, Cell } from 'react-sticky-table'
import { setValue } from '../reducers/readLengths'
import './ReadLengthOptimization.scss'

const mapStateToProps = state => ({
  isLoading: state.readLengths.isLoading,
  isLoaded: state.readLengths.isLoaded,
  value: state.readLengths.value,
  data: state.readLengths.data,
})

const mapDispatchToProps = { setValue }

class ReadLengthOptimization extends React.Component {

  onSelectValue = (s) => {
    // this.props.nextStep()
    this.props.setValue(s)
    // TODO
  }

  renderTable() {
    const { data, value } = this.props

    return (
      <div className='ReadLengthOptimization__results'>
        <Table leftStickyColumnCount={0}>
          <Row className='ReadLengthOptimization__results__head'>
            <Cell>Name</Cell>
            <Cell>Bitscore</Cell>
          </Row>
          {data.map(s =>
            <Row
              key={s.accession}
              role='button'
              className={cx(
                'ReadLengthOptimization__row',
                s.accession === value ? 'ReadLengthOptimization__row--active' : undefined
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
      <div className='ReadLengthOptimization'>
        <div>
          Loading: {String(isLoading)}
        </div>

        {isLoaded && this.renderTable()}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadLengthOptimization);
