import React from 'react'
import { connect } from 'react-redux'
import cx from 'classname'
import TableScrollbar from 'react-table-scrollbar'
import { setValue } from '../reducers/references'
import { identifyClosestReferences } from '../reducers/references'
import './IdentifyReferences.scss'

const mapStateToProps = state => ({
  isLoading: state.references.isLoading,
  isLoaded: state.references.isLoaded,
  value: state.references.value,
  data: state.references.data,
})

const mapDispatchToProps = { setValue, identifyClosestReferences }

class IdentifyReferences extends React.Component {

  onSelectValue = (s) => {
    this.props.nextStep()
    this.props.setValue(s)

    const references = s.name.split(' ')[0].toLowerCase()

    this.props.identifyClosestReferences(references)
  }

  renderTable() {
    const { data, value } = this.props

    return (
      <TableScrollbar height='500px'>
        <table className='IdentifyReferences__results'>
          <thead>
            <tr>
              <td>Name</td>
              <td>Bitscore</td>
            </tr>
          </thead>
          <tbody>
            {data.map(s =>
              <tr
                key={s.accession}
                role='button'
                className={cx(
                  'IdentifyReferences__row',
                  s.accession === value ? 'IdentifyReferences__row--active' : undefined
                )}
                onClick={() => this.onSelectValue(s)}
              >
                <td>{s.name}</td>
                <td>{s.total_bitscore}</td>
              </tr>
            )}
          </tbody>
        </table>
      </TableScrollbar>
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
