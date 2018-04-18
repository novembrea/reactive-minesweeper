import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import flag from '../images/flag.png';
import mine from '../images/mine.png';
import * as constants from './constants';

import css from './Tile.scss';

const Tile = ({
  handleChangeEmotion,
  handleLeftClick,
  handleRightClick,
  x,
  y,
  bombsNearby,
  isBomb,
  isFlagged,
  isDefused,
  isGameOver,
}) => {
  const isMarker = isDefused && bombsNearby > 0;
  let color;
  if (isMarker) {
    switch (bombsNearby) {
      case 1:
        color = 'blue';
        break;
      case 2:
        color = 'green';
        break;
      case 3:
        color = 'red';
        break;
      case 4:
        color = 'ingido';
        break;
      default:
        color = 'inherit';
        break;
    }
  }

  const btnClasses = cn({
    [css.button]: true,
    [css.marker]: isMarker,
    [css.clear]: isDefused,
  });

  const text = () => {
    if (isFlagged) return <img className={css.flag} src={flag} alt='flagged' />;
    if (isDefused && isBomb) return <img className={css.flag} src={mine} alt='mine' />;
    if (isDefused) return bombsNearby ? <b style={{ color }}>{bombsNearby}</b> : '';
    return '';
  };

  const cantClick = isGameOver || isDefused;
  const fnfilter = fn => (cantClick ? () => {} : fn);

  return (
    <button
      // disabled={isGameOver || isDefused} sadly doesn't work properly
      className={btnClasses}
      onMouseDown={fnfilter(handleChangeEmotion(constants.WORRY))}
      onClick={fnfilter(handleLeftClick(x, y))}
      onContextMenu={fnfilter(handleRightClick(x, y))}
    >
      {text()}
    </button>
  );
};

Tile.propTypes = {
  isGameOver: PropTypes.bool.isRequired,
  handleChangeEmotion: PropTypes.func.isRequired,
  handleRightClick: PropTypes.func.isRequired,
  handleLeftClick: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  bombsNearby: PropTypes.number.isRequired,
  isBomb: PropTypes.bool.isRequired,
  isFlagged: PropTypes.bool.isRequired,
  isDefused: PropTypes.bool.isRequired,
};


export default onlyUpdateForKeys(['isFlagged', 'isDefused', 'isGameOver'])(Tile);
