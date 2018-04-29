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
    bombsNearby: 0,
    isBomb,
    isDefused: false,
    isFlagged: false,
    isLastClick: false,
    isQuestion: false,
    x: 0,
    y: 0,
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
    this.bombs = bombs;
    this.defusedCount = 0;
    this.height = height;
    this.width = width;
    this.isLeftMouseDown = false;
    this.isRightMouseDown = false;

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

  componentWillMount() {
    document.addEventListener('mouseup', this.interceptMouseUp);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.isGameOver && !this.props.isGameOver)
      || nextProps.bombs !== this.props.bombs) {
      const { height, width, bombs } = nextProps;
      this.board = [];
      this.bombs = bombs;
      this.bombs = bombs;
      this.defusedCount = 0;
      this.height = height;
      this.width = width;
      this.setup();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.interceptMouseUp);
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
    let c = 0;
    let x = 0;
    let y = 0;

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

    Object.keys(this.directions).forEach(k => {
      const tile = step(...this.directions[k](x, y));
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

  /**
   * Global mouseUp interceptor, restores mouse down states
   * and sets default emotion state back from worry face.
   */
  interceptMouseUp = event => {
    this.isLeftMouseDown = false;
    this.isRightMouseDown = false;
    if (!this.props.isGameOver) {
      this.props.handleChangeEmotion(event, 'smile');
    }
  }

  /**
   * Checks if a tile where left+right mouse clicked
   * has correct amout of adjacent flagged tiles.
   * I.e. tile with marker 3 has to have 3 adjacent flags.
   */
  isAdjacentFlagsEqual = (x, y, bombsNearby) => this.walkAround(x, y)
    .filter(t => t.isFlagged)
    .length === bombsNearby

  /**
   * Part of a feature where user flags bombs around a defused marked
   * tile and issues left+right mouse click on this tile.
   * If adjacent flagged tiles === mark on a clicked tile,
   * open up all adjacent tiles and if any of those are clear ones —
   * being standard recursive defusing. If user marked wrong then kaboom.
   * @see https://images.pcworld.com/images/article/2011/08/minesweeper2-5210135.png
   * TODO: screenshot features automatic flagging in situaion where bomb location is obvious,
   * it would be interesting to implement it.
   *
   * left and right press handlers work a simple state machine to
   * capture the clicks themselves and call @method maybeDefuseAdjacent
   * Clicks state is cleared by @method interceptMouseUp.
   */
  handleLeftPress = (x, y, bombsNearby, event) => {
    if (event.button === 2) return;
    this.isLeftMouseDown = true;
    if (this.isRightMouseDown) {
      this.maybeDefuseAdjacent(x, y, bombsNearby);
    }
  }

  /**
   * @see handleLeftPress
   */
  handleRightPress = (x, y, bombsNearby, event) => {
    if (event.button === 1) return;
    event.preventDefault();
    this.isRightMouseDown = true;
    if (this.isLeftMouseDown) {
      this.maybeDefuseAdjacent(x, y, bombsNearby);
    }
  }

  /**
   * When left+right mouse clicked on a defused marked tile.
   * @see handleLeftPress
   */
  maybeDefuseAdjacent = (x, y, bombsNearby) => {
    if (this.isAdjacentFlagsEqual(x, y, bombsNearby)) {
      this.walkAround(Number(x), Number(y)).forEach(t => {
        if (t.isBomb && !t.isFlagged) {
          /* eslint-disable no-param-reassign */
          t.isLastClick = true;
          /* eslint-enable no-param-reassign */
          this.revealBombs();
          this.props.finishGame(false);
        }
        if (!t.isDefused && !t.isBomb) {
          this.defusedCount++;
          /* eslint-disable no-param-reassign */
          t.isDefused = true;
          this.defuseSurroundingTiles(t.x, t.y);
          /* eslint-enable no-param-reassign */
        }
      });
    }
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

    // When clicked on marked tile delegate logic to the RightClick handler.
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
    const { handleChangeEmotion, isGameOver, isDebugging } = this.props;
    let k = 0;
    let j = 0;
    return (
      <section className={css.board}>
        {this.board.map(row => (
          <div className={css.row} key={k++}>
            {row.map(tile => (
              <Tile
                handleLeftPress={this.handleLeftPress}
                handleRightPress={this.handleRightPress}
                handleChangeEmotion={handleChangeEmotion}
                handleLeftClick={this.handleLeftClick}
                handleRightClick={this.handleRightClick}
                isDebugging={isDebugging}
                isGameOver={isGameOver}
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
  finishGame: PropTypes.func.isRequired,
  handleChangeEmotion: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  incrementBombsLeft: PropTypes.func.isRequired,
  isDebugging: PropTypes.bool.isRequired,
  isGameOver: PropTypes.bool.isRequired,
  isGameStarted: PropTypes.bool.isRequired,
  startGame: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

export default Board;
