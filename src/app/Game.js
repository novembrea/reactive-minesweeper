import React, { Component } from 'react';
import Header from './Header';
import Board from './Board';

import css from './Game.scss';

import * as emo from './constants';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bombs: 100,
      bombsLeft: 100,
      emotion: 'smile',
      height: 15,
      isGameOver: false,
      isGameStarted: false,
      width: 30,
      key: 0,
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
      this.setState({ emotion: 'smile' });
    }
  }


  /**
   * Starts the game after the first click on a tile.
   * Activates the timer in Header component.
   */
  startGame = () => {
    this.setState({
      emotion: emo.SMILE,
      isGameOver: false,
      isGameStarted: true,
    });
  }


  /**
   * Ends the game, preventing interaction with tiles.
   * Halts the timer in Header component.
   */
  finishGame = () => {
    this.setState({
      emotion: 'dead',
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
  restartGame = () => {
    if (this.state.isGameStarted) {
      return this.setState({
        bombs: 100,
        bombsLeft: 100,
        emotion: 'smile',
        height: 15,
        isGameOver: false,
        isGameStarted: false,
        width: 30,
        key: this.state.key + 1,
      });
    }
    return this.setState({
      emotion: emo.SMILE,
      isGameOver: false,
      isGameStarted: false,
    });
  }

  incrementBombsLeft = () => this.setState({ bombsLeft: this.state.bombsLeft + 1 })
  decrementBombsLeft = () => this.setState({ bombsLeft: this.state.bombsLeft - 1 })

  handleChangeEmotion = (event, emotion) => {
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
