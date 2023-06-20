import { EmptyListText, FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createElemListTemplate = (filterType, isEmpty) =>
  `<p class="trip-events__msg">
    ${isEmpty ? EmptyListText[FilterType.EVERYTHING] : EmptyListText[filterType]}
  </p>`;

class NewEmptyListView extends AbstractView {
  #filterType = FilterType.EVERYTHING;
  #isEmpty = false;

  constructor(filterType, isEmpty) {
    super();
    this.#filterType = filterType;
    this.#isEmpty = isEmpty;
  }

  get template() {
    return createElemListTemplate(this.#filterType, this.#isEmpty);
  }
}

export {NewEmptyListView};
