export function sortRecipeListAlphabetically(recipe) {
  return recipe.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });
}

export function getFilledRecipes(unfilledRecipes, products) {
  if (!unfilledRecipes || !products.length) {
    return [];
  }
  return sortRecipeListAlphabetically(
    unfilledRecipes.map((recipe) => {
      return {
        ...recipe,
        ingredients: recipe.ingredients.map((ingredient) => {
          return {
            ...ingredient,
            product: products.find((product) => product.id === ingredient.product),
          };
        }),
      };
    })
  );
}
