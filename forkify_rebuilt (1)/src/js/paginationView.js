import View from './View.js';
import icons from 'url:../img/icons.svg';
class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', event => {
      const button = event.target.closest('.btn--inline');
      if (!button) return;
      handler(Number(button.dataset.goto));
    });
  }

  addHandlerCLick(handler) {
    this.addHandlerClick(handler);
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const pageCount = Math.ceil(
      this._data.results.length / this._data.resultPerPage,
    );

    if (pageCount <= 1) return '';

    if (currentPage === 1) {
      return `<button class="btn--inline pagination__btn--next" data-goto="${currentPage + 1}">
        <span>Page ${currentPage + 1}</span><svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
      </button>`;
    }

    if (currentPage === pageCount) {
      return `<button class="btn--inline pagination__btn--prev" data-goto="${currentPage - 1}">
        <svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg><span>Page ${currentPage - 1}</span>
      </button>`;
    }

    return `<button class="btn--inline pagination__btn--prev" data-goto="${currentPage - 1}">
      <svg class="search__icon"><use href="${icons}#icon-arrow-left"></use></svg><span>Page ${currentPage - 1}</span>
    </button>
    <button class="btn--inline pagination__btn--next" data-goto="${currentPage + 1}">
      <span>Page ${currentPage + 1}</span><svg class="search__icon"><use href="${icons}#icon-arrow-right"></use></svg>
    </button>`;
  }
}

export default new PaginationView();
