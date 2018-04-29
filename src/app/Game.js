import React, { Component, Fragment } from 'react';

import Header from './Header';
import Board from './Board';
import Settings from './Settings';

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
      ...constants.INTERMEDIATE,
      emotion: constants.SMILE,
      isDebugging: false,
      isGameOver: false,
      isGameStarted: false,
      isSettingsOpen: false,
      key: 0,
    };
  }

  toggleSettings = () => {
    this.setState({ isSettingsOpen: !this.state.isSettingsOpen });
  }

  toggleDebug = () => {
    const { isDebugging } = this.state;
    this.setState({
      isDebugging: !isDebugging,
    });
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
   * to invalidate entire component tree.
   *
   * @param {string} newDifficulty if the game was restarted from Settings
   */
  restartGame = newDifficulty => {
    let { difficulty } = this.state;
    if (newDifficulty) difficulty = newDifficulty;
    return this.setState({
      ...constants[difficulty],
      emotion: constants.SMILE,
      isGameOver: false,
      isGameStarted: false,
      key: this.state.key + 1,
    });
  }

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
      difficulty,
      emotion,
      height,
      isDebugging,
      isGameOver,
      isGameStarted,
      isSettingsOpen,
      width,
    } = this.state;
    return (
      <Fragment>
        <aside className={css.settingsBtn}>
          <button onClick={this.toggleSettings}>
            settings
          </button>
        </aside>
        <Settings
          currentDifficulty={difficulty}
          isDebugging={isDebugging}
          isOpen={isSettingsOpen}
          setDifficulty={this.restartGame}
          toggleDebug={this.toggleDebug}
        />
        <section key={this.state.key} className={css.game}>
          <Header
            bombsLeft={bombsLeft}
            emotion={emotion}
            isDebugging={isDebugging}
            isGameOver={isGameOver}
            isGameStarted={isGameStarted}
            restartGame={this.restartGame}
          />
          <Board
            bombs={bombs || (width * height) / 10}
            decrementBombsLeft={this.decrementBombsLeft}
            finishGame={this.finishGame}
            handleChangeEmotion={this.handleChangeEmotion}
            height={height}
            incrementBombsLeft={this.incrementBombsLeft}
            isDebugging={isDebugging}
            isGameOver={isGameOver}
            isGameStarted={isGameStarted}
            startGame={this.startGame}
            width={width}
          />
        </section>
      </Fragment>
    );
  }
}


export default Game;
