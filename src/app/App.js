import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

/* eslint-disable import/no-extraneous-dependencies */
import { hot } from 'react-hot-loader';

import Game from './Game';

const App = () => (
  <Fragment>
    <Helmet>
      <title>Minesweeper</title>
      <meta charSet='utf-8' />
      <meta
        name='description'
        content='Minesweeper game in React'
      />
    </Helmet>
    <Game />
  </Fragment>
);

export default hot(module)(App);

