import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import flag from '../images/flag.png';

import css from './Tile.scss';

const Tile = ({
  handleLeftClick,
  handleRightClick,
  tile,
}) => {
  const {
    x,
    y,
    bombsNearby,
    isBomb,
    isFlagged,
    isDefused,
  } = tile;
  const btnClasses = cn({
    [css.button]: true,
    [css.isBomb]: isBomb,
  });
  const text = () => {
    if (isFlagged) return <img className={css.flag} src={flag} alt='flagged' />;
    if (isDefused) return bombsNearby;
    return '???';
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
  tile: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    bombsNearby: PropTypes.number,
    isBomb: PropTypes.bool,
    isFlagged: PropTypes.bool,
    isDefused: PropTypes.bool,
  }).isRequired,
};


export default Tile;
