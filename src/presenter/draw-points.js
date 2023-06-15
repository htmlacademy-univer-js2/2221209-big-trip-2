import {NewSortView} from '../view/sort-view.js';
import {NewEventView} from '../view/event-view.js';
import {NewElemListView} from '../view/events-list-view.js';
import {NewEventEditorView} from '../view/edit-event-view.js';
import {NewEmptyListView} from '../view/empty-list-view.js';
import { replace, render} from '../framework/render.js';
import { PointDrawer } from './draw-point.js';
import { updateItems } from '../util.js';

class PointsDrawer {
  #pointModel = null;
  #mainContainer = null;
  #eventsList = null;
  #points = [];
  #destinations = [];
  #offersByType = [];
  #pointDrawers = new Map();

  constructor(mainCon, pointModel) {
    this.#pointModel= pointModel;
    this.#mainContainer = mainCon;
    this.#eventsList = new NewElemListView();
  }

  init(){
    this.#points = this.#pointModel.points;
    this.#destinations = this.#pointModel.destinations;
    this.#offersByType = this.#pointModel.offersByType;

    if (this.#points.length === 0) {
      render(new NewEmptyListView(), this.#mainContainer);
      return;
    }

    render(new NewSortView(), this.#mainContainer);
    render(this.#eventsList, this.#mainContainer);

    for (const point of this.#points){
      this.#renderPoint(point, this.#destinations, this.#offersByType);
    }
  }

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
