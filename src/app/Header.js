import React from 'react';
import PropTypes from 'prop-types';

import smile from '../images/cryinglaff.svg';
import css from './Header.scss';

const Header = props => (
  <div className={css.header}>
    Bombs left: 100
    <img className={css.emoji} src={smile} alt='' />
    010101
  </div>
);

Header.propTypes = {

};

export default Header;
