import React from 'react';
import cx from 'classname';
// import { Counter } from '../features/counter/Counter';

import InputFiles from './InputFiles'
import IdentifySpecies from './IdentifySpecies'
import IdentifyReferences from './IdentifyReferences'

class App extends React.Component {
  state = {
    activeStep: 0,
    enabledStep: 2,
  }

  setStep = (activeStep) => {
    this.setState({ activeStep })
  }

  nextStep = () => {
    this.setStep(this.state.activeStep + 1)
  }

  render() {
    const { activeStep, enabledStep } = this.state
    const { nextStep } = this

    const tabs = [
      {
        title: 'Input files',
        component: InputFiles,
      },
      {
        title: 'Identify species',
        component: IdentifySpecies,
      },
      {
        title: 'Identify reference',
        component: IdentifyReferences,
      },
      {
        title: 'Optimize read trim length',
        component: null,
      },
      {
        title: 'Create guided assembly',
        component: null,
      },
    ]

    return (
      <div className='App container'>
        <div className='App__steps four columns'>
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
        <div className='App__content eight columns'>
          {React.createElement(tabs[activeStep].component, { nextStep })}
          <div>
            <button onClick={nextStep}>Next</button>
          </div>
        </div>
      </div>
    );
  }
}

function cxStep(n, activeStep, enabledStep) {
  return cx('App__step', { '--enabled': n <= enabledStep, '--active': n === activeStep })
}

export default App;
