import React, { Component, Fragment } from 'react';
import Board from './Board';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  gameOver = () => {
    alert('game over!');
  }

  render() {
    return (
      <Fragment>
        <Board gameOver={this.gameOver} width={10} height={5} />
      </Fragment>
    );
  }
}


export default Game;
