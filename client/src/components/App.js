import React from 'react';
import { StyledDropZone } from 'react-drop-zone'
import cx from 'classname';
// import { Counter } from '../features/counter/Counter';

class App extends React.Component {
  state = {
    activeStep: 1,
    enabledStep: 1,
  }

  render() {
    const { activeStep, enabledStep } = this.state

    return (
      <div className='App container'>
        <div className='App__steps six columns'>
          <div className={cxStep(0, activeStep, enabledStep)} role='button'>
            Identify species in sequence data
          </div>
          <div className={cxStep(1, activeStep, enabledStep)} role='button'>
            Find closest finished reference
          </div>
          <div className={cxStep(2, activeStep, enabledStep)} role='button'>
            Determine optimal read trim length
          </div>
          <div className={cxStep(3, activeStep, enabledStep)} role='button'>
            Create guided assembly
          </div>
        </div>
        <div className='App__content six columns'>
          <StyledDropZone
            label='Select or drop your file here'
          />
          <button>Identify species</button>
          <button>Download results</button>
        </div>
      </div>
    );
  }
}

function cxStep(n, activeStep, enabledStep) {
  return cx('App__step', { '--enabled': n <= enabledStep, '--active': n === activeStep })
}

export default App;
