import Icons from 'url:../../img/icons.svg'; //parce 2

import View from './view.js';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded';

  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerHidesWidow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerHidesWidow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);

      handler(data);
    });
  }
}

export default new AddRecipeView();
