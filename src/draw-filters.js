import { render } from './framework/render.js';
import { NewFilterView } from './view/filter-view';

class FiltersDrawer {
  #container = null;
  #pointModel = null;

  constructor(container, pointModel) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    const points = this.#pointModel.points;
    const pastPoints = points.filter((point) => new Date(point.dateTo).getTime() < Date.now());
    const futurePoints = points.filter((point) => new Date(point.dateTo).getTime() > Date.now());

    render(new NewFilterView(pastPoints, futurePoints), this.#container);
  }
}

export {FiltersDrawer};
