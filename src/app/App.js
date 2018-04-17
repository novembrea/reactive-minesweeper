import React, { Fragment } from 'react';
import Helmet from 'react-helmet';

/* eslint-disable import/no-extraneous-dependencies */
import { hot } from 'react-hot-loader';

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
    Kaboom!
  </Fragment>
);

export default hot(module)(App);

