import React from 'react'
import { connect } from 'react-redux'
import { Row, Cell } from 'react-sticky-table'

import { setValue } from '../reducers/readLengths'
import './ReadLengthOptimization.scss'

import ErrorMessage from './ErrorMessage'
import FinalResults from './FinalResults'
import Instructions from './Instructions'
import ResultsTable from './ResultsTable'
import TaskSpinner from './TaskSpinner'

const mapStateToProps = state => ({
  isLoading: state.readLengths.isLoading,
  isLoaded: state.readLengths.isLoaded,
  message: state.readLengths.message,
  status: state.readLengths.status,
  order: state.readLengths.order,
  eta: state.readLengths.eta,
  value: state.readLengths.value,
  data: state.readLengths.data,
})

const mapDispatchToProps = { setValue }

class ReadLengthOptimization extends React.Component {

  onSelectValue = (s) => {
    this.props.setValue(s)
    // TODO
  }

  renderTable() {
    const { data } = this.props

    return (
      <div className='ReadLengthOptimization__results'>
        <ResultsTable columns={['Read Length', 'Perfect Hits', 'Score']}>
          {data.map(s =>
            <Row
              key={s.cutoff}
              role='button'
              onClick={() => this.onSelectValue(s)}
            >
              <Cell>{s.cutoff}</Cell>
              <Cell>{s.perfectHits}</Cell>
              <Cell>{s.product}</Cell>
            </Row>
          )}
        </ResultsTable>
      </div>
    )
  }

  render() {
    const { isLoading, message, status, order, eta, data, value } = this.props

    // Hijack this step because I don't want to add another button
    if (data.r1)
      return <FinalResults />

    return (
      <div className='ReadLengthOptimization'>
        <TaskSpinner
          message='Optimizing read length...'
          status={status}
          order={order}
          eta={eta}
          loading={isLoading}
        >
          <div className='ReadLengthOptimization__content'>
            {message ?
              <ErrorMessage
                message={message}
                previousStep={this.props.previousStep}
              />
              :
              <>
                <Instructions>
                  Finally, select which read length you prefer. Higher score is better.
                </Instructions>

                {/* this.renderTable() */}
              </>
            }
          </div>
        </TaskSpinner>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReadLengthOptimization);
