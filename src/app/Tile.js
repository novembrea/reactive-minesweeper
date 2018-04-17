import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import flag from '../images/flag.png';
import mine from '../images/mine.png';

import css from './Tile.scss';

const Tile = ({
  handleLeftClick,
  handleRightClick,
  x,
  y,
  bombsNearby,
  isBomb,
  isFlagged,
  isDefused,
}) => {
  const btnClasses = cn({
    [css.button]: true,
  });
  const text = () => {
    if (isFlagged) return <img className={css.flag} src={flag} alt='flagged' />;
    if (isDefused && isBomb) return <img className={css.flag} src={mine} alt='mine' />;
    if (isDefused) return bombsNearby || '';
    if (isDefused && bombsNearby > 0) return <b>{bombsNearby}</b>;
    return '???';
    // return `${x} ${y}`;
  };
  return (
    <td>
      <button
        className={btnClasses}
        onClick={handleLeftClick(x, y)}
        onContextMenu={handleRightClick(x, y)}
      >
        {text()}
      </button>
    </td>
  );
};

Tile.propTypes = {
  handleRightClick: PropTypes.func.isRequired,
  handleLeftClick: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  bombsNearby: PropTypes.number.isRequired,
  isBomb: PropTypes.bool.isRequired,
  isFlagged: PropTypes.bool.isRequired,
  isDefused: PropTypes.bool.isRequired,
};


export default onlyUpdateForKeys(['isFlagged', 'isDefused'])(Tile);
