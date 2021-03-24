import * as types from '../constants/RecipesActionTypes';
import initialState from '../initialState';

function updateRecipe(stateRecipes, recipeToUpdate) {
  return stateRecipes.map((recipe) => {
    if (recipe.id === recipeToUpdate.id) {
      return recipeToUpdate;
    }
    return recipe;
  });
}

function recipesReducers(state = initialState.recipesInfo, action) {
  switch (action.type) {
    case types.RECEIVED_RECIPES_SUCCESS:
      return {
        ...state,
        recipes: action.payload.recipes,
      };
    case types.RECEIVED_RECIPES_FAILURE:
      return {
        ...state,
        recipes: [],
      };
    case types.RECEIVED_RECIPES_TAGS_SUCCESS:
      return {
        ...state,
        tags: action.payload.tags,
      };
    case types.RECEIVED_RECIPES_TAGS_FAILURE:
      return {
        ...state,
        tags: [],
      };
    case types.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload.recipe],
      };
    case types.UPDATE_RECIPE:
      return {
        ...state,
        recipes: updateRecipe(state.recipes, action.payload.recipe),
      };
    // case types.REMOVE_RECIPE:
    //   return {
    //     ...state,
    //     userList: removeUserProducts(action.payload.productIds, state.userList),
    //   };
    // case types.UPDATE_RECIPE:
    //   return {
    //     ...state,
    //     userList: updateUserProduct(action.payload.product, state.userList),
    //   };

    default:
      return state;
  }
}

export default recipesReducers;
