// import httpClient from './HttpClient';

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

export async function getRecipesList() {
  // const items = await httpClient.get('/rest/products?genericsOnly=true');
  let recipes = [...recipesSimple, ...recipesSimple, ...recipesSimple, ...recipesSimple];
  recipes = recipes.map((r) => {
    return {
      ...r,
      id: String(Math.random()),
      tags: r.tags.map((tag) => tag.toUpperCase()),
    };
  });
  return Promise.resolve(recipes);
}

export async function getRecipesTags() {
  return Promise.resolve(
    ['accompagnement', 'dessert', 'healthy', 'winter', 'pâtes', 'plat en sauce', 'riz', 'summer'].map((e) => e.toUpperCase())
  );
}

// export async function updateUserProduct(userId, product) {
//   return httpClient.put(`/rest/users/${userId}/products/${product.id}`, product);
// }
//
// export async function deleteUserProduct(userId, productId) {
//   return httpClient.delete(`/rest/users/${userId}/products/${productId}`);
// }
