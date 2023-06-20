import { FilterType } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';
import { filterPoints } from '../util.js';

const createFilterTemplate = (points, filterType) => (`
  <form class="trip-filters" action="#" method="get">
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" ${points.length === 0 ? 'disabled' : ''} ${filterType === FilterType.EVERYTHING ? 'checked' : ''}>
      <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" ${filterPoints(points, FilterType.FUTURE).length === 0 ? 'disabled' : ''} ${filterType === FilterType.FUTURE ? 'checked' : ''} name="trip-filter" value="future">
      <label class="trip-filters__filter-label" for="filter-future">Future</label>
    </div>

    <div class="trip-filters__filter">
      <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio"  ${filterPoints(points, FilterType.PAST).length === 0 ? 'disabled' : ''} ${filterType === FilterType.PAST ? 'checked' : ''} name="trip-filter" value="past">
      <label class="trip-filters__filter-label" for="filter-past">Past</label>
    </div>

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`);

class NewFilterView extends AbstractView{
  #points = [];
  #filterType = null;

  constructor(points, filterType) {
    super();
    this.#points = points;
    this.#filterType = filterType;
  }

  get template() {
    return createFilterTemplate(this.#points, this.#filterType);
  }

  setFilterChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterChangeHandler);
  };

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };
}

export {NewFilterView};
