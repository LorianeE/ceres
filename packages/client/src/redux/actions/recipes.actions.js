import { beginApiCall, endApiCall } from './apiStatus.actions';
import { getErrMsg } from '../../utils/ErrorUtils';
import {
  RECEIVED_RECIPES_FAILURE,
  RECEIVED_RECIPES_SUCCESS,
  RECEIVED_RECIPES_TAGS_FAILURE,
  RECEIVED_RECIPES_TAGS_SUCCESS,
  ADD_RECIPE,
  ADD_RECIPE_FAILURE,
  UPDATE_RECIPE,
  EDIT_RECIPE_FAILURE,
  DELETE_RECIPE_FAILURE,
  REMOVE_RECIPE,
} from '../constants/RecipesActionTypes';
import { addUserRecipe, deleteUserRecipe, getRecipesList, getRecipesTags, putRecipe } from '../../utils/http/RecipesClient';

function fetchRecipesSuccess(recipes) {
  return { type: RECEIVED_RECIPES_SUCCESS, payload: { recipes } };
}

function fetchRecipesFailure(err) {
  return { type: RECEIVED_RECIPES_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

function addRecipeFailure(err) {
  return { type: ADD_RECIPE_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

function editRecipeFailure(err) {
  return { type: EDIT_RECIPE_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

function deleteRecipeFailure(err) {
  return { type: DELETE_RECIPE_FAILURE, payload: { errMsg: getErrMsg(err) } };
}

export function fetchRecipesList() {
  return (dispatch, getState) => {
    const userId = getState().user.id;
    dispatch(beginApiCall());
    getRecipesList(userId)
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

function postNewRecipe(recipe) {
  return async (dispatch, getState) => {
    dispatch(beginApiCall());
    const userId = getState().user.id;
    // Remove fake ids
    const newRecipe = {
      ...recipe,
      url: recipe.url || undefined,
      imgUrl: recipe.imgUrl || undefined,
      ingredients: recipe.ingredients.map((ingredient) => {
        delete ingredient.id;
        return {
          ...ingredient,
          product: ingredient.product.id,
        };
      }),
    };
    delete newRecipe.id;
    try {
      await addUserRecipe(userId, newRecipe);
      dispatch(endApiCall());
      dispatch(fetchRecipesList());
    } catch (err) {
      dispatch(addRecipeFailure(err));
    }
  };
}

export function addNewRecipe(recipe) {
  return (dispatch) => {
    dispatch({ type: ADD_RECIPE, payload: { recipe } });
    dispatch(postNewRecipe(recipe));
  };
}

function updateRecipe(recipe) {
  return async (dispatch) => {
    dispatch(beginApiCall());
    const editedRecipe = {
      ...recipe,
      ingredients: recipe.ingredients.map((ingredient) => {
        if (ingredient.id.startsWith('temp_')) {
          delete ingredient.id;
        }
        return {
          ...ingredient,
          product: ingredient.product.id,
        };
      }),
    };
    try {
      await putRecipe(editedRecipe);
      dispatch(endApiCall());
      dispatch(fetchRecipesList());
    } catch (err) {
      dispatch(editRecipeFailure(err));
    }
  };
}

export function editRecipe(recipe) {
  return (dispatch) => {
    dispatch({ type: UPDATE_RECIPE, payload: { recipe } });
    dispatch(updateRecipe(recipe));
  };
}

function deleteRecipe(recipeId) {
  return async (dispatch) => {
    dispatch(beginApiCall());
    try {
      await deleteUserRecipe(recipeId);
      dispatch(endApiCall());
      dispatch(fetchRecipesList());
    } catch (err) {
      dispatch(deleteRecipeFailure(err));
    }
  };
}

export function removeRecipe(recipeId) {
  return (dispatch) => {
    dispatch({ type: REMOVE_RECIPE, payload: { recipeId } });
    dispatch(deleteRecipe(recipeId));
  };
}
