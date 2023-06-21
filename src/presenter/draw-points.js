import {NewSortView} from '../view/sort-view.js';
import {NewElemListView} from '../view/events-list-view.js';
import {NewEmptyListView} from '../view/empty-list-view.js';
import { RenderPosition, remove, render} from '../framework/render.js';
import { PointDrawer } from './draw-point.js';
import { filterPoints, getDefaultPoint, sortByDay, sortByPrice, sortByTime} from '../util.js';
import { ActionType, FilterType, SortType, UpdateType } from '../const.js';
import { NewPointDrawer } from './draw-new-point.js';
import { NewLoadView } from '../view/loading-view.js';

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
  #loadingComponent = null;
  #isLoading = true;
  #filtersReset = null;

  constructor(mainCon, pointModel, filterModel, onNewEventClose, filtersReset) {
    this.#pointModel= pointModel;
    this.#filterModel = filterModel;
    this.#mainContainer = mainCon;
    this.#eventsList = new NewElemListView();
    this.#loadingComponent = new NewLoadView();
    this.#filtersReset = filtersReset;

    this.#pointModel.addObserver(this.#modelActionHandler);
    this.#filterModel.addObserver(this.#modelActionHandler);

    this.#newPointDrawer = new NewPointDrawer(this.#eventsList.element, this.#viewActionHandler, onNewEventClose);
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
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#mainContainer);
    }
    else{
      this.#renderPoints();
    }
  }

  #renderPoints = () => {
    if (this.points.length === 0) {
      remove(this.#eventsSort);
      const isEmpty = this.#pointModel.points.length === 0;
      remove(this.#emptyListComponent);
      this.#emptyListComponent = new NewEmptyListView(this.#filterModel.filter, isEmpty);
      render(this.#emptyListComponent, this.#mainContainer);
      return;
    }

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
    this.#newPointDrawer.init(getDefaultPoint(), this.destinations, this.offersByType);

  }

  #renderSort = () => {
    remove(this.#eventsSort);
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

  #viewActionHandler = async (actionType, updateType, update) => {
    switch (actionType) {
      case ActionType.UPDATE_POINT:
        this.#pointDrawers.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch {
          this.#pointDrawers.get(update.id).setAborting();
        }
        break;
      case ActionType.ADD_POINT:
        this.#newPointDrawer.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch {
          this.#newPointDrawer.setAborting();
        }
        break;
      case ActionType.DELETE_POINT:
        this.#pointDrawers.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch {
          this.#pointDrawers.get(update.id).setAborting();
        }
    }
  };

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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPoints();
        this.#filtersReset();
        break;
    }
  };

  #renderSortedPoints = () => {
    this.#clearEventsList();
    this.#renderPoints();
  };

  #clearEventsList = () => {
    this.#pointDrawers.forEach((drawer) =>drawer.removeDrawer());
    this.#pointDrawers.clear();
  };

  #clearPoints = (resetSort) => {
    this.#pointDrawers.forEach((drawer) => drawer.removeDrawer());
    this.#pointDrawers.clear();
    remove(this.#eventsSort);
    this.#newPointDrawer.destroy();
    if (resetSort) {
      this.#sortType = SortType.DAY;
    }
  };

  #renderPoint = (point, destinations, offers) => {
    const newPoint = new PointDrawer(this.#eventsList.element, this.#viewActionHandler, this.#pointsResetHandler);
    newPoint.init(point, destinations, offers);
    this.#pointDrawers.set(point.id, newPoint);
  };

  #pointsResetHandler = () => {
    this.#newPointDrawer.destroy();
    this.#pointDrawers.forEach((drawer) => drawer.resetPoint());
  };
}

export {PointsDrawer};
