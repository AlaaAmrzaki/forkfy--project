import { API_url, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url?.replace('http://', 'https://') ?? recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  const keyQuery = KEY ? `?key=${KEY}` : '';
  const data = await AJAX(`${API_url}/${id}${keyQuery}`);
  state.recipe = createRecipeObject(data);
  state.recipe.bookmarked = state.bookmarks.some(bookmark => bookmark.id === id);
};

export const loadSearchResults = async function (query) {
  state.search.query = query;
  const keyQuery = KEY ? `&key=${KEY}` : '';
  const data = await AJAX(`${API_url}?search=${encodeURIComponent(query)}${keyQuery}`);
  state.search.results = data.data.recipes.map(recipe => ({
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    image: recipe.image_url?.replace('http://', 'https://') ?? recipe.image_url,
    ...(recipe.key && { key: recipe.key }),
  }));
  state.search.page = 1;
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  const oldServings = state.recipe.servings;
  if (!oldServings || newServings < 1) return;
  state.recipe.ingredients.forEach(ingredient => {
    if (ingredient.quantity != null) {
      ingredient.quantity = (ingredient.quantity * newServings) / oldServings;
    }
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  if (state.bookmarks.some(bookmark => bookmark.id === recipe.id)) return;
  state.bookmarks.push({ ...recipe, bookmarked: true });
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  if (index !== -1) state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  try {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
  } catch (err) {
    state.bookmarks = [];
  }
};
init();

export const uploadRecipe = async function (newRecipe) {
  const ingredients = Object.entries(newRecipe)
    .filter(([key, value]) => key.startsWith('ingredient') && value.trim() !== '')
    .map(([, value]) => {
      const parts = value.split(',').map(part => part.trim());
      if (parts.length !== 3) {
        throw new Error('Incorrect ingredient format. Use Quantity,Unit,Description.');
      }
      const [quantity, unit, description] = parts;
      if (!description) {
        throw new Error('Each ingredient needs a description.');
      }
      return {
        quantity: quantity ? Number(quantity) : null,
        unit,
        description,
      };
    });

  if (ingredients.length === 0) {
    throw new Error('Please add at least one ingredient.');
  }

  const recipe = {
    title: newRecipe.title,
    source_url: newRecipe.sourceUrl,
    image_url: newRecipe.image,
    publisher: newRecipe.publisher,
    cooking_time: Number(newRecipe.cookingTime),
    servings: Number(newRecipe.servings),
    ingredients,
  };

  const keyQuery = KEY ? `?key=${KEY}` : '';
  const data = await AJAX(`${API_url}${keyQuery}`, recipe);
  state.recipe = createRecipeObject(data);
  addBookmark(state.recipe);
};

export const clearBookmarks = function () {
  state.bookmarks = [];
  localStorage.removeItem('bookmarks');
};
