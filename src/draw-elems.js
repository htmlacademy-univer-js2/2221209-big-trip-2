import {NewFilterView} from './view/filter-view.js';
import {NewNavView} from './view/nav-view.js';
import {NewInfoView} from './view/info-view.js';
import {NewSortView} from './view/sort-view.js';
import {NewEventView} from './view/event-view.js';
import {NewElemListView} from './view/events-list-view.js';
import {NewEventEditorView} from './view/edit-event-view.js';
import {NewEmptyListView} from './view/empty-list-view.js';
import {render, RenderPosition} from './render.js';

class ElemsDrawer {
  #headerContainer = null;
  #pointModel = null;
  #mainContainer = null
  #controlsContainer = null
  #eventsList = null

  constructor(headerCon, controlsCon, mainCon, pointModel) {
    this.#controlsContainer = controlsCon;
    this.#headerContainer = headerCon;
    this.#pointModel= pointModel;
    this.#mainContainer = mainCon;
    this.#eventsList = new NewElemListView();
  }

  init(){
    const points = this.#pointModel.points;
    const destinations = this.#pointModel.destinations;
    const offersByType = this.#pointModel.offersByType;

    render(new NewInfoView(), this.#headerContainer, RenderPosition.AFTERBEGIN);
    render(new NewNavView(), this.#controlsContainer);
    render(new NewFilterView(), this.#controlsContainer);

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
      this.#eventsList.element.replaceChild(pointEditComponent.element, pointComponent.element);
    };
    const turnPointToView = () => {
      this.#eventsList.element.replaceChild(pointComponent.element, pointEditComponent.element);
    };

    const onEscKey = (evt) => {
      if (evt.key === 'Escape'){
        turnPointToView();
        document.removeEventListener('keyup', onEscKey);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      turnPointToEdit();
      document.addEventListener('keyup', onEscKey);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      turnPointToView();
      document.removeEventListener('keyup', onEscKey);
    });

    pointEditComponent.element.querySelector('.event--edit').addEventListener('submit', () => {
      turnPointToView();
      document.removeEventListener('keyup', onEscKey);
    });

    pointEditComponent.element.querySelector('.event--edit').addEventListener('reset', () => {
      turnPointToView();
      document.removeEventListener('keyup', onEscKey);
    });

    render(pointComponent, this.#eventsList.element);
  };
}

export {ElemsDrawer};
