import React, { useState } from 'react';
import { Fade, Grid, Hidden } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useStyles } from './recipesStyle';
import Header from './components/RecipesHeader';
import Tags from './components/RecipesHeaderTags';
import RecipesListDesktop from './components/RecipesListDesktop';
import RecipeCard from './components/card/RecipeCard';
import RecipeEdit from './components/edit/RecipeEdit';
import { getGenericProducts } from '../../redux/selectors/products.selectors';

const Recipes = () => {
  const classes = useStyles();

  const [filteredTags, setFilterTags] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchRecipe, setSearchRecipe] = useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(null);

  // FAUX : faire un allproducts
  const products = useSelector(getGenericProducts);

  const [open, setOpen] = React.useState(false);

  const handleEditOpen = () => {
    setOpen(true);
  };

  const handleEditClose = () => {
    setOpen(false);
  };

  const recipesSimple = [
    {
      id: '1',
      title: 'Apple pie',
      url: 'https://www.marmiton.org/recettes/recette_tarte-aux-pommes-a-l-alsacienne_11457.aspx',
      imgUrl: 'https://assets.afcdn.com/recipe/20191119/102677_w600.jpg',
      nbGuests: 6,
      ingredients: [
        {
          id: 'a',
          product: {
            id: 'appleProductId',
            label: 'Pommes',
          },
          quantity: 10,
        },
        {
          id: 'b',
          product: {
            id: 'pateFeuilletéeProductId',
            label: 'Pâte feuilletée',
          },
          quantity: 1,
        },
      ],
      tags: ['dessert'],
    },
    {
      id: '2',
      title: 'Blanquette de veau',
      nbGuests: 4,
      url: 'https://www.marmiton.org/recettes/recette_blanquette-de-veau-facile_19219.aspx',
      imgUrl: 'https://assets.afcdn.com/recipe/20190529/93189_w600.jpg',
      ingredients: [
        {
          id: 'c',
          product: {
            id: 'veauProductId',
            label: 'Veau pour blanquette',
          },
          quantity: 1,
        },
        {
          id: 'd',
          product: {
            id: 'rizProductId',
            label: 'Riz',
          },
          quantity: 1,
        },
        {
          id: 'e',
          product: {
            id: 'cremeProductId',
            label: 'Pot de crème épaisse',
          },
          quantity: 1,
        },
      ],
      tags: ['plat en sauce', 'riz'],
    },
    {
      id: '3',
      title: 'Potimarron au four',
      nbGuests: 4,
      ingredients: [
        {
          id: 'f',
          product: {
            id: 'potimarronProductId',
            label: 'Potimarron',
          },
          quantity: 1,
        },
      ],
      tags: ['winter', 'healthy', 'accompagnement'],
    },
    {
      id: '4',
      title: 'Pâtes sauce tomates cerises',
      nbGuests: 3,
      ingredients: [
        {
          id: 'g',
          product: {
            id: 'patesProductId',
            label: 'Pates',
          },
          quantity: 1,
        },
        {
          id: 'h',
          product: {
            id: 'tomatescerisesProductId',
            label: 'Tomates Cerises',
          },
          quantity: 1,
        },
      ],
      tags: ['summer', 'healthy', 'accompagnement', 'pâtes'],
    },
  ];
  let recipes = [...recipesSimple, ...recipesSimple, ...recipesSimple, ...recipesSimple];
  recipes = recipes.map((r) => {
    return {
      ...r,
      id: String(Math.random()),
      tags: r.tags.map((tag) => tag.toUpperCase()),
    };
  });
  const allTags = ['accompagnement', 'dessert', 'healthy', 'winter', 'pâtes', 'plat en sauce', 'riz', 'summer'].map((e) => e.toUpperCase());

  let filteredRecipes;
  if (!filteredTags.length && !searchRecipe) {
    filteredRecipes = [...recipes];
  } else {
    filteredRecipes = recipes.filter((recipe) => filteredTags.every((filteredTag) => recipe.tags.includes(filteredTag)));
    if (searchRecipe) {
      filteredRecipes = filteredRecipes.filter((filteredRecipe) => filteredRecipe.title.toLowerCase().includes(searchRecipe.toLowerCase()));
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
    setSearchRecipe(e.target.value);
  };

  const handleSelectRecipe = (index, recipe) => {
    setSelectedIndex(index);
    if (selectedRecipe?.id === recipe.id) {
      setSelectedRecipe(null);
    } else {
      setSelectedRecipe(recipe);
    }
  };

  return (
    <Grid container direction="column">
      <Header searchRecipe={searchRecipe} handleSearchChange={handleSearchChange} />
      <Tags allTags={allTags} filteredTags={filteredTags} handleTagClick={handleTagClick} />
      <Grid item container direction="row" xs={12}>
        <Grid item xs={12} md={7} className={`${classes.root} ${classes.paperBackground}`}>
          <RecipesListDesktop
            filteredRecipes={filteredRecipes}
            selectedRecipe={selectedRecipe}
            selectedIndex={selectedIndex}
            handleSelectRecipe={handleSelectRecipe}
          />
        </Grid>
        <Grid item xs={12} md={5}>
          {selectedRecipe && (
            <div style={{ paddingTop: '0px' }}>
              <Hidden smDown implementation="css" className={classes.root}>
                <Fade in={!!selectedRecipe}>
                  <RecipeCard selectedRecipe={selectedRecipe} handleEditOpen={handleEditOpen} />
                </Fade>
              </Hidden>
              <RecipeEdit
                recipeToEdit={selectedRecipe}
                handleEditClose={handleEditClose}
                open={open}
                allTags={allTags}
                products={products}
              />
            </div>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Recipes;
