import React from 'react';
import cx from 'classname';
// import { Counter } from '../features/counter/Counter';

import Icon from './Icon'
import Steps from './Steps'
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
        icon: <Icon name='file' />,
        component: InputFiles,
      },
      {
        title: 'Identify species',
        icon: <Icon name='filter' />,
        component: IdentifySpecies,
      },
      {
        title: 'Identify reference',
        icon: <Icon name='bullseye' />,
        component: IdentifyReferences,
      },
      {
        title: 'Optimize read length',
        icon: <Icon name='arrows-h' />,
        component: ReadLengthOptimization,
      },
    ]

    return (
      <div className='App'>
        <div className='App__content'>
          <div className='App__wrapper'>
            <Steps
              tabs={tabs}
              enabled={enabledStep}
              active={activeStep}
              onChange={this.setStep}
            />
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

export default App;
