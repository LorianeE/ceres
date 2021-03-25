import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipesList, fetchRecipesTags, addNewRecipe, editRecipe, removeRecipe } from '../actions/recipes.actions';
import { getRecipes, getRecipesTags } from '../selectors/recipes.selectors';
import { useProducts } from './useProducts';
import { getFilledRecipes } from '../../utils/RecipesMapper';

const useRecipes = () => {
  const dispatch = useDispatch();

  const [filteredTags, setFilterTags] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchRecipeTitle, setSearchRecipeTitle] = useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  // Get products
  const { allProducts, productsSortedByLabel } = useProducts();

  // Get recipes and tags
  useEffect(() => {
    dispatch(fetchRecipesList());
  }, [dispatch]);
  const recipes = getFilledRecipes(useSelector(getRecipes), allProducts);

  useEffect(() => {
    dispatch(fetchRecipesTags());
  }, [dispatch]);
  const allTags = useSelector(getRecipesTags);

  let filteredRecipes;
  if (!filteredTags.length && !searchRecipeTitle) {
    filteredRecipes = [...recipes];
  } else {
    filteredRecipes = recipes.filter((recipe) => filteredTags.every((filteredTag) => recipe.tags.includes(filteredTag)));
    if (searchRecipeTitle) {
      filteredRecipes = filteredRecipes.filter((filteredRecipe) =>
        filteredRecipe.title.toLowerCase().includes(searchRecipeTitle.toLowerCase())
      );
    }
  }

  const handleTagClick = (tag) => {
    setSelectedRecipe(null);
    if (filteredTags.includes(tag)) {
      setFilterTags(filteredTags.filter((e) => e !== tag));
    } else {
      setFilterTags([...filteredTags, tag]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchRecipeTitle(e.target.value);
  };

  const handleSelectRecipe = (index, recipe) => {
    setSelectedIndex(index);
    if (selectedRecipe?.id === recipe.id) {
      setSelectedRecipe(null);
    } else {
      setSelectedRecipe(recipe);
    }
  };
  console.log(selectedRecipe);

  return {
    allTags,
    recipes,
    filteredRecipes,
    filteredTags,
    products: productsSortedByLabel,
    selectedIndex,
    selectedRecipe,
    setSelectedRecipe,
    searchRecipeTitle,
    handleTagClick,
    handleSearchChange,
    handleSelectRecipe,
    addRecipe: (recipe) => dispatch(addNewRecipe(recipe)),
    editRecipe: (recipe) => dispatch(editRecipe(recipe)),
    removeRecipe: (recipe) => dispatch(removeRecipe(recipe)),
  };
};

export default useRecipes;
