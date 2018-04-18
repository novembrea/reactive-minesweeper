import React from 'react';
import PropTypes from 'prop-types';

import tears from '../images/1f602.png';
import cool from '../images/1f60e.png';
import dead from '../images/1f635.png';
import worry from '../images/1f62e.png';
import css from './Header.scss';

import * as constants from './constants';


const Header = ({ emotion, restartGame }) => {
  let emoji;
  switch (emotion) {
    case constants.WORRY:
      emoji = worry;
      break;
    case constants.COOL:
      emoji = cool;
      break;
    case constants.DEAD:
      emoji = dead;
      break;

    default:
      emoji = tears;
      break;
  }
  return (
    <div className={css.header}>
      <div>
      Bombs left: 100
      </div>
      <button className={css.btn} onClick={restartGame}>
        <img
          className={css.emoji}
          src={emoji}
          alt=''
        />
      </button>
      <div>
      010101
      </div>
    </div>
  );
};

Header.propTypes = {
  emotion: PropTypes.string.isRequired,
  restartGame: PropTypes.func.isRequired,
};

export default Header;
