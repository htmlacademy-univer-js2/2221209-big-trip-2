import {NewSortView} from '../view/sort-view.js';
import {NewElemListView} from '../view/events-list-view.js';
import {NewEmptyListView} from '../view/empty-list-view.js';
import { RenderPosition, remove, render} from '../framework/render.js';
import { PointDrawer } from './draw-point.js';
import { sortByDay, sortByPrice, sortByTime, updateItems } from '../util.js';
import { SortType } from '../const.js';

class PointsDrawer {
  #pointModel = null;
  #mainContainer = null;
  #eventsList = null;
  #points = [];
  #destinations = [];
  #offersByType = [];
  #pointDrawers = new Map();
  #eventsSort = null;
  #sortType = SortType.DAY;

  constructor(mainCon, pointModel) {
    this.#pointModel= pointModel;
    this.#mainContainer = mainCon;
    this.#eventsList = new NewElemListView();
    this.#eventsSort = new NewSortView();
  }

  init(){
    this.#points = this.#pointModel.points;
    this.#destinations = this.#pointModel.destinations;
    this.#offersByType = this.#pointModel.offersByType;

    this.#sortPoints(this.#sortType);
    this.#renderPoints();

    this.#renderSort();
  }

  #renderPoints = () => {
    if (this.#points.length === 0) {
      render(new NewEmptyListView(), this.#mainContainer);
      return;
    }

    render(this.#eventsList, this.#mainContainer);
    for (const point of this.#points){
      this.#renderPoint(point, this.#destinations, this.#offersByType);
    }
  };

  #renderSort = () => {
    render(this.#eventsSort, this.#mainContainer, RenderPosition.AFTERBEGIN);
    this.#eventsSort.setSortTypeChangeHandler(this.#changeTypeSortHandler);
  };

  #changeTypeSortHandler = (sortType) => {
    if (this.#sortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearEventsList();
    this.#renderPoints();
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#points.sort(sortByDay);
        break;
      case SortType.TIME:
        this.#points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortByPrice);
        break;
    }

    this.#sortType = sortType;
  };

  #clearEventsList = () => {
    this.#pointDrawers.forEach((drawer) =>drawer.removeDrawer);
    this.#pointDrawers.clear();
    remove(this.#eventsList);
  };

  #renderPoint = (point, destinations, offers) => {
    const newPoint = new PointDrawer(this.#eventsList.element, this.#pointUpdateHandler, this.#pointsResetHandler);
    newPoint.init(point, destinations, offers);
    this.#pointDrawers.set(point.id, newPoint);
  };

  #pointUpdateHandler = (updatedPoint) => {
    this.#points = updateItems(this.#points, updatedPoint);
    this.#pointDrawers.get(updatedPoint.id).init(updatedPoint, this.#destinations, this.#offersByType);
  };

  #pointsResetHandler = () => {
    this.#pointDrawers.forEach((drawer) => drawer.resetPoint());
  };
}

export {PointsDrawer};
