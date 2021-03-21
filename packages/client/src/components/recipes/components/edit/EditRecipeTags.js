import React from 'react';
import PropTypes from 'prop-types';
import CreatableSelect from 'react-select/creatable/dist/react-select.esm';

const EditRecipeTags = ({ allTags, recipeTags, handleTagsChange, controlSize, placeholderSize, placeholderColor }) => {
  const allTagsMapped = allTags.map((tag) => ({ value: tag, label: tag }));

  const onTagsChange = (newValue) => {
    handleTagsChange(newValue.map((tag) => tag.value.toUpperCase()));
  };

  return (
    <CreatableSelect
      isMulti
      options={allTagsMapped}
      defaultValue={recipeTags.map((tag) => ({ value: tag, label: tag }))}
      onChange={onTagsChange}
      className="basic-multi-select"
      classNamePrefix="select"
      placeholder="Tags"
      closeMenuOnSelect={false}
      menuPlacement="auto"
      menuPosition="fixed"
      styles={{
        control: (base) => ({
          ...base,
          '&:hover': { borderColor: 'gray' }, // border style on hover
          border: '1px solid lightgray', // default border color
          boxShadow: 'none', // no box-shadow
          height: controlSize || base.height,
        }),
        placeholder: (base) => ({
          ...base,
          color: placeholderColor || base.color,
          fontSize: placeholderSize || base.fontSize,
        }),
        option: (styles, state) => ({
          ...styles,
          color: state.isSelected ? '#FFF' : styles.color,
          backgroundColor: state.isSelected ? '#8bc34a' : styles.color,
          '&:hover': {
            color: '#FFF',
            backgroundColor: '#8bc34a',
          },
        }),
      }}
    />
  );
};

EditRecipeTags.defaultProps = {
  controlSize: undefined,
  placeholderSize: undefined,
  placeholderColor: undefined,
};

EditRecipeTags.propTypes = {
  allTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  recipeTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleTagsChange: PropTypes.func.isRequired,
  controlSize: PropTypes.number,
  placeholderSize: PropTypes.number,
  placeholderColor: PropTypes.string,
};

export default EditRecipeTags;
