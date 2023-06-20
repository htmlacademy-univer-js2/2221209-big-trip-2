import { UpdateType } from '../const.js';
import { remove, render } from '../framework/render.js';
import { NewFilterView } from '../view/filter-view.js';

class FiltersDrawer {
  #container = null;
  #pointModel = null;
  #filterModel = null;
  #filterComponent = null;

  constructor(container, pointModel, filterModel) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#modelEventHandler);
    this.#pointModel.addObserver(this.#modelEventHandler);
  }

  init() {
    remove(this.#filterComponent);
    this.#filterComponent = new NewFilterView(this.points, this.#filterModel.filter);
    render(this.#filterComponent, this.#container);
    this.#filterComponent.setFilterChangeHandler(this.#filterChangeHandler);
  }

  get points() {
    return this.#pointModel.points;
  }

  #modelEventHandler = (updateType) => {
    if (updateType === UpdateType.BIG || updateType === UpdateType.SMALL) {
      this.init();
    }
  };

  #filterChangeHandler = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.BIG, filterType);
  };
}

export {FiltersDrawer};
