import React from 'react';
import cx from 'classname';
// import { Counter } from '../features/counter/Counter';

import IdentifySpecies from './IdentifySpecies'
import IdentifyReference from './IdentifyReference'

class App extends React.Component {
  state = {
    activeStep: 0,
    enabledStep: 2,
  }

  setStep = (activeStep) => {
    this.setState({ activeStep })
  }

  render() {
    const { activeStep, enabledStep } = this.state

    const tabs = [
      {
        title: 'Identify species in sequence data',
        content: <IdentifySpecies/>,
      },
      {
        title: 'Identify closest reference',
        content: <IdentifyReference/>,
      },
      {
        title: 'Determine optimal read trim length',
        content: null,
      },
      {
        title: 'Create guided assembly',
        content: null,
      },
    ]

    return (
      <div className='App container'>
        <div className='App__steps six columns'>
          {
            tabs.map((tab, i) =>
              <div
                key={i}
                className={cxStep(i, activeStep, enabledStep)}
                role='button'
                onClick={i <= enabledStep ? () => this.setStep(i) : undefined}
              >
                {tab.title}
              </div>
            )
          }
        </div>
        <div className='App__content six columns'>
          {tabs[activeStep].content}
        </div>
      </div>
    );
  }
}

function cxStep(n, activeStep, enabledStep) {
  return cx('App__step', { '--enabled': n <= enabledStep, '--active': n === activeStep })
}

export default App;
