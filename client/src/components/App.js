import React from 'react';
import { StyledDropZone } from 'react-drop-zone'
// import { Counter } from '../features/counter/Counter';
import './App.scss';

function App() {
  return (
    <div className='App container'>
      <div className='App__steps six columns'>

        <div className='App__step --enabled' role='button'>
          Identify species in sequence data
        </div>
        <div className='App__step --active --enabled' role='button'>
          Find closest finished reference
        </div>
        <div className='App__step' role='button'>
          Determine optimal read trim length
        </div>
        <div className='App__step' role='button'>
          Create guided assembly
        </div>
      </div>
      <div className='App__content six columns'>
        <StyledDropZone />
        <button>Identify species</button>
        <button>Download results</button>
      </div>
    </div>
  );
}

export default App;
