import React from 'react'
import { connect } from 'react-redux'
import cx from 'classname'
import { StickyTable as Table, Row, Cell } from 'react-sticky-table'

import { setValue } from '../reducers/references'
import { readLengthOptimization } from '../reducers/readLengths'
import './IdentifyReferences.scss'

import Instructions from './Instructions'
import ResultsTable from './ResultsTable'
import Spinner from './Spinner'

const mapStateToProps = state => ({
  isLoading: state.references.isLoading,
  isLoaded: state.references.isLoaded,
  status: state.references.status,
  order: state.references.order,
  value: state.references.value,
  data: state.references.data,
})

const mapDispatchToProps = { setValue, readLengthOptimization }

class IdentifyReferences extends React.Component {

  onSelectValue = (s) => {
    this.props.nextStep()
    this.props.setValue(s)
    this.props.readLengthOptimization()
  }

  renderTable() {
    const { data, value } = this.props

    return (
      <div className='IdentifyReferences__results'>
        <ResultsTable columns={['Name', 'Bitscore']}>
          {data.map(s =>
            <Row
              key={s.accession}
              role='button'
              onClick={() => this.onSelectValue(s)}
            >
              <Cell>{s.name}</Cell>
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
      <div className='IdentifyReferences'>
        <Spinner
          block
          size='5x'
          message={
            <div>
              <b>Identifying reference...</b><br/>
              {status ?
                <>Task is {status} in position {order + 1}</> :
                <>&nbsp;</>
              }
            </div>
          }
          loading={isLoading}
        >
          <div className='IdentifyReferences__content'>
            <Instructions>
              Now, select which <b>species</b> is more likely to be present.
              Pick the top one if you don't know.
            </Instructions>

            {this.renderTable()}
          </div>
        </Spinner>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IdentifyReferences);
