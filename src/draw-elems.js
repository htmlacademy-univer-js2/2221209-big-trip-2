import {NewFilterView} from './view/filter-view.js';
import {NewNavView} from './view/nav-view.js';
import {NewInfoView} from './view/info-view.js';
import {NewSortView} from './view/sort-view.js';
import {NewEventView} from './view/event-view.js';
import {NewElemListView} from './view/events-list-view.js';
import {NewEventEditorView} from './view/edit-event-view.js';
import {render, RenderPosition} from './render.js';
import {PointModel} from './model/point-model.js';
import {getDefaultPoint} from './util.js';

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
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      turnPointToEdit();
      document.addEventListener('keyup', onEscKey);
    });

    pointEditComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      turnPointToView();
      document.removeEventListener('keyup', onEscKey)
    });

    pointEditComponent.element.querySelector('.event--edit').addEventListener('submit', () => {
      turnPointToView();
      document.removeEventListener('keyup', onEscKey)
    });

    pointEditComponent.element.querySelector('.event--edit').addEventListener('reset', () => {
      turnPointToView();
      document.removeEventListener('keyup', onEscKey)
    });

    render(pointComponent, this.#eventsList.element);
  };

}

// const renderPoint = (point, destinations, offers, eventsList) => {
//   const pointComponent = new NewEventView(point, destinations, offers);
//   const pointEditComponent = new NewEventEditorView(point, destinations, offers);
//   const turnPointToEdit = () => {
//     eventsList[0].replaceChild(pointEditComponent.element, pointComponent.element);
//   };
//   const turnPointToView = () => {
//     eventsList[0].replaceChild(pointComponent.element, pointEditComponent.element);
//   };
//   render(pointComponent, eventsList[0]);
// };

// const init = () => {
//   const headerTrip = document.querySelector('.trip-main');
//   const siteMenuElement = headerTrip.querySelector('.trip-controls__navigation');

//   const siteFilterElement = headerTrip.querySelector('.trip-controls__filters');

//   const mainEvents = document.querySelector('.trip-events');

//   const pointModel = new PointModel();
//   const points = pointModel.getPoints();
//   const destinations = pointModel.getDestinations();
//   const offersByType = pointModel.getOffersByType();

//   render(new NewInfoView(), headerTrip, RenderPosition.AFTERBEGIN);
//   render(new NewNavView(), siteMenuElement);
//   render(new NewFilterView(), siteFilterElement);
//   render(new NewSortView(), mainEvents);

//   render(new NewElemListView(), mainEvents);

//   const eventsList = mainEvents.getElementsByClassName('trip-events__list');

//   points.forEach((point) => {
//     renderPoint(point, destinations, offersByType, eventsList[0]);
//   });

//   //const events = mainEvents.getElementsByClassName('trip-events__item');

//   //render(new NewEventEditorView(getDefaultPoint(), destinations, offersByType), eventsList[0], RenderPosition.AFTERBEGIN);
//   //render(new NewEventEditorView(points[0], destinations, offersByType), events[1], RenderPosition.AFTEREND);
// };

export {ElemsDrawer};
