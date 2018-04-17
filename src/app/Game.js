import React, { Component, Fragment } from 'react';
import Board from './Board';
import Tile from './Tile';

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new Board(6, 6).board,
    };
  }

  handleLeftClick = (x, y) => event => {
    const board = this.state.board.slice();
    board[x][y].isDefused = true;
    this.setState({ board });
  }

  handleRightClick = (x, y) => event => {
    event.preventDefault();
    const board = this.state.board.slice();
    board[x][y].flipFlag();
    this.setState({ board });
  }

  render() {
    const { board } = this.state;
    let k = 0;
    return (
      <Fragment>
        <p>table</p>
        <table>
          <tbody>
            {board.map(row => (
              <tr key={k++}>
                {row.map(tile => (
                  <Tile
                    handleRightClick={this.handleRightClick}
                    handleLeftClick={this.handleLeftClick}
                    key={tile.x + tile.y}
                    tile={tile}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}


export default Game;
