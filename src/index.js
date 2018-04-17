import React from 'react';
import ReactDOM from 'react-dom';

import App from './app/App';
import './styles/main.scss';

const render = () => {
  ReactDOM.render(<App />, document.getElementById('app'));
};

render();
