import AbstractView from '../framework/view/abstract-view.js';

const createElemListTemplate = () =>
  `<p class="trip-events__msg">
    Click New Event to create your first point
  </p>`;

class NewEmptyListView extends AbstractView {
  get template() {
    return createElemListTemplate();
  }
}

export {NewEmptyListView};
