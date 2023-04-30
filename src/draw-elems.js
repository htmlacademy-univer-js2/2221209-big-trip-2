import {NewFilterView} from './view/filter-view.js';
import {NewNavView} from './view/nav-view.js';
import {NewInfoView} from './view/info-view.js';
import {NewSortView} from './view/sort-view.js';
import {NewEventView} from './view/event-view.js';
import {NewElemListView} from './view/events-list-view.js';
import {NewEventEditorView} from './view/edit-event-view.js';
import {render, RenderPosition} from './render.js';
import {PointModel} from './model/point-model.js';
import { getDefaultPoint } from './util.js';

const renderPoint = (point, destinations, offers, eventsList) => {
  const pointComponent = new NewEventView(point, destinations, offers);
  const pointEditComponent = new NewEventEditorView(point, destinations, offers);
  const turnPointToEdit = () => {
    eventsList[0].replaceChild(pointEditComponent.element, pointComponent.element);
  };
  const turnPointToView = () => {
    eventsList[0].replaceChild(pointComponent.element, pointEditComponent.element);
  };
  render(pointComponent, eventsList[0]);
};

const init = () => {
  const headerTrip = document.querySelector('.trip-main');
  const siteMenuElement = headerTrip.querySelector('.trip-controls__navigation');

  const siteFilterElement = headerTrip.querySelector('.trip-controls__filters');

  const mainEvents = document.querySelector('.trip-events');

  const pointModel = new PointModel();
  const points = pointModel.getPoints();
  const destinations = pointModel.getDestinations();
  const offersByType = pointModel.getOffersByType();

  render(new NewInfoView(), headerTrip, RenderPosition.AFTERBEGIN);
  render(new NewNavView(), siteMenuElement);
  render(new NewFilterView(), siteFilterElement);
  render(new NewSortView(), mainEvents);

  render(new NewElemListView(), mainEvents);

  const eventsList = mainEvents.getElementsByClassName('trip-events__list');

  points.forEach((point) => {
    renderPoint(point, destinations, offersByType, eventsList[0]);
  });

  //const events = mainEvents.getElementsByClassName('trip-events__item');

  //render(new NewEventEditorView(getDefaultPoint(), destinations, offersByType), eventsList[0], RenderPosition.AFTERBEGIN);
  //render(new NewEventEditorView(points[0], destinations, offersByType), events[1], RenderPosition.AFTEREND);
};

export {init};
