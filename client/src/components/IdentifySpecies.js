import React from 'react'
import { connect } from 'react-redux'
import cx from 'classname'
import TableScrollbar from 'react-table-scrollbar'
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

    const species = s.name.split(' ')[0].toLowerCase()

    this.props.identifyClosestReferences(species)
  }

  renderTable() {
    const { data, value } = this.props

    return (
      <TableScrollbar height='500px'>
        <table className='IdentifySpecies__results'>
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
                  'IdentifySpecies__row',
                  s.accession === value ? 'IdentifySpecies__row--active' : undefined
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
