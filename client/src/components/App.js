import React from 'react'
import cx from 'classname'

import Icon from './Icon'
import Button from './Button'
import Help from './Help'
import Steps from './Steps'
import InputFiles from './InputFiles'
import IdentifySpecies from './IdentifySpecies'
import IdentifyReferences from './IdentifyReferences'
import ReadLengthOptimization from './ReadLengthOptimization'

import './App.scss'

const tabs = [
  {
    title: 'Input files',
    icon: <Icon name='file' />,
    component: InputFiles,
  },
  {
    title: 'Identify genus',
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

class App extends React.Component {
  state = {
    showHelp: false,
    activeStep:  localStorage.activeStep  ? +localStorage.activeStep  : 0,
    enabledStep: localStorage.enabledStep ? +localStorage.enabledStep : 0,
  }

  toggleHelp = () => {
    this.setState({ showHelp: !this.state.showHelp })
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

  previousStep = () => {
    const previousStepIndex = this.state.activeStep - 1
    this.setState({ activeStep: previousStepIndex, enabledStep: previousStepIndex })
  }

  render() {
    const { showHelp, activeStep, enabledStep } = this.state
    const { nextStep, previousStep } = this

    return (
      <div className='App'>
        <Button
          className='App__helpButton'
          flat
          iconButton
          icon={ showHelp ? 'times' : 'question-circle' }
          onClick={this.toggleHelp}
        />

        <div className='App__content'>
          <div className='App__wrapper'>
            <Steps
              tabs={tabs}
              enabled={enabledStep}
              active={activeStep}
              onChange={this.setStep}
            />
            <div className='App__currentStep'>
              {React.createElement(tabs[activeStep].component, { nextStep, previousStep })}
            </div>
          </div>
        </div>

        <footer className='App__footer'>
          <span>
            Made with{' '}
            <span role='img' aria-label='love' className='text-error'>❤️</span>{' '}
            in Montréal
            —
            Implemented by Romain Grégoire, based on an original tool by
            Matthew D'Iorio & Ken Dewar
          </span>
        </footer>

        <div className={cx('App__help', { visible: showHelp } )}>
          <Help />
        </div>
      </div>
    );
  }
}

export default App;
