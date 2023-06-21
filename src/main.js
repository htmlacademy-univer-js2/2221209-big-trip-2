import { FiltersDrawer } from './presenter/draw-filters.js';
import {PointsDrawer} from './presenter/draw-points.js';
import { PointModel } from './model/point-model.js';
import { RenderPosition, render } from './framework/render.js';
import { NewInfoView } from './view/info-view.js';
import { NewNavView } from './view/nav-view.js';
import { FilterModel } from './model/filter-model.js';
import { newEventButtonView } from './view/new-event-button-view.js';
import { EventsApiService } from './events-api-service.js';
import { Server } from './const.js';

const headerTrip = document.querySelector('.trip-main');
const controlsMenu = headerTrip.querySelector('.trip-controls');
const mainEvents = document.querySelector('.trip-events');
render(new NewInfoView(), headerTrip, RenderPosition.AFTERBEGIN);
render(new NewNavView(), controlsMenu);

const pointModel = new PointModel(new EventsApiService(Server.SERVER, Server.AUTHORIZATION));
pointModel.init();

const filterModel = new FilterModel();

const pointsDrawer = new PointsDrawer(mainEvents, pointModel, filterModel, newEventFormCloseHandler, resetFilter);
pointsDrawer.init();

const filtersDrawer = new FiltersDrawer(controlsMenu, pointModel, filterModel);
filtersDrawer.init();

const newEventButton = new newEventButtonView();
newEventButton.setBtnClickHandler(newEventBtnClickHandler);

function newEventFormCloseHandler() {
  newEventButton.enable();
}

function newEventBtnClickHandler() {
  pointsDrawer.createEvent();
  newEventButton.disable();
}

function resetFilter() {
  filtersDrawer.init();
}
