import React from 'react';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

const ItemComment = ({ item, changeItemComment }) => {
  return (
    <TextField
      id={`itemComment:${item.id}`}
      size="small"
      placeholder="Commentaire"
      multiline
      inputProps={{ maxLength: 100 }}
      defaultValue={item.comment}
      onBlur={(e) => changeItemComment(item.id, e.target.value)}
      style={{ width: '90%' }}
    />
  );
};

ItemComment.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    comment: PropTypes.string,
  }).isRequired,
  changeItemComment: PropTypes.func.isRequired,
};

export default ItemComment;
