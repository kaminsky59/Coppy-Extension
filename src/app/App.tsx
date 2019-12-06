import * as React from 'react';
import './App.css';
import { MemoryRouter as Router } from 'react-router-dom';

import Routes from './routes/Routes';

class App extends React.Component<{}, {}> {
  render() {
    return (
      <div className='container'>
        <Router>
          <Routes/>
        </Router>
      </div>
    );
  }
}

export default App;
