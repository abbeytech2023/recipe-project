import Icons from 'url:../../img/icons.svg'; //parce 2
import previewView from './previewView.js';

import View from './view.js';

class bookmarksView extends View {
  _parentEl = document.querySelector('.bookmarks__list');
  _errorMessage = `NO bookmark yet. Find a nice recipe and bookmark it ;) `;
  _message = ``;

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new bookmarksView();
