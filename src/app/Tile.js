import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';

import mine from '../images/mine.png';
import * as constants from './constants';

import css from './Tile.scss';

const Tile = ({
  bombsNearby,
  handleChangeEmotion,
  handleLeftClick,
  handleRightClick,
  handleLeftPress,
  handleRightPress,
  isBomb,
  isDebugging,
  isDefused,
  isFlagged,
  isGameOver,
  isLastClick,
  isQuestion,
  x,
  y,
}) => {
  const isMarker = isDefused && bombsNearby > 0;
  let color;
  if (isMarker || isDebugging) {
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
      case 5:
        color = 'darkred';
        break;
      case 6:
        color = 'cornflowerblue';
        break;
      case 7:
        color = 'crimson';
        break;
      case 8:
        color = 'crimson';
        break;
      default:
        color = 'deeppink';
        break;
    }
  }

  const btnClasses = cn({
    [css.button]: true,
    [css.marker]: isMarker || isDebugging,
    [css.clear]: isDefused,
    [css.isLastClick]: isLastClick,
    [css.cross]: isFlagged && isDefused && isBomb,
  });

  // TODO: maybe do something about it.
  const content = () => {
    if (isDebugging && isBomb) return <img className={css.flag} src={mine} alt='mine' />;
    if (isDebugging) return bombsNearby ? <b style={{ color }}>{bombsNearby}</b> : '';
    if (isFlagged && isDefused && isBomb) return <img className={css.flag} src={mine} alt='mine' />;
    if (isQuestion) return '?';
    if (isFlagged) return <span style={{ color: 'red' }}>⚑</span>;
    if (isDefused && isBomb) return <img className={css.flag} src={mine} alt='mine' />;
    if (isDefused) return bombsNearby ? <b style={{ color }}>{bombsNearby}</b> : '';
    return '';
  };

  return (
    <button
      disabled={isGameOver}
      className={btnClasses}
      onMouseDown={event => {
        if (isFlagged || isDebugging) return false;
        if (isDefused) return handleLeftPress(x, y, bombsNearby, event);
        return handleChangeEmotion(event, constants.WORRY);
      }}
      onClick={handleLeftClick(x, y)}
      onContextMenu={event => {
        if (isDefused) return handleRightPress(x, y, bombsNearby, event);
        return handleRightClick(x, y)(event);
      }}
    >
      {content()}
    </button>
  );
};

Tile.propTypes = {
  bombsNearby: PropTypes.number.isRequired,
  handleChangeEmotion: PropTypes.func.isRequired,
  handleLeftClick: PropTypes.func.isRequired,
  handleRightClick: PropTypes.func.isRequired,
  handleLeftPress: PropTypes.func.isRequired,
  handleRightPress: PropTypes.func.isRequired,
  isBomb: PropTypes.bool.isRequired,
  isDebugging: PropTypes.bool.isRequired,
  isDefused: PropTypes.bool.isRequired,
  isFlagged: PropTypes.bool.isRequired,
  isGameOver: PropTypes.bool.isRequired,
  isLastClick: PropTypes.bool.isRequired,
  isQuestion: PropTypes.bool.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};


export default onlyUpdateForKeys([
  'isDefused',
  'isFlagged',
  'isGameOver',
  'isQuestion',
  'isDebugging',
])(Tile);
