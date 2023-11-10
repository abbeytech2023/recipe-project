import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    page: 1,
    results: [],
    resultsPerPage: RES_PER_PAGE,
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
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};
/**
 *
 * @param {id} id accept an id of a particular Recipe
 * @stateRecipe creates an Object with the recipeData and stores it into state.recipe
 * @stateBookmark checks for the booksmarks that contains the same id between
 *  the new data of recipe  recieved from  API_URL and the previous recipe's bookmarked
 * the bookmarked property is set to true if both id are equal, if id are not equal the
 * bookmarked property is set to false
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    console.log(data);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temporary error ahndlig
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

/**
 * Accepts a search value(recipe) from the searchview interface
 * @API_URL = the API from which the recipe is being fetched
 * @param {Recipe},  query is name of a recipe recieved
 
 * @data stores the data returned from AJAX function into data, and
 * Maps the data also stores the data, into state.search.results
 * @returns, {id, title, publisher, image} details of the recipe recieved
 * @ Restart the pagination back to page 1
 */
export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    // console.log(state.search.results);
  } catch (err) {
    console.error(`${err} 💥💥💥💥`);
    throw err;
  }
};

loadSearchResult();

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // new quantity = oldqt * newservings /oldservings // 2 * 8 /4
  });

  state.recipe.servings = newServings;
};

const persistBookMark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

// mark current recipe as a bookmark
export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  //mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookMark();
};

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as not a bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookMark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
  console.log(JSON.parse(storage));
};
init();
console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! please use the correct format'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: newRecipe.servings,
      cooking_time: newRecipe.cookingTime,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
