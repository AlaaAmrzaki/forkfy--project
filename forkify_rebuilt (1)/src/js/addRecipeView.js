import View from './View.js';
import icons from 'url:../img/icons.svg';
class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _statusEl = document.createElement('div');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', event => {
      event.preventDefault();
      const dataArr = [...new FormData(this._parentEl)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  renderSpinner() {
    this._statusEl.className = 'upload__status';
    this._statusEl.textContent = 'Uploading recipe...';
    this._parentEl.prepend(this._statusEl);
  }

  renderSpiner() {
    this.renderSpinner();
  }

  renderMessage(message = this._message) {
    this._statusEl.className = 'upload__status message';
    this._statusEl.textContent = message;
    if (!this._statusEl.isConnected) this._parentEl.prepend(this._statusEl);
  }

  renderError(message) {
    this._statusEl.className = 'upload__status error';
    this._statusEl.textContent =
      message || 'Could not upload recipe. Please try again.';
    if (!this._statusEl.isConnected) this._parentEl.prepend(this._statusEl);
  }
}

export default new AddRecipeView();
