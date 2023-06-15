import { FiltersDrawer } from './presenter/draw-filters.js';
import {PointsDrawer} from './presenter/draw-points.js';
import { PointModel } from './model/point-model.js';
import { RenderPosition, render } from './framework/render.js';
import { NewInfoView } from './view/info-view.js';
import { NewNavView } from './view/nav-view.js';

const headerTrip = document.querySelector('.trip-main');
const controlsMenu = headerTrip.querySelector('.trip-controls');
const mainEvents = document.querySelector('.trip-events');
render(new NewInfoView(), headerTrip, RenderPosition.AFTERBEGIN);
render(new NewNavView(), controlsMenu);

const pointModel = new PointModel();
const pointsDrawer = new PointsDrawer(mainEvents, pointModel);
pointsDrawer.init();

const filtersDrawer = new FiltersDrawer(controlsMenu, pointModel);
filtersDrawer.init();
