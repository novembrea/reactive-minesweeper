import React, { Component } from 'react';
import PropTypes from 'prop-types';
import random from 'lodash/random';
import Tile from './Tile';


import css from './Board.scss';


/**
 * Tile producer.
 * @param {boolean} isBomb is tile a bomb
 */
function maketile(isBomb) {
  return {
    x: 0,
    y: 0,
    bombsNearby: 0,
    isBomb,
    isFlagged: false,
    isQuestion: false,
    isDefused: false,
    isLastClick: false,
  };
}

/**
 * Game board manager, handles all interactions.
 *
 * @class Board
 * @extends {Component}
 */
class Board extends Component {
  constructor(props) {
    super(props);
    const { height, width, bombs } = props;

    this.board = [];
    this.height = height;
    this.width = width;
    this.bombs = bombs;
    this.defusedCount = 0;
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

    this.setup();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isGameOver && !nextProps.isGameOver) {
      this.bombs = nextProps.bombs;
      this.setup();
    }
  }

  /**
   * Setup launcher.
   */
  setup = () => {
    this.init();
    this.shuffle();
    this.toMatrix();
    this.assignMarkers();
    this.revealInitial();
  }

  /**
   * Constructs the board as a flat array and
   * assigns bombs on the first n indices.
   */
  init = () => {
    this.board = Array(this.width * this.height)
      .fill()
      .map((x, i) => maketile(i < this.bombs));
  }

  /**
   * Fisher–Yates shuffle distributes
   * bombs randomly around the board.
   */
  shuffle = () => {
    const b = this.board;
    let curr = b.length;
    let rand = 0;
    let temp = null;
    while (curr !== 0) {
      rand = Math.floor(Math.random() * curr);
      curr -= 1;
      temp = b[curr];
      b[curr] = b[rand];
      b[rand] = temp;
    }
  }

  /**
   * Reduces flat board array into a matrix.
   */
  toMatrix = () => {
    let y = 0;
    let x = 0;
    let c = 0;

    this.board = this.board.reduce((acc, tile, i) => {
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
        if (i + 1 < this.board.length) acc.push([]);
      }
      return acc;
    }, [[]]);
  }


  /**
   * Assigns numeric markers to a bomb surrounding tiles.
   */
  assignMarkers = () => {
    this.board = this.board.map((row, y) => row.map((tile, x) => {
      /* eslint-disable no-param-reassign */
      tile.bombsNearby = tile.isBomb ? -1 : this.walkAround(x, y).filter(t => t.isBomb).length;
      /* eslint-enable no-param-reassign */
      return tile;
    }));
  }

  /**
   * Get player something to start with by revealing intial bomb free location.
   * !Good optimization candidate.
   */
  revealInitial = () => {
    const randXY = () => [random(0, this.width - 1), random(0, this.height - 1)];
    let defused = false;
    while (!defused) {
      const [x, y] = randXY();
      const tile = this.board[y][x];
      if (!tile.isBomb && tile.bombsNearby === 0) {
        this.defuseSurroundingTiles(x, y);
        defused = true;
        return;
      }
    }
  }

  /**
   * Goes in all directions around the given coordinates
   * and returns array of surrounding tiles.
   */
  walkAround = (x, y) => {
    const b = this.board;
    const surroundingTiles = [];

    const step = (xCoord, yCoord) => {
      if (!b[yCoord] || !b[yCoord][xCoord]) return false;
      return b[yCoord][xCoord];
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
   * @param {number} startingX x coord
   * @param {number} startingY y coord
   */
  defuseSurroundingTiles(startingX, startingY) {
    // Track tiles that need visiting and already visited ones.
    // Stringify coordinates in order to avoid key duplicaions in a set.
    const toVisit = new Set([[startingX, startingY].toString()]);
    const visited = new Set();
    const walk = () => {
      const it = toVisit.keys();
      const { value, done } = it.next();
      if (done) {
        return;
      }

      if (!visited.has(value)) {
        const [x, y] = value.split(',');
        this.walkAround(Number(x), Number(y)).forEach(t => {
          if (t.isDefused || t.isFlagged) return;
          if (t.bombsNearby === 0 && !toVisit.has([t.x, t.y].toString())) {
            toVisit.add([t.x, t.y].toString());
          }
          if (!t.isBomb && !t.isDefused) {
            this.defusedCount++;
            /* eslint-disable no-param-reassign */
            t.isDefused = true;
            t.isFlagged = false;
            t.isQuestion = false;
            /* eslint-enable no-param-reassign */
          }
        });
      }

      visited.add(value);
      toVisit.delete(value);
      walk();
    };

    walk();
  }

  /**
   * When the game is over reveal location of all bombs.
   */
  revealBombs() {
    this.board = this.board.map(row => row.map(tile => {
      if (tile.isBomb) {
        tile.isDefused = true; // eslint-disable-line no-param-reassign
      }
      return tile;
    }));
  }

  handleLeftClick = (x, y) => event => {
    const {
      isGameStarted,
      finishGame,
      startGame,
      isGameOver,
    } = this.props;

    const b = this.board;
    const tile = b[y][x];

    if (isGameOver) return false;
    if (tile.isDefused || tile.isFlagged || tile.isQuestion) {
      return this.handleRightClick(x, y)(event);
    }
    if (!isGameStarted) startGame();

    // Game ends with a lose.
    if (tile.isBomb) {
      tile.isLastClick = true;
      this.revealBombs();
      return finishGame();
    }

    tile.isDefused = true;
    tile.isFlagged = false;
    this.defusedCount++;

    // Game ends with a win.
    if (this.defusedCount === (this.height * this.width) - this.bombs) {
      this.revealBombs();
      return finishGame(true);
    }

    if (tile.bombsNearby > 0) {
      return this.forceUpdate();
    }

    this.defuseSurroundingTiles(tile.x, tile.y);
    return this.forceUpdate();
  }

  handleRightClick = (x, y) => event => {
    const { isGameOver, isGameStarted, startGame } = this.props;
    event.preventDefault();
    const b = this.board;
    const tile = b[y][x];

    if (tile.isDefused || isGameOver) return false;
    if (!isGameStarted) startGame();

    switch (true) {
      case !tile.isFlagged && !tile.isQuestion:
        tile.isFlagged = true;
        tile.isQuestion = false;
        this.props.decrementBombsLeft();
        break;

      case tile.isFlagged:
        tile.isFlagged = false;
        tile.isQuestion = true;
        this.props.incrementBombsLeft();
        break;

      case tile.isQuestion:
        tile.isFlagged = false;
        tile.isQuestion = false;
        break;

      default:
        break;
    }
    return this.forceUpdate();
  }

  render() {
    const { handleChangeEmotion, isGameOver } = this.props;
    let k = 0;
    let j = 0;
    return (
      <section className={css.board}>
        {this.board.map(row => (
          <div className={css.row} key={k++}>
            {row.map(tile => (
              <Tile
                isGameOver={isGameOver}
                handleChangeEmotion={handleChangeEmotion}
                handleRightClick={this.handleRightClick}
                handleLeftClick={this.handleLeftClick}
                key={k + j++}
                {...tile}
              />
            ))}
          </div>
        ))}
      </section>
    );
  }
}

Board.propTypes = {
  bombs: PropTypes.number.isRequired,
  decrementBombsLeft: PropTypes.func.isRequired,
  handleChangeEmotion: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  incrementBombsLeft: PropTypes.func.isRequired,
  isGameStarted: PropTypes.bool.isRequired,
  isGameOver: PropTypes.bool.isRequired,
  finishGame: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

export default Board;
