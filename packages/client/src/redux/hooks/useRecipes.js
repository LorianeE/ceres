import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGenericProducts, getUserProducts } from '../selectors/products.selectors';
import { fetchRecipesList, fetchRecipesTags } from '../actions/recipes.actions';
import { getRecipes, getRecipesTags } from '../selectors/recipes.selectors';

const useRecipes = () => {
  const dispatch = useDispatch();

  const [filteredTags, setFilterTags] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchRecipeTitle, setSearchRecipeTitle] = useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  // Get products
  const genericProducts = useSelector(getGenericProducts);
  const userProducts = useSelector(getUserProducts);
  const allProducts = genericProducts && userProducts && [...genericProducts, ...userProducts];

  // Get recipes and tags
  useEffect(() => {
    dispatch(fetchRecipesList());
  }, [dispatch]);
  const recipes = useSelector(getRecipes);

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

  return {
    allTags,
    filteredRecipes,
    filteredTags,
    products: allProducts,
    selectedIndex,
    selectedRecipe,
    searchRecipeTitle,
    handleTagClick,
    handleSearchChange,
    handleSelectRecipe,
  };
};

export default useRecipes;
