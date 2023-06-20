import {NewSortView} from '../view/sort-view.js';
import {NewElemListView} from '../view/events-list-view.js';
import {NewEmptyListView} from '../view/empty-list-view.js';
import { RenderPosition, remove, render} from '../framework/render.js';
import { PointDrawer } from './draw-point.js';
import { filterPoints, getDefaultPoint, sortByDay, sortByPrice, sortByTime, updateItems } from '../util.js';
import { ActionType, FilterType, SortType, UpdateType } from '../const.js';
import { NewPointDrawer } from './draw-new-point.js';

class PointsDrawer {
  #pointModel = null;
  #filterModel = null;
  #mainContainer = null;
  #eventsList = null;
  #emptyListComponent = null;
  #pointDrawers = new Map();
  #eventsSort = null;
  #sortType = SortType.DAY;
  #newPointDrawer = null;

  constructor(mainCon, pointModel, filterModel, onNewEventClose) {
    this.#pointModel= pointModel;
    this.#filterModel = filterModel;
    this.#mainContainer = mainCon;
    this.#eventsList = new NewElemListView();

    //proverit i peremestit newSortView v renderSort

    this.#pointModel.addObserver(this.#modelActionHandler)
    this.#filterModel.addObserver(this.#modelActionHandler)

    this.#newPointDrawer = new NewPointDrawer(this.#eventsList.element, this.#viewActionHandler, onNewEventClose)
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoints = filterPoints(points, filterType);
    switch (this.#sortType) {
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.TIME:
        return filteredPoints.sort(sortByTime);
    }

    return filteredPoints.sort(sortByDay);
  }

  get destinations() {
    return this.#pointModel.destinations;
  }

  get offersByType() {
    return this.#pointModel.offersByType;
  }

  init(){
    this.#renderPoints();
  }

  #renderPoints = () => {
    if (this.points.length === 0) {
      remove(this.#eventsSort)
      const isEmpty = this.#pointModel.points.length === 0;
      remove(this.#emptyListComponent);
      this.#emptyListComponent = new NewEmptyListView(this.#filterModel.filter, isEmpty)
      render(this.#emptyListComponent, this.#mainContainer);
      return;
    }
    console.log(this.#emptyListComponent)
    remove(this.#emptyListComponent);

    this.#renderSort();
    render(this.#eventsList, this.#mainContainer);

    for (const point of this.points){
      this.#renderPoint(point, this.destinations, this.offersByType);
    }
  };

  createEvent() {
    this.#sortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.BIG, FilterType.EVERYTHING);
    this.#newPointDrawer.init(getDefaultPoint(), this.destinations, this.offersByType)
    // if (this.points.length === 0) {
    //   remove(this.#emptyListComponent);
    // }

  }

  #renderSort = () => {
    remove(this.#eventsSort)
    this.#eventsSort = new NewSortView(this.#sortType);
    render(this.#eventsSort, this.#mainContainer, RenderPosition.AFTERBEGIN);
    this.#eventsSort.setSortTypeChangeHandler(this.#changeTypeSortHandler);
  };

  #changeTypeSortHandler = (sortType) => {
    if (this.#sortType === sortType) {
      return;
    }

    this.#sortType = sortType;
    this.#renderSortedPoints();
  };

  #viewActionHandler = (actionType, updateType, update) => {
    switch (actionType) {
      case ActionType.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case ActionType.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case ActionType.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
    }
  }

  #modelActionHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointDrawers.get(data.id).init(data, this.destinations, this.offersByType);
        break;
      case UpdateType.SMALL:
        this.#clearPoints(false);
        this.#renderPoints();
        break;
      case UpdateType.BIG:
        this.#clearPoints(true);
        this.#renderPoints();
        break;
    }
  }

  #renderSortedPoints = () => {
    this.#clearEventsList();
    this.#renderPoints();
  };

  #clearEventsList = () => {
    this.#pointDrawers.forEach((drawer) =>drawer.removeDrawer());
    this.#pointDrawers.clear();
    //remove(this.#eventsList);
  };

  #clearPoints = (resetSort) => {
    this.#pointDrawers.forEach((drawer) => drawer.removeDrawer());
    this.#pointDrawers.clear();
    remove(this.#eventsSort)
    //remove(this.#eventsList);
    //console.log(this.#eventsSort)
    if (resetSort) {
      this.#sortType = SortType.DAY;
    }
  }

  #renderPoint = (point, destinations, offers) => {
    const newPoint = new PointDrawer(this.#eventsList.element, this.#viewActionHandler, this.#pointsResetHandler);
    newPoint.init(point, destinations, offers);
    this.#pointDrawers.set(point.id, newPoint);
  };

  #pointsResetHandler = () => {
    this.#pointDrawers.forEach((drawer) => drawer.resetPoint());
    this.#newPointDrawer.destroy()
  };
}

export {PointsDrawer};
