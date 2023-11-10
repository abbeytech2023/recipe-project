import Icons from 'url:../../img/icons.svg'; //parce 2
import previewView from './previewView.js';
import View from './view.js';

class resultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = `NO recipes found for your query! please try again ;) `;
  _message = ``;
  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new resultView();
