import React from 'react';
import PropTypes from 'prop-types';

const FormattedDate = ({ date }) => {
  if (!date || isNaN(Date.parse(date))) {
    return <span>Invalid Date</span>;
  }

  const timestamp = Date.parse(date);
  const toDate = new Date(timestamp);
  const year = toDate.getFullYear();
  const month = String(toDate.getMonth() + 1).padStart(2, '0');
  const day = String(toDate.getDate()).padStart(2, '0');

  return (
    <span>{`${year}-${month}-${day}`}</span>
  );
};

FormattedDate.propTypes = {
  date: PropTypes.string.isRequired,
};

export default FormattedDate;
