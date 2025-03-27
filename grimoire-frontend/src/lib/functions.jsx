import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import styles from '../components/Books/BookItem/BookItem.module.css';

export function displayStars(rating) {
  const stars = [];
  for (let i = 0; i < 5; i += 1) {
    stars.push(
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={i < Math.round(rating) ? styles.full : styles.empty}
      />
    );
  }
  return stars;
}

export function generateStarsInputs(rating, register, readOnly = false) {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    const full = i <= Math.round(rating);
    if (readOnly) {
      stars.push(
        <FontAwesomeIcon
          key={`readonly-${i}`}
          icon={faStar}
          className={full ? styles.full : styles.empty}
        />
      );
    } else {
      stars.push(
        <label key={i} htmlFor={`rating${i}`}>
          <FontAwesomeIcon
            icon={faStar}
            className={full ? styles.full : styles.empty}
          />
          <input
            type="radio"
            value={i}
            id={`rating${i}`}
            {...register('rating')}
          />
        </label>
      );
    }
  }
  return stars;
}
