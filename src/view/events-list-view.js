import {createElement} from '../render.js';

const createElemListTemplate = () => 
  `
<ul class="trip-events__list">

</ul>`;

class NewElemListView {
  getTemplate() {
    return createElemListTemplate();
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

export {NewElemListView};