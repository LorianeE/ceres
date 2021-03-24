import httpClient from './HttpClient';

export async function getRecipesList(userId) {
  return httpClient.get(`/rest/users/${userId}/recipes`);
}

export async function getRecipesTags() {
  return httpClient.get(`/rest/recipes/tags`);
}

export async function addUserRecipe(userId, recipe) {
  return httpClient.post(`/rest/users/${userId}/recipes`, recipe);
}

export async function putRecipe(recipe) {
  return httpClient.put(`/rest/recipes/${recipe.id}`, recipe);
}

export async function deleteUserRecipe(recipeId) {
  return httpClient.delete(`/rest/recipes/${recipeId}`);
}
