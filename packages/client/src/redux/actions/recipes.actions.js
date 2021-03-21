import { beginApiCall } from './apiStatus.actions';
import { getErrMsg } from '../../utils/ErrorUtils';
import {
  RECEIVED_RECIPES_FAILURE,
  RECEIVED_RECIPES_SUCCESS,
  RECEIVED_RECIPES_TAGS_FAILURE,
  RECEIVED_RECIPES_TAGS_SUCCESS,
} from '../constants/RecipesActionTypes';
import { getRecipesList, getRecipesTags } from '../../utils/http/RecipesClient';

function fetchRecipesSuccess(recipes) {
  return { type: RECEIVED_RECIPES_SUCCESS, payload: { recipes } };
}

function fetchRecipesFailure(err) {
  return { type: RECEIVED_RECIPES_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

export function fetchRecipesList() {
  return (dispatch) => {
    dispatch(beginApiCall());
    getRecipesList()
      .then((recipes) => dispatch(fetchRecipesSuccess(recipes)))
      .catch((err) => dispatch(fetchRecipesFailure(err)));
  };
}

function fetchTagsSuccess(tags) {
  return { type: RECEIVED_RECIPES_TAGS_SUCCESS, payload: { tags } };
}

function fetchTagsFailure(err) {
  return { type: RECEIVED_RECIPES_TAGS_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

export function fetchRecipesTags() {
  return (dispatch) => {
    dispatch(beginApiCall());
    getRecipesTags()
      .then((recipes) => dispatch(fetchTagsSuccess(recipes)))
      .catch((err) => dispatch(fetchTagsFailure(err)));
  };
}

// function updateProductInDatabase(product) {
//   return async (dispatch, getState) => {
//     dispatch(beginApiCall());
//     const userId = getState().user.id;
//     try {
//       await updateUserProduct(userId, product);
//       dispatch(endApiCall());
//       dispatch(fetchUserProductsList());
//     } catch (err) {
//       dispatch(updateUserProductFailure(err));
//     }
//   };
// }
//
// export function updateProduct(product) {
//   return (dispatch) => {
//     dispatch({ type: UPDATE_USER_PRODUCT, payload: { product } });
//     dispatch(updateProductInDatabase(product));
//   };
// }
