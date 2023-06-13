import {createElement} from '../render.js';

const createElemListTemplate = () =>
  `<p class="trip-events__msg">
    Click New Event to create your first point
  </p>`;

class NewEmptyListView {
  #element = null;

  get template() {
    return createElemListTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

export {NewEmptyListView};
