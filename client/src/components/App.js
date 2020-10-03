import React from 'react';
import cx from 'classname';
// import { Counter } from '../features/counter/Counter';

import InputFiles from './InputFiles'
import IdentifySpecies from './IdentifySpecies'
import IdentifyReferences from './IdentifyReferences'
import ReadLengthOptimization from './ReadLengthOptimization'

import './App.scss'

class App extends React.Component {
  state = {
    activeStep: 0,
    enabledStep: 0,
  }

  setStep = (activeStep) => {
    this.setState({ activeStep })
  }

  nextStep = () => {
    const nextStepIndex = this.state.activeStep + 1 
    this.setStep(nextStepIndex)
    if (this.state.enabledStep < nextStepIndex)
      this.setState({ enabledStep: nextStepIndex })
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
        title: 'Optimize read length',
        component: ReadLengthOptimization,
      },
    ]

    return (
      <div className='App'>
        <div className='App__content'>
          <div className='App__wrapper'>
            <div className='App__steps'>
              {
                tabs.map((tab, i) =>
                  <div
                    key={i}
                    className={cxStep(i, activeStep, enabledStep)}
                    role='button'
                    onClick={i <= enabledStep ? () => this.setStep(i) : undefined}
                  >
                    <div className='App__step__icon'>{i + 1}</div>
                    <div className='App__step__title'>{tab.title}</div>
                  </div>
                )
              }
            </div>
            <div className='App__currentStep'>
              {React.createElement(tabs[activeStep].component, { nextStep })}
            </div>
          </div>
        </div>

        <footer className='App__footer'>
          <span>Made with <span className='text-error'>❤️</span> in Montréal
            — Implemented by Romain Grégoire, based on an original tool by Matthew D'Iorio & Ken Dewar</span>
        </footer>
      </div>
    );
  }
}

function cxStep(n, activeStep, enabledStep) {
  return cx('App__step', { '--enabled': n <= enabledStep, '--active': n === activeStep })
}

export default App;
