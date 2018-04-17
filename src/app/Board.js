
class Tile {
  /**
   * Creates an instance of Tile.
   * @param {boolean} isBomb is tile a bomb
   * @memberof Tile
   */
  constructor(isBomb) {
    this.x = 0;
    this.y = 0;
    this.bombsNearby = 0;
    this.isBomb = isBomb;
    this.isFlagged = false;
    this.isDefused = false;
  }

  flipFlag() {
    this.isFlagged = !this.isFlagged;
  }

  set xCoord(x) {
    this.x = x;
  }

  set yCoord(y) {
    this.y = y;
  }

  set bombs(bombsNearby) {
    this.bombsNearby = bombsNearby;
  }

  set defuse(isDefused) {
    this.isDefused = isDefused;
  }
}

class Board {
  /**
   * Creates an instance of Board.
   * @param {number} height height
   * @param {number} width width
   * @memberof Board
   */
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.board = [];
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

    this.reveal = this.reveal;

    this.seed();
    this.shuffle();
    this.toMatrix();
    this.mark();
  }

  /**
   * Constructs the board as a flat array,
   * assigning bombs on the first n indices.
   *
   * @memberof Board
   */
  seed() {
    const bombs = (this.width * this.height) / 5;
    this.board = Array(this.width * this.height)
      .fill()
      .map((x, i) => new Tile(i < bombs));
  }

  /**
   * Fisher–Yates shuffle distributes
   * bombs randomly around the board.
   *
   * @memberof Board
   */
  shuffle() {
    let curr = this.board.length;
    let rand = 0;
    let temp = null;
    while (curr !== 0) {
      rand = Math.floor(Math.random() * curr);
      curr -= 1;
      temp = this.board[curr];
      this.board[curr] = this.board[rand];
      this.board[rand] = temp;
    }
  }

  /**
   * Converts flat board array into a matrix.
   *
   * @memberof Board
   */
  toMatrix() {
    let x = 0;
    let y = 0;
    this.board = this.board.reduce((acc, tile, i) => {
      if (i > 0 && i % (this.height) === 0) {
        x++;
        y = 0;
      }
      /* eslint-disable no-param-reassign */
      tile.xCoord = x;
      tile.yCoord = y++;
      /* eslint-enable no-param-reassign */
      if (i % (this.board.length / this.width) === 0 && i !== 0) acc.push([]);
      acc[acc.length - 1].push(tile);
      return acc;
    }, [[]]);
  }

  mark() {
    this.board = this.board.map((row, x) => row.map((sq, y) => {
      /* eslint-disable no-param-reassign */
      sq.bombsNearby = sq.isBomb ? -1 : this.bombsNearby(x, y);
      /* eslint-enable no-param-reassign */
      return sq;
    }));
  }


  bombsNearby(x, y) {
    let n = 0;
    Object
      .keys(this.directions)
      .forEach(k => {
        n += this.tileStep(...this.directions[k](x, y));
      });
    return n;
  }

  tileStep(x, y) {
    const tb = this.board;
    if (!tb[x] || !tb[y] || !tb[x][y]) return 0;
    return Number(tb[x][y].isBomb);
  }

  reveal(x, y) {
    const tb = this.board;
    const toVisit = new Map([[String([x, y]), true]]);
    const visited = new Map();
    const step = (xx, yy) => {
      if (!tb[xx] || !tb[yy] || !tb[xx][yy]) return;
      const t = tb[xx][yy];
      if (t.bombsNearby === 0 && !toVisit.has(String([xx, yy]))) {
        toVisit.set(String([xx, yy]), true);
      }
      if (!t.isBomb) t.isDefused = true;
    };
    const walk = () => {
      const it = toVisit.keys();
      let run = true;
      while (run) {
        const { value, done } = it.next();
        if (done) {
          run = false;
          return;
        }
        Object.values(this.directions).forEach(direction => {
          if (!visited.has(value)) {
            const [a, b] = value.split(',');
            step(...direction(Number(a), Number(b)));
          }
        });
        toVisit.delete(value);
        visited.set(value, true);
        if (toVisit.size > 0) walk();
      }
    };

    walk();
  }
}

export default Board;
