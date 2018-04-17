import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tile from './Tile';

function maketile(isBomb) {
  return {
    x: 0,
    y: 0,
    bombsNearby: 0,
    isBomb,
    isFlagged: false,
    isDefused: false,
  };
}

class Board extends Component {
  /**
   * Creates an instance of Board.
   * @param {number} height height
   * @param {number} width width
   * @memberof Board
   */
  constructor(props) {
    super(props);
    const { height, width } = props;

    this.state = {
      board: [],
    };

    this.height = height;
    this.width = width;
    this.directions = {
      N: (x, y) => [x, y - 1],
      NE: (x, y) => [x + 1, y - 1],
      E: (x, y) => [x + 1, y],
      SE: (x, y) => [x + 1, y + 1],
      S: (x, y) => [x, y + 1],
      SW: (x, y) => [x - 1, y + 1],
      W: (x, y) => [x - 1, y],
      NW: (x, y) => [x - 1, y - 1],
    };

    this.init();
    this.shuffle();
    this.toMatrix();
    this.mark();
  }

  /**
   * Constructs the board as a flat array,
   * assigning bombs on the first n indices.
   */
  init = () => {
    const bombs = (this.width * this.height) / 10;
    this.state.board = Array(this.width * this.height)
      .fill()
      .map((x, i) => maketile(i < bombs));
  }

  /**
   * Fisher–Yates shuffle distributes
   * bombs randomly around the board.
   */
  shuffle = () => {
    const { board } = this.state;
    let curr = board.length;
    let rand = 0;
    let temp = null;
    while (curr !== 0) {
      rand = Math.floor(Math.random() * curr);
      curr -= 1;
      temp = board[curr];
      board[curr] = board[rand];
      board[rand] = temp;
    }
  }

  /**
   * Reduces flat board array into a matrix.
   */
  toMatrix = () => {
    let y = 0;
    let x = 0;
    let c = 0;
    this.state.board = this.state.board.reduce((acc, tile, i) => {
      c++;
      /* eslint-disable no-param-reassign */
      tile.x = x++;
      tile.y = y;
      /* eslint-enable no-param-reassign */

      acc[acc.length - 1].push(tile);
      if (c === this.width) {
        c = 0;
        x = 0;
        y++;
        if (i + 1 < this.state.board.length) acc.push([]);
      }
      return acc;
    }, [[]]);
  }

  mark = () => {
    this.state.board = this.state.board.map((row, x) => row.map((sq, y) => {
      /* eslint-disable no-param-reassign */
      sq.bombsNearby = sq.isBomb ? -1 : this.bombsNearby(x, y);
      /* eslint-enable no-param-reassign */
      return sq;
    }));
  }

  bombsNearby = (x, y) => {
    let n = 0;
    Object
      .keys(this.directions)
      .forEach(k => {
        n += this.tileStep(...this.directions[k](x, y));
      });
    return n;
  }

  tileStep = (x, y) => {
    const { board } = this.state;
    if (!board[x] || !board[x][y]) return 0;
    return Number(board[x][y].isBomb);
  }

  reveal(tile) {
    const board = this.state.board.slice(0);
    const toVisit = new Map([[[tile.x, tile.y].toString(), true]]);
    const visited = new Map();

    const step = (x, y) => {
      if (!board[y] || !board[y][x]) return;
      const t = board[y][x];
      if (t.bombsNearby === 0 && !toVisit.has([x, y].toString())) {
        toVisit.set([x, y].toString(), true);
      }
      if (!t.isBomb) t.isDefused = true;
    };

    const walk = () => {
      const it = toVisit.keys();
      const { value, done } = it.next();
      if (done) {
        this.setState({ board });
        return;
      }
      Object.keys(this.directions).forEach(k => {
        if (!visited.has(value)) {
          const [x, y] = value.split(',');
          step(...this.directions[k](Number(x), Number(y)));
        }
      });
      toVisit.delete(value);
      visited.set(value, true);
      walk();
    };
    return walk();
  }

  revealBombs() {
    this.setState({
      board: this.state.board.map(row => row.map(tile => {
        if (tile.isBomb) {
          tile.isDefused = true; // eslint-disable-line no-param-reassign
        }
        return tile;
      })),
    });
  }


  handleLeftClick = (x, y) => () => {
    const board = this.state.board.slice(0);
    const tile = board[y][x];
    tile.isDefused = true;

    if (tile.isBomb) {
      this.props.gameOver();
      this.revealBombs();
    }
    if (tile.bombsNearby > 0) {
      return this.setState({ board });
    }

    return this.reveal(tile);
  }

  handleRightClick = (x, y) => event => {
    event.preventDefault();
  }


  render = () => {
    const { board } = this.state;
    let k = 0;
    let j = 0;
    return (
      <table>
        <tbody>
          {board.map(row => (
            <tr key={k++}>
              {row.map(tile => (
                <Tile
                  handleRightClick={this.handleRightClick}
                  handleLeftClick={this.handleLeftClick}
                  key={k + j++}
                  {...tile}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Board.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  gameOver: PropTypes.func.isRequired,
};

export default Board;
