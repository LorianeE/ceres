import * as types from '../constants/RecipesActionTypes';
import initialState from '../initialState';

function recipesReducers(state = initialState.recipesInfo, action) {
  console.log(state);
  console.log(action);
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
