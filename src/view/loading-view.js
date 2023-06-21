import AbstractView from '../framework/view/abstract-view.js';

const createLoadTemplate = () =>
  '<p class="trip-events__msg">Loading...</p>';

class NewLoadView extends AbstractView{
  get template() {
    return createLoadTemplate();
  }
}

export {NewLoadView};
