import {NewSortView} from './view/sort-view.js';
import {NewEventView} from './view/event-view.js';
import {NewElemListView} from './view/events-list-view.js';
import {NewEventEditorView} from './view/edit-event-view.js';
import {NewEmptyListView} from './view/empty-list-view.js';
import { replace, render} from './framework/render.js';

class PointsDrawer {
  #pointModel = null;
  #mainContainer = null;
  #eventsList = null;

  constructor(mainCon, pointModel) {
    this.#pointModel= pointModel;
    this.#mainContainer = mainCon;
    this.#eventsList = new NewElemListView();
  }

  init(){
    const points = this.#pointModel.points;
    const destinations = this.#pointModel.destinations;
    const offersByType = this.#pointModel.offersByType;

    if (points.length === 0) {
      render(new NewEmptyListView(), this.#mainContainer);
      return;
    }

    render(new NewSortView(), this.#mainContainer);
    render(this.#eventsList, this.#mainContainer);

    for (const point of points){
      this.#renderPoint(point, destinations, offersByType);
    }
  }

  #renderPoint = (point, destinations, offers) => {
    const pointComponent = new NewEventView(point, destinations, offers);
    const pointEditComponent = new NewEventEditorView(point, destinations, offers);

    const turnPointToEdit = () => {
      replace(pointEditComponent, pointComponent);
    };
    const turnPointToView = () => {
      replace(pointComponent, pointEditComponent);
    };

    const onEscKey = (evt) => {
      if (evt.key === 'Escape'){
        turnPointToView();
        document.removeEventListener('keyup', onEscKey);
      }
    };

    pointComponent.setRollupButtonClickHandler(() => {
      turnPointToEdit();
      document.addEventListener('keyup', onEscKey);
    });

    pointEditComponent.setRollupButtonClickHandler(() => {
      turnPointToView();
      document.removeEventListener('keyup', onEscKey);
    });

    pointEditComponent.setFormSubmitHandler(() => {
      turnPointToView();
      document.removeEventListener('keyup', onEscKey);
    });

    pointEditComponent.setFormResetHandler(() =>{
      turnPointToView();
      document.removeEventListener('keyup', onEscKey);
    });

    render(pointComponent, this.#eventsList.element);
  };
}

export {PointsDrawer};
