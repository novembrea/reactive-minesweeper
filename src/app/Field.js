import React, { Component, Fragment } from 'react';
import Board from './Board';

class Field extends Component {
  constructor(props) {
    super(props);
    this.b = new Board(6, 6);
  }

  render() {
    let k = 0;
    return (
      <Fragment>
        <p>table</p>
        <table>
          <tbody>
            {this.b.board.map(row => (
              <tr key={k++}>
                {row.map(sq => (
                  <td style={{ border: `5px solid ${sq.isBomb ? 'red' : 'black'}`, padding: 15 }} key={sq.x + sq.y}>
                    {sq.bombsNearby}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Fragment>
    );
  }
}


export default Field;
