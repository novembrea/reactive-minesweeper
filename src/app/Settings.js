import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import css from './Settings.scss';

const Settings = ({
  currentDifficulty,
  isDebugging,
  isOpen,
  setDifficulty,
  toggleDebug,
}) => {
  if (!isOpen) return null;
  return (
    <section className={css.settings}>
      <h3>
        Difficulty
      </h3>
      <button
        className={cn({ [css.selected]: currentDifficulty === 'EXPERT' })}
        onClick={() => setDifficulty('EXPERT')}
      >
        Expert 24x24 [99]
      </button>
      <button
        className={cn({ [css.selected]: currentDifficulty === 'INTERMEDIATE' })}
        onClick={() => setDifficulty('INTERMEDIATE')}
      >
        Intermediate 16x16 [40]
      </button>
      <button
        className={cn({ [css.selected]: currentDifficulty === 'BEGINNER' })}
        onClick={() => setDifficulty('BEGINNER')}
      >
        Beginner 8x8 [10]
      </button>
      <h3>
        Debug
      </h3>
      <button
        className={cn({ [css.selected]: isDebugging })}
        onClick={() => toggleDebug()}
      >
        {isDebugging ? 'Debugg on' : 'Debugg off'}
      </button>
    </section>
  );
};

Settings.propTypes = {
  currentDifficulty: PropTypes.string.isRequired,
  isDebugging: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setDifficulty: PropTypes.func.isRequired,
  toggleDebug: PropTypes.func.isRequired,
};

export default Settings;
