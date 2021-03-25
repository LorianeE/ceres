import React, { useState } from 'react';
import PropTypes from 'prop-types';
import EditIngredientsTitle from './EditIngredientsTitle';
import AddNewIngredient from './AddNewIngredient';
import EditIngredient from './EditIngredient';

const EditIngredients = ({
  ingredients,
  products,
  handleUpdateIngredient,
  handleAddIngredient,
  handleDeleteIngredient,
  addIngredientContainerStyle,
}) => {
  const [addIngredient, setAddIngredient] = useState(false);

  const handleChangeIngredientQuantity = (newQuantity, id) => {
    const newIngredients = ingredients.map((ingredient) => {
      if (ingredient.id === id) {
        return {
          ...ingredient,
          quantity: newQuantity && parseFloat(newQuantity),
        };
      }
      return ingredient;
    });
    handleUpdateIngredient(newIngredients);
  };

  const onAddIngredient = (newIngredient) => {
    handleAddIngredient(newIngredient);
    setAddIngredient(false);
  };

  const handleCloseNewIngredient = () => {
    setAddIngredient(false);
  };

  return (
    <>
      <EditIngredientsTitle addIngredient={addIngredient} setAddIngredient={setAddIngredient} />
      {addIngredient && (
        <AddNewIngredient
          containerStyle={addIngredientContainerStyle}
          products={products}
          handleAddIngredient={onAddIngredient}
          handleCloseNewIngredient={handleCloseNewIngredient}
        />
      )}
      {ingredients.map((ingredient) => {
        return (
          <EditIngredient
            key={ingredient.id}
            ingredient={ingredient}
            handleDeleteIngredient={handleDeleteIngredient}
            handleChangeIngredientQuantity={handleChangeIngredientQuantity}
          />
        );
      })}
    </>
  );
};

EditIngredients.defaultProps = {
  addIngredientContainerStyle: {},
};

EditIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.object).isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleDeleteIngredient: PropTypes.func.isRequired,
  handleAddIngredient: PropTypes.func.isRequired,
  handleUpdateIngredient: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  addIngredientContainerStyle: PropTypes.object,
};

export default EditIngredients;
