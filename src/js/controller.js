import * as model from './model';
import { MODAL_CLOSE_SEC } from './config';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import { async } from 'regenerator-runtime';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarkView';
import addRecipeView from './views/addRecipeView';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();
    // 0) resultsView update

    resultsView.update(model.getSearchResultPage());

    // updating the bookmarkView
    bookmarksView.update(model.state.bookmarks);

    //loading recipe
    await model.loadRecipe(id);

    // console.log(recipe);

    //2) Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
    controlServings();
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // load search result
    await model.loadSearchResult(query);

    // Render result
    resultsView.render(model.getSearchResultPage());
    // resultsView.render(model.state.search.results);

    //render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

controlSearchResult();

const controlPagination = function (gotoPage) {
  // Render result
  resultsView.render(model.getSearchResultPage(gotoPage));
  // resultsView.render(model.state.search.results);

  //render initial pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Render new results
  model.updateServings(newServings);

  //Render new paginatiom button
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // // Add or Delete Bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  console.log(model.state.recipe);
  // Update bookmark
  recipeView.update(model.state.recipe);

  // Render Bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // show spinner
    addRecipeView.renderSpinner();
    //Upload the new recipe
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success Message
    addRecipeView.renderMessage();

    //RENDER BOOKMARKVIEW
    bookmarksView.render(model.state.bookmarks);

    // change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    console.log(model.state.recipe.id);

    //close upload window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};
// controlRecipes();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServigs(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('welcome');
};

init();
// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
