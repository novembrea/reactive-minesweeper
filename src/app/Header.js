import React, { Component } from 'react';
import PropTypes from 'prop-types';

import basic from '../images/1f610.png';
import cool from '../images/1f60e.png';
import dead from '../images/1f635.png';
import worry from '../images/1f61f.png';
import css from './Header.scss';

import * as constants from './constants';


class Header extends Component {
  state = {
    elapsed: 0,
  }

  componentWillReceiveProps(np) {
    const nextIsGameStarted = np.isGameStarted;
    const nextIsGameOver = np.isGameOver;
    const { isGameStarted, isGameOver } = this.props;
    // The game was restarted via click on an emoji, clear the timer.
    if (!nextIsGameOver && isGameOver) this.setState({ elapsed: 0 });

    // The game was started via click on a tile, start new timer.
    if (nextIsGameStarted && !isGameStarted) this.start();

    // Player has encountered a bomb, freeze timer.
    if (nextIsGameOver && !isGameOver) this.stop();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }


  stop() {
    clearInterval(this.timer);
  }

  start() {
    clearInterval(this.timer);
    this.timer = setInterval(this.tick.bind(this), 100);
  }

  tick = () => {
    this.setState({ elapsed: (this.state.elapsed + 1) });
  }

  render() {
    const {
      bombsLeft,
      emotion,
      restartGame,
    } = this.props;
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
        emoji = basic;
        break;
    }
    return (
      <div className={css.header}>
        <div className={css.counter}>
          {bombsLeft < 0 ? 0 : bombsLeft}
        </div>
        <button className={css.btn} onClick={restartGame}>
          <img
            className={css.emoji}
            src={emoji}
            alt=''
          />
        </button>
        <div className={css.counter}>
          {(this.state.elapsed / 10).toFixed(1)}
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  isGameStarted: PropTypes.bool.isRequired,
  isGameOver: PropTypes.bool.isRequired,
  bombsLeft: PropTypes.number.isRequired,
  emotion: PropTypes.string.isRequired,
  restartGame: PropTypes.func.isRequired,
};

export default Header;
