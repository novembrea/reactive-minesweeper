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

/**
 * Game board manager, takes care of all logic.
 *
 * @class Board
 * @extends {Component}
 */
class Board extends Component {
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

    // These methods directly mutate state before
    // component has mounted.
    this.init();
    this.shuffle();
    this.toMatrix();
    this.assignMarkers();
  }

  /**
   * Constructs the board as a flat array and
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

      // Row has been filled — insert another array.
      if (c === this.width) {
        c = 0;
        x = 0;
        y++;

        // Skip insertion on the last iteration.
        if (i + 1 < this.state.board.length) acc.push([]);
      }
      return acc;
    }, [[]]);
  }


  /**
   * Assigns numeric markers to a bomb surrounding tiles.
   */
  assignMarkers = () => {
    this.state.board = this.state.board.map((row, x) => row.map((tile, y) => {
      /* eslint-disable no-param-reassign */
      tile.bombsNearby = tile.isBomb ? -1 : this.walkAround(x, y).filter(t => t.isBomb).length;
      /* eslint-enable no-param-reassign */
      return tile;
    }));
  }

  /**
   * Goes in all directions around the given coordinates
   * and returns array of surrounding tiles.
   */
  walkAround = (x, y) => {
    const { board } = this.state;
    const surroundingTiles = [];

    const step = (xCoord, yCoord) => {
      if (!board[xCoord] || !board[xCoord][yCoord]) return false;
      return board[xCoord][yCoord];
    };

    Object.values(this.directions).forEach(direction => {
      const tile = step(...direction(x, y));
      if (tile) surroundingTiles.push(tile);
    });

    return surroundingTiles;
  }


  /**
   * If the clicked tile is clear, i.e. not a bomb and has no nearby bombs,
   * start recursive journey around surrounding tiles and defuse
   * all adjacent clear ones.
   *
   * @param {object} tile starting tile
   */
  defuseSurroundingTiles(tile) {
    const board = this.state.board.slice(0);

    // Track tiles that need visiting and already visited ones.
    // Stringify coordinates in order to avoid key duplicaions in a map.
    const toVisit = new Set([[tile.x, tile.y].toString()]);
    const visited = new Set();

    const walk = () => {
      const it = toVisit.keys();
      const { value, done } = it.next();
      if (done) {
        this.setState({ board });
        return;
      }

      if (!visited.has(value)) {
        const [x, y] = value.split(',');
        this.walkAround(Number(y), Number(x)).forEach(t => {
          if (t.bombsNearby === 0 && !toVisit.has([t.x, t.y].toString())) {
            toVisit.add([t.x, t.y].toString());
          }
          if (!t.isBomb) t.isDefused = true; // eslint-disable-line no-param-reassign
        });
      }
      toVisit.delete(value);
      visited.add(value);
      walk();
    };

    return walk();
  }


  /**
   * When the game is over reveal location of all bombs.
   */
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

    return this.defuseSurroundingTiles(tile);
  }

  handleRightClick = (x, y) => event => {
    event.preventDefault();
    const board = this.state.board.slice(0);
    const tile = board[y][x];
    tile.isFlagged = !tile.isFlagged;
    return this.setState({ board });
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
