import AbstractView from '../framework/view/abstract-view.js';

const createElemListTemplate = () =>
  `
<ul class="trip-events__list">

</ul>`;

class NewElemListView extends AbstractView{
  get template() {
    return createElemListTemplate();
  }
}

export {NewElemListView};
