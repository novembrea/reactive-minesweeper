import React, { Component } from 'react';
import Header from './Header';
import Board from './Board';

import css from './Game.scss';

import * as emo from './constants';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emotion: 'default',
      isGameOver: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mouseup', () => {
      console.log('mup');
      if (!this.state.isGameOver) {
        this.setState({ emotion: 'smile' });
      }
    });
  }

  setGameOver = () => {
    this.setState({
      isGameOver: true,
      emotion: 'dead',
    });
  }

  restartGame = () => {
    this.setState({ isGameOver: false, emotion: emo.SMILE });
  }

  handleChangeEmotion = emotion => event => {
    if (event.button === 2) return;
    this.setState({ emotion });
  }

  render() {
    const { emotion, isGameOver } = this.state;
    return (
      <section className={css.game}>
        <Header
          restartGame={this.restartGame}
          emotion={emotion}
        />
        <Board
          handleChangeEmotion={this.handleChangeEmotion}
          height={30}
          isGameOver={isGameOver}
          setGameOver={this.setGameOver}
          width={30}
        />
      </section>
    );
  }
}


export default Game;
