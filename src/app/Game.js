import React, { Component } from 'react';

import Header from './Header';
import Board from './Board';
import css from './Game.scss';
import * as constants from './constants';

/**
 * Game state manager, sets the rules and
 * gives Board methods to manipulate state.
 *
 * @class Game
 * @extends {Component}
 */
class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bombs: constants.DEFAULT_BOMBS,
      bombsLeft: constants.DEFAULT_BOMBS,
      emotion: constants.SMILE,
      height: constants.DEFAULT_HEIGHT,
      isGameOver: false,
      isGameStarted: false,
      key: 0,
      width: constants.DEFAULT_WIDTH,
    };
  }

  componentWillMount() {
    document.addEventListener('mouseup', this.interceptMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.interceptMouseUp);
  }

  interceptMouseUp = () => {
    if (!this.state.isGameOver) {
      this.setState({ emotion: constants.SMILE });
    }
  }


  /**
   * Starts the game after the first click on a tile.
   * Activates the timer in Header component.
   */
  startGame = () => {
    this.setState({
      emotion: constants.SMILE,
      isGameOver: false,
      isGameStarted: true,
    });
  }


  /**
   * Ends the game, preventing interaction with tiles.
   * Halts the timer in Header component.
   */
  finishGame = (isWin = false) => {
    this.setState({
      emotion: isWin ? constants.COOL : constants.DEAD,
      isGameOver: true,
      isGameStarted: false,
    });
  }

  /**
   * Restarts the game from isGameOver state.
   * If the game is running when the restart is requested
   * set the state to defaults and increment the <key>
   * in to invalidate entire component tree.
   */
  restartGame = () => this.setState({
    bombs: constants.DEFAULT_BOMBS,
    bombsLeft: constants.DEFAULT_BOMBS,
    emotion: constants.SMILE,
    height: constants.DEFAULT_HEIGHT,
    isGameOver: false,
    isGameStarted: false,
    width: constants.DEFAULT_WIDTH,
    key: this.state.key + 1,
  })

  incrementBombsLeft = () => this.setState({ bombsLeft: this.state.bombsLeft + 1 })
  decrementBombsLeft = () => this.setState({ bombsLeft: this.state.bombsLeft - 1 })

  handleChangeEmotion = (event, emotion) => {
    // Ignore RMC.
    if (event.button === 2) return;
    this.setState({ emotion });
  }

  render() {
    const {
      bombs,
      bombsLeft,
      emotion,
      height,
      isGameOver,
      isGameStarted,
      width,
    } = this.state;
    return (
      <section key={this.state.key} className={css.game}>
        <Header
          bombsLeft={bombsLeft}
          emotion={emotion}
          isGameOver={isGameOver}
          isGameStarted={isGameStarted}
          restartGame={this.restartGame}
        />
        <Board
          bombs={bombs || (width * height) / 10}
          decrementBombsLeft={this.decrementBombsLeft}
          handleChangeEmotion={this.handleChangeEmotion}
          height={height}
          incrementBombsLeft={this.incrementBombsLeft}
          isGameOver={isGameOver}
          isGameStarted={isGameStarted}
          finishGame={this.finishGame}
          startGame={this.startGame}
          width={width}
        />
      </section>
    );
  }
}


export default Game;
