import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import flag from '../images/flag.png';
import mine from '../images/mine.png';
import * as constants from './constants';

import css from './Tile.scss';

const Tile = ({
  bombsNearby,
  handleChangeEmotion,
  handleLeftClick,
  handleRightClick,
  isBomb,
  isDefused,
  isFlagged,
  isGameOver,
  isLastClick,
  x,
  y,
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
    [css.isLastClick]: isLastClick,
  });

  const text = () => {
    if (isFlagged && isDefused && isBomb) return <img className={css.flag} src={flag} alt='flagged' />;
    if (isFlagged) return <img className={css.flag} src={flag} alt='flagged' />;
    if (isDefused && isBomb) return <img className={css.flag} src={mine} alt='mine' />;
    if (isDefused) return bombsNearby ? <b style={{ color }}>{bombsNearby}</b> : '';
    return '';
  };

  return (
    <button
      disabled={isGameOver}
      className={btnClasses}
      onMouseDown={event => {
        if (isDefused) return;
        handleChangeEmotion(event, constants.WORRY);
      }}
      onClick={handleLeftClick(x, y)}
      onContextMenu={handleRightClick(x, y)}
    >
      {text()}
    </button>
  );
};

Tile.propTypes = {
  bombsNearby: PropTypes.number.isRequired,
  handleChangeEmotion: PropTypes.func.isRequired,
  handleLeftClick: PropTypes.func.isRequired,
  handleRightClick: PropTypes.func.isRequired,
  isBomb: PropTypes.bool.isRequired,
  isDefused: PropTypes.bool.isRequired,
  isFlagged: PropTypes.bool.isRequired,
  isGameOver: PropTypes.bool.isRequired,
  isLastClick: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};


export default onlyUpdateForKeys(['isFlagged', 'isDefused', 'isGameOver'])(Tile);
