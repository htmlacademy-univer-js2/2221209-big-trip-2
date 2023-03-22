import {createElement} from '../render.js';

const createNavTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
     <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
     <a class="trip-tabs__btn" href="#">Stats</a>
   </nav>`;

class NewNavView {
  getTemplate() {
    return createNavTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

export {NewNavView};
