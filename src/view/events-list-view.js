import {createElement} from '../render.js';

const createElemListTemplate = () =>
  `
<ul class="trip-events__list">

</ul>`;

class NewElemListView {
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

export {NewElemListView};
