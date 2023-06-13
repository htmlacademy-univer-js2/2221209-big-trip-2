import AbstractView from '../framework/view/abstract-view.js';

const createNavTemplate = () =>
  `<nav class="trip-controls__trip-tabs  trip-tabs">
     <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
     <a class="trip-tabs__btn" href="#">Stats</a>
   </nav>`;

class NewNavView extends AbstractView{
  get template() {
    return createNavTemplate();
  }
}

export {NewNavView};
